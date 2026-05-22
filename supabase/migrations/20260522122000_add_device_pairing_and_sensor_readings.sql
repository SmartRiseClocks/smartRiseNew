-- Temporary pairing codes for claiming a physical device from the dashboard.
CREATE TABLE public.device_pairing_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  claimed_at TIMESTAMPTZ,
  claimed_device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT device_pairing_codes_code_format CHECK (code ~ '^[0-9]{6}$'),
  CONSTRAINT device_pairing_codes_expiry_order CHECK (expires_at > created_at)
);

CREATE INDEX device_pairing_codes_user_expires_idx
  ON public.device_pairing_codes (user_id, expires_at DESC);

ALTER TABLE public.device_pairing_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "device_pairing_codes_select_own"
  ON public.device_pairing_codes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "device_pairing_codes_insert_own"
  ON public.device_pairing_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "device_pairing_codes_delete_own"
  ON public.device_pairing_codes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "device_pairing_codes_update_own"
  ON public.device_pairing_codes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.issue_device_pairing_code()
RETURNS TABLE (
  pairing_id UUID,
  code TEXT,
  expires_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  new_expires_at TIMESTAMPTZ := now() + interval '10 minutes';
  inserted_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  DELETE FROM public.device_pairing_codes
  WHERE user_id = auth.uid()
    AND claimed_at IS NULL
    AND expires_at > now();

  LOOP
    new_code := lpad(floor(random() * 1000000)::INT::TEXT, 6, '0');

    BEGIN
      INSERT INTO public.device_pairing_codes (user_id, code, expires_at)
      VALUES (auth.uid(), new_code, new_expires_at)
      RETURNING id INTO inserted_id;
      EXIT;
    EXCEPTION
      WHEN unique_violation THEN
        NULL;
    END;
  END LOOP;

  RETURN QUERY
  SELECT inserted_id, new_code, new_expires_at;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.issue_device_pairing_code() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.issue_device_pairing_code() TO authenticated;

-- Sensor values linked to a specific user-owned device.
CREATE TABLE public.sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'arduino',
  temperature_c NUMERIC(5, 2),
  humidity_pct NUMERIC(5, 2),
  light_lux NUMERIC(10, 2),
  motion_detected BOOLEAN,
  sound_level_db NUMERIC(6, 2),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT sensor_readings_source_length CHECK (char_length(source) BETWEEN 1 AND 40)
);

CREATE INDEX sensor_readings_user_recorded_idx
  ON public.sensor_readings (user_id, recorded_at DESC);

CREATE INDEX sensor_readings_device_recorded_idx
  ON public.sensor_readings (device_id, recorded_at DESC);

ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sensor_readings_select_own"
  ON public.sensor_readings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "sensor_readings_insert_own"
  ON public.sensor_readings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
