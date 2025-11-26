import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("transaksi")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(req : Request) {
  const body = await req.json();

  const { anggaran_id, jenis_transaksi, jumlah, keterangan, tanggal } = body;

  if (!anggaran_id || !jenis_transaksi || !jumlah || !tanggal) {
    return NextResponse.json(
      { error: "Field anggaran_id, jenis_transaksi, jumlah, tanggal wajib diisi." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("transaksi")
    .insert([
      {
        anggaran_id,
        jenis_transaksi,
        jumlah,
        keterangan,
        tanggal,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Transaksi berhasil dibuat", data },
    { status: 201 }
  );
}
