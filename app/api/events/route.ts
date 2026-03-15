import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { events as fallbackEvents } from "@/data/events";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(fallbackEvents);
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start", { ascending: true });

  if (error) {
    return NextResponse.json(fallbackEvents);
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase가 설정되지 않았습니다" },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("x-admin-password");
  if (authHeader !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, type, start, end, description } = body;
  const color = type === "education" ? "#006699" : "#f09a3e";

  const { data, error } = await supabase
    .from("events")
    .insert([{ title, type, start, end, description, color }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
