import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import { verifyTokenFromRequest } from "@/app/lib/auth";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;

    const { data, error } = await supabase
      .from("transaksi")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ transaksi: data });
  } catch (err: any) {
    console.error("Error fetching transaksi:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code: errorCode,
      timeStamp: new Date().toString()
    }, { status: statusCode });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;
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
      .update({
        anggaran_id,
        jenis_transaksi,
        jumlah,
        keterangan,
        tanggal,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ 
      message: "Transaksi berhasil diupdate", 
      transaksi: data 
    });
  } catch (err: any) {
    console.error("Error updating transaksi:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code: errorCode,
      timeStamp: new Date().toString()
    }, { status: statusCode });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;

    const { error } = await supabase
      .from("transaksi")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ message: "Transaksi berhasil dihapus" });
  } catch (err: any) {
    console.error("Error deleting transaksi:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code: errorCode,
      timeStamp: new Date().toString()
    }, { status: statusCode });
  }
}