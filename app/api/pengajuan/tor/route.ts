import { NextResponse } from "next/server";
import { backendSupabase } from "@/app/lib/supabaseClient";
import { verifyTokenFromRequest } from "@/app/lib/auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // ganti domain frontend saat production
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  // ⛔ WAJIB untuk CORS preflight
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    verifyTokenFromRequest(req);

    const { data, error } = await backendSupabase
      .from("tor_database_tables")
      .select(
        `
        *,
        user_list (
          id,
          name,
          roles_id
        )
      `,
      )
      .order("tanggal_pengajuan", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ tor_list: data });
  } catch (err: any) {
    console.error("Error fetching TOR list:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || "INTERNAL_ERROR";
    return NextResponse.json(
      {
        error: err.message,
        code: errorCode,
        timeStamp: new Date().toString(),
      },
      { status: statusCode },
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = verifyTokenFromRequest(req);

    const body = await req.json();
    const {
      nomor_surat,
      nama_kegiatan,
      tujuan,
      latar_belakang,
      tanggal_pengajuan,
      nominal_pengajuan,
      peserta,
      jadwal_awal,
      jadwal_akhir,
      anggaran,
      pic,
      upload_file,
    } = body;

    if (
      !nomor_surat ||
      !nama_kegiatan ||
      !tujuan ||
      !latar_belakang ||
      !tanggal_pengajuan ||
      !nominal_pengajuan ||
      !peserta ||
      !jadwal_awal ||
      !jadwal_akhir ||
      !anggaran ||
      !pic ||
      !upload_file
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const { data, error } = await backendSupabase
      .from("tor_database_tables")
      .insert([
        {
          nomor_surat,
          nama_kegiatan,
          tujuan,
          latar_belakang,
          tanggal_pengajuan,
          nominal_pengajuan,
          peserta,
          jadwal_awal,
          jadwal_akhir,
          anggaran,
          pic,
          upload_file,

          // 🔥 FIX FK
          pengaju_id: user.id,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: "TOR submitted successfully", tor: data },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
        code: err.code || "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    verifyTokenFromRequest(req);

    const body = await req.json();
    const {
      id,
      nomor_surat,
      nama_kegiatan,
      tujuan,
      latar_belakang,
      tanggal_pengajuan,
      nominal_pengajuan,
      peserta,
      jadwal_awal,
      jadwal_akhir,
      anggaran,
      pic,
      upload_file,
      pengaju_id,
      user_id,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "TOR ID is required" },
        { status: 400 },
      );
    }

    // Validasi required fields
    if (
      !nomor_surat ||
      !nama_kegiatan ||
      !tujuan ||
      !latar_belakang ||
      !tanggal_pengajuan ||
      !nominal_pengajuan ||
      !peserta ||
      !jadwal_awal ||
      !jadwal_akhir ||
      !anggaran ||
      !pic ||
      !upload_file ||
      !pengaju_id ||
      !user_id
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const { data, error } = await backendSupabase
      .from("tor_database_tables")
      .update({
        nomor_surat,
        nama_kegiatan,
        tujuan,
        latar_belakang,
        tanggal_pengajuan,
        nominal_pengajuan,
        peserta,
        jadwal_awal,
        jadwal_akhir,
        anggaran,
        pic,
        upload_file,
        pengaju_id,
        user_id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "TOR not found" }, { status: 404 });
      }
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Pengaju already has a TOR submission" },
          { status: 409 },
        );
      }
      throw error;
    }

    return NextResponse.json({
      message: "TOR updated successfully",
      tor: data,
    });
  } catch (err: any) {
    console.error("Error updating TOR:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || "INTERNAL_ERROR";
    return NextResponse.json(
      {
        error: err.message,
        code: errorCode,
        timeStamp: new Date().toString(),
      },
      { status: statusCode },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    verifyTokenFromRequest(req);

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "TOR ID is required" },
        { status: 400 },
      );
    }

    const { error } = await backendSupabase
      .from("tor_database_tables")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "TOR not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ message: "TOR deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting TOR:", err);
    const statusCode = err.status || 500;
    const errorCode = err.code || "INTERNAL_ERROR";
    return NextResponse.json(
      {
        error: err.message,
        code: errorCode,
        timeStamp: new Date().toString(),
      },
      { status: statusCode },
    );
  }
}
