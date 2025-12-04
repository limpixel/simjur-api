import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import { verifyTokenFromRequest } from "@/app/lib/auth";

export async function GET(req: Request) {
  try {
    verifyTokenFromRequest(req);
    
    const { data, error } = await supabase
      .from("transaksi")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

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

export async function POST(req: Request) {
  try {
    verifyTokenFromRequest(req);
    
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

    if (error) throw error;

    return NextResponse.json(
      { message: "Transaksi berhasil dibuat", transaksi: data },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating transaksi:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    return NextResponse.json({ 
      error: err.message,
      code: errorCode,
      timeStamp: new Date().toString()
    }, { status: statusCode });
  }
}

// PUT → update transaksi berdasarkan ID (dari body)
export async function PUT(req: Request) {
  try {
    verifyTokenFromRequest(req);
    
    const { id, anggaran_id, jenis_transaksi, jumlah, keterangan, tanggal } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Transaksi ID is required" },
        { status: 400 }
      );
    }

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
        return NextResponse.json({ error: "Transaksi not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ 
      message: "Transaksi updated successfully", 
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

// DELETE → hapus transaksi berdasarkan ID (dari body)
export async function DELETE(req: Request) {
  try {
    verifyTokenFromRequest(req);
    
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Transaksi ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("transaksi")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Transaksi not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ message: "Transaksi deleted successfully" });
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