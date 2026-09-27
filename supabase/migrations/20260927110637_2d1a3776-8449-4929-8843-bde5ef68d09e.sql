CREATE POLICY "Users can view own analytics events"
ON public.analytics_events
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

GRANT SELECT ON public.analytics_events TO authenticated;