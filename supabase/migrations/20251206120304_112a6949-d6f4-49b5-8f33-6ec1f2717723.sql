-- Fix advisor_subscriptions INSERT policy to only allow users to create their own subscriptions
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.advisor_subscriptions;

CREATE POLICY "Users can insert their own advisor subscription"
ON public.advisor_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add INSERT policy for credit_transactions - only allow via security definer functions (system-level)
-- Users should NOT be able to directly insert credit transactions
CREATE POLICY "System can insert credit transactions"
ON public.credit_transactions
FOR INSERT
TO authenticated
WITH CHECK (false);  -- Block direct inserts, only allow via SECURITY DEFINER functions

-- Add UPDATE policy for credit_transactions - prevent any updates
CREATE POLICY "Credit transactions cannot be updated"
ON public.credit_transactions
FOR UPDATE
TO authenticated
USING (false);  -- Block all updates

-- Add DELETE policy for credit_transactions - prevent any deletes
CREATE POLICY "Credit transactions cannot be deleted"
ON public.credit_transactions
FOR DELETE
TO authenticated
USING (false);  -- Block all deletes

-- Add INSERT policy for portfolio_performance_history - only system/admin level
CREATE POLICY "System can insert performance history"
ON public.portfolio_performance_history
FOR INSERT
TO authenticated
WITH CHECK (false);  -- Block direct inserts, only via SECURITY DEFINER functions

-- Add UPDATE policy for portfolio_performance_history - prevent updates
CREATE POLICY "Performance history cannot be updated"
ON public.portfolio_performance_history
FOR UPDATE
TO authenticated
USING (false);  -- Block all updates

-- Add DELETE policy for portfolio_performance_history - prevent deletes
CREATE POLICY "Performance history cannot be deleted"
ON public.portfolio_performance_history
FOR DELETE
TO authenticated
USING (false);  -- Block all deletes