import { getSupabaseClient } from "@/lib/supabase/client";

interface TrackUsageEventInput {
  eventName: string;
  stationId?: string;
  eventMetadata?: Record<string, unknown>;
}

export async function trackUsageEvent(input: TrackUsageEventInput): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from("usage_events")
    .insert({
      event_name: input.eventName,
      station_id: input.stationId,
      event_metadata: input.eventMetadata ?? {},
    });

  if (error) {
    // Analytics should never block the user flow.
  }
}
