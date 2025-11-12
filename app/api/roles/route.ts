import { NextResponse } from "next/server";
import { backendSupabase } from "@/app/lib/supabaseClient";

// GET → ambil semua role
export async function GET() {
  try {
    const { data, error } = await backendSupabase
      .from("roles_table")
      .select("id_roles, name_roles, keterangan")
      .order("id_roles", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ roles: data });
  } catch (err: any) {
    console.error("Error fetching roles:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST → tambah role baru
export async function POST(req: Request) {
  try {
    const { name_roles, keterangan } = await req.json();

    if (!name_roles) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    const { data, error } = await backendSupabase
      .from("roles_table")
      .insert([{ name_roles, keterangan: keterangan || "" }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: "Role added successfully", role: data });
  } catch (err: any) {
    console.error("Error adding role:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE → hapus role berdasarkan ID
export async function DELETE(req: Request) {
  try {
    const { id_roles } = await req.json();

    if (!id_roles) {
      return NextResponse.json({ error: "Role ID is required" }, { status: 400 });
    }

    const { error } = await backendSupabase
      .from("roles_table")
      .delete()
      .eq("id_roles", id_roles);

    if (error) throw error;

    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting role:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
