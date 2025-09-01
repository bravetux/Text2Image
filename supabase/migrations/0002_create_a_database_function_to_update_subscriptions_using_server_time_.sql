CREATE OR REPLACE FUNCTION public.update_user_subscription(
  user_id_to_update uuid,
  new_plan_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET
    subscription_plan = new_plan_name,
    subscription_status = 'active',
    subscribed_at = now(),
    subscription_expires_at = now() + interval '1 month',
    updated_at = now()
  WHERE id = user_id_to_update;
END;
$$;