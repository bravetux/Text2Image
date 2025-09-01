ALTER TABLE public.profiles
ADD COLUMN subscription_plan TEXT,
ADD COLUMN subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN subscribed_at TIMESTAMPTZ,
ADD COLUMN subscription_expires_at TIMESTAMPTZ;