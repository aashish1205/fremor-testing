-- 1. Add the role column to public.fremor_team table
ALTER TABLE public.fremor_team ADD COLUMN IF NOT EXISTS role text DEFAULT 'All';

-- 2. Drop the old login function to avoid signature conflicts
DROP FUNCTION IF EXISTS public.team_login(text, text);

-- 3. Recreate the login function to return all columns (using SETOF)
CREATE OR REPLACE FUNCTION public.team_login(p_email text, p_password text)
RETURNS SETOF public.fremor_team
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.fremor_team
  WHERE email = p_email AND password = p_password;
END;
$$;
