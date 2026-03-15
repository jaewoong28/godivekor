import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
    .update({ title, type, start, end, description, color })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
