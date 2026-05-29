import { createClient } from "jsr:@supabase/supabase-js@2";

type ArduinoPayload = {
  device_id?: string;
  pairing_code?: string;
  light_lux?: number | null;
  alarm_hour?: number | null;
  alarm_minute?: number | null;
  alarm_active?: boolean | null;
};

const LIGHT_THRESHOLD = 420;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-device-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const ingestSecret = Deno.env.get("ARDUINO_INGEST_SECRET");

  if (!supabaseUrl || !serviceRoleKey || !ingestSecret) {
    return json(500, { error: "Missing function environment configuration" });
  }

  const providedSecret = request.headers.get("x-device-secret");
  if (providedSecret !== ingestSecret) {
    return json(401, { error: "Invalid device secret" });
  }

  let payload: ArduinoPayload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const rawDeviceId = String(payload.device_id ?? "").trim();
  const pairingCode = String(payload.pairing_code ?? "").trim();

  if (!rawDeviceId) {
    return json(400, { error: "device_id is required" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let deviceRecord:
    | {
        id: string;
        user_id: string;
        device_id: string;
      }
    | null = null;

  const { data: existingDevice, error: existingDeviceError } = await supabase
    .from("devices")
    .select("id, user_id, device_id")
    .eq("device_id", rawDeviceId)
    .maybeSingle();

  if (existingDeviceError) {
    return json(500, { error: existingDeviceError.message });
  }

  deviceRecord = existingDevice;

  if (!deviceRecord) {
    if (!pairingCode) {
      return json(409, { error: "Unknown device_id. Pairing code required for first connection." });
    }

    const { data: pairingEntry, error: pairingError } = await supabase
      .from("device_pairing_codes")
      .select("id, user_id, expires_at, claimed_at")
      .eq("code", pairingCode)
      .is("claimed_at", null)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (pairingError) {
      return json(500, { error: pairingError.message });
    }

    if (!pairingEntry) {
      return json(409, { error: "Invalid or expired pairing_code" });
    }

    const { data: createdDevice, error: createDeviceError } = await supabase
      .from("devices")
      .insert({
        user_id: pairingEntry.user_id,
        device_id: rawDeviceId,
        name: null,
      })
      .select("id, user_id, device_id")
      .single();

    if (createDeviceError) {
      return json(500, { error: createDeviceError.message });
    }

    const { error: claimError } = await supabase
      .from("device_pairing_codes")
      .update({
        claimed_at: new Date().toISOString(),
        claimed_device_id: createdDevice.id,
      })
      .eq("id", pairingEntry.id);

    if (claimError) {
      return json(500, { error: claimError.message });
    }

    deviceRecord = createdDevice;
  }

  const { error: insertReadingError } = await supabase.from("sensor_readings").insert({
    user_id: deviceRecord.user_id,
    device_id: deviceRecord.id,
    light_lux: payload.light_lux ?? null,
    alarm_hour: payload.alarm_hour ?? null,
    alarm_minute: payload.alarm_minute ?? null,
    alarm_active: payload.alarm_active ?? null,
  });

  if (insertReadingError) {
    return json(500, { error: insertReadingError.message });
  }

  const alarmActive = payload.alarm_active === true;
  const lightLux = payload.light_lux ?? null;

  if (alarmActive) {
    const { data: openWakeEvent, error: openWakeEventError } = await supabase
      .from("wake_events")
      .select("id, light_on")
      .eq("device_id", deviceRecord.id)
      .is("light_on", null)
      .order("alarm_start", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (openWakeEventError) {
      return json(500, { error: openWakeEventError.message });
    }

    let wakeEventId = openWakeEvent?.id ?? null;

    if (!wakeEventId) {
      const { data: createdWakeEvent, error: createWakeEventError } = await supabase
        .from("wake_events")
        .insert({
          user_id: deviceRecord.user_id,
          device_id: deviceRecord.id,
          alarm_start: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (createWakeEventError) {
        return json(500, { error: createWakeEventError.message });
      }

      wakeEventId = createdWakeEvent.id;
    }

    if (wakeEventId && lightLux != null && lightLux > LIGHT_THRESHOLD) {
      const { error: closeWakeEventError } = await supabase
        .from("wake_events")
        .update({
          light_on: new Date().toISOString(),
        })
        .eq("id", wakeEventId)
        .is("light_on", null);

      if (closeWakeEventError) {
        return json(500, { error: closeWakeEventError.message });
      }
    }
  }

  return json(200, {
    ok: true,
    device_id: deviceRecord.device_id,
    linked_user_id: deviceRecord.user_id,
  });
});
