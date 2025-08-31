-- Drop the existing, incorrect insert policy
DROP POLICY IF EXISTS profiles_insert_policy ON public.profiles;

-- Create a new, secure insert policy that allows users to create their own profile
CREATE POLICY "profiles_insert_policy" ON public.profiles 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);