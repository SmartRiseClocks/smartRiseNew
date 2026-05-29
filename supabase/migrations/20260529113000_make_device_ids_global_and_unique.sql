ALTER TABLE public.devices
  DROP CONSTRAINT IF EXISTS devices_user_id_device_id_key;

ALTER TABLE public.devices
  ADD CONSTRAINT devices_device_id_key UNIQUE (device_id);
