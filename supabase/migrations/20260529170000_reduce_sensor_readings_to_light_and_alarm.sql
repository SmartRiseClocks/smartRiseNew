ALTER TABLE public.sensor_readings
  ADD COLUMN IF NOT EXISTS alarm_hour SMALLINT,
  ADD COLUMN IF NOT EXISTS alarm_minute SMALLINT,
  ADD COLUMN IF NOT EXISTS alarm_active BOOLEAN;

UPDATE public.sensor_readings
SET
  alarm_hour = CASE
    WHEN jsonb_typeof(payload -> 'alarm_hour') = 'number'
      THEN (payload ->> 'alarm_hour')::SMALLINT
    ELSE alarm_hour
  END,
  alarm_minute = CASE
    WHEN jsonb_typeof(payload -> 'alarm_minute') = 'number'
      THEN (payload ->> 'alarm_minute')::SMALLINT
    ELSE alarm_minute
  END,
  alarm_active = CASE
    WHEN jsonb_typeof(payload -> 'alarm_active') = 'boolean'
      THEN (payload ->> 'alarm_active')::BOOLEAN
    ELSE alarm_active
  END;

ALTER TABLE public.sensor_readings
  DROP COLUMN IF EXISTS temperature_c,
  DROP COLUMN IF EXISTS humidity_pct,
  DROP COLUMN IF EXISTS motion_detected,
  DROP COLUMN IF EXISTS sound_level_db,
  DROP COLUMN IF EXISTS payload,
  DROP COLUMN IF EXISTS source;

ALTER TABLE public.sensor_readings
  ADD CONSTRAINT sensor_readings_alarm_hour_range
    CHECK (alarm_hour IS NULL OR (alarm_hour BETWEEN 0 AND 23)),
  ADD CONSTRAINT sensor_readings_alarm_minute_range
    CHECK (alarm_minute IS NULL OR (alarm_minute BETWEEN 0 AND 59));
