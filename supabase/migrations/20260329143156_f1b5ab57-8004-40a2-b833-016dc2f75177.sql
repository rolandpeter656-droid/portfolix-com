
-- Portfolio Archetypes table
CREATE TABLE public.portfolio_archetypes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  archetype_code VARCHAR NOT NULL UNIQUE,
  goal VARCHAR NOT NULL,
  timeline VARCHAR NOT NULL,
  risk_tolerance VARCHAR NOT NULL,
  allocations JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_return_min DECIMAL,
  target_return_max DECIMAL,
  max_drawdown DECIMAL,
  expense_ratio_weighted DECIMAL,
  sharpe_ratio_target DECIMAL,
  risk_flag BOOLEAN NOT NULL DEFAULT false,
  risk_flag_message TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  updated_by TEXT DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- RLS: public read for active archetypes, admin-only write
ALTER TABLE public.portfolio_archetypes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active archetypes"
  ON public.portfolio_archetypes FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage archetypes"
  ON public.portfolio_archetypes FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Portfolio Archetype History table
CREATE TABLE public.portfolio_archetype_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  archetype_code VARCHAR NOT NULL,
  previous_allocations JSONB,
  new_allocations JSONB NOT NULL,
  change_reason TEXT,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  changed_by TEXT NOT NULL DEFAULT 'system'
);

ALTER TABLE public.portfolio_archetype_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read archetype history"
  ON public.portfolio_archetype_history FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert archetype history"
  ON public.portfolio_archetype_history FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger to auto-log changes to history
CREATE OR REPLACE FUNCTION public.log_archetype_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.allocations IS DISTINCT FROM NEW.allocations THEN
    INSERT INTO public.portfolio_archetype_history (
      archetype_code, previous_allocations, new_allocations, change_reason, changed_by
    ) VALUES (
      NEW.archetype_code, OLD.allocations, NEW.allocations,
      'Allocation updated via admin', NEW.updated_by
    );
    NEW.version := OLD.version + 1;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER archetype_change_trigger
  BEFORE UPDATE ON public.portfolio_archetypes
  FOR EACH ROW
  EXECUTE FUNCTION public.log_archetype_change();
