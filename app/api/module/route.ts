import { NextResponse } from "next/server";
import { backendSupabase } from "@/app/lib/supabaseClient";

// GET → ambil semua module
export async function GET() {
  try {
    const { data, error } = await backendSupabase
      .from("module")
      .select("id, module_name, description")
      .order("id", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ modules: data });
  } catch (err: any) {
    console.error("Error fetching modules:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST → tambah module baru
export async function POST(req: Request) {
  try {
    const { module_name, description } = await req.json();

    if (!module_name) {
      return NextResponse.json({ error: "Module name is required" }, { status: 400 });
    }

    const { data, error } = await backendSupabase
      .from("module")
      .insert([{ module_name, description: description || "" }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: "Module added successfully", module: data });
  } catch (err: any) {
    console.error("Error adding module:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE → hapus module
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Module ID is required" }, { status: 400 });
    }

    const { error } = await backendSupabase
      .from("module")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Module deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting module:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
