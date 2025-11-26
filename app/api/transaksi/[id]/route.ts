import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const { data, error } = await supabase
    .from("transaksi")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

  const { anggaran_id, jenis_transaksi, jumlah, keterangan, tanggal } = body;

  const { data, error } = await supabase
    .from("transaksi")
    .update({
      anggaran_id,
      jenis_transaksi,
      jumlah,
      keterangan,
      tanggal,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Berhasil update transaksi", data });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const { error } = await supabase.from("transaksi").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Transaksi berhasil dihapus" });
}
