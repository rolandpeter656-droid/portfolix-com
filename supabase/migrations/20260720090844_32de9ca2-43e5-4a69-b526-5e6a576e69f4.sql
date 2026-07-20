CREATE POLICY "NG whitelist readable by authenticated" ON public.ng_whitelist FOR SELECT TO authenticated USING (true);
CREATE POLICY "NG whitelist readable by anon" ON public.ng_whitelist FOR SELECT TO anon USING (true);
CREATE POLICY "NG config readable by authenticated" ON public.ng_allocation_config FOR SELECT TO authenticated USING (true);
CREATE POLICY "NG config readable by anon" ON public.ng_allocation_config FOR SELECT TO anon USING (true);