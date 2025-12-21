import { NextResponse } from "next/server";
import { backendSupabase } from "@/app/lib/supabaseClient";
import { verifyTokenFromRequest } from "@/app/lib/auth";

/* =========================
   CORS CONFIG
========================= */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // ganti domain frontend saat production
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/* =========================
   HELPER RESPONSE
========================= */
const withCors = (body: any, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: corsHeaders,
  });

/* =========================
   OPTIONS (PRE-FLIGHT)
========================= */
export async function OPTIONS() {
  return withCors({});
}

/* =========================
   GET TOR LIST
========================= */
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

    return withCors({ tor_list: data });
  } catch (err: any) {
    console.error("GET TOR ERROR:", err);

    return withCors(
      {
        error: err.message,
        code: err.code || "INTERNAL_ERROR",
        timeStamp: new Date().toISOString(),
      },
      err.status || 500,
    );
  }
}

/* =========================
   POST TOR
========================= */
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
      return withCors({ error: "All fields are required" }, 400);
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

          // FK FIX
          pengaju_id: user.id,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return withCors(
      {
        message: "TOR submitted successfully",
        tor: data,
      },
      201,
    );
  } catch (err: any) {
    console.error("POST TOR ERROR:", err);

    return withCors(
      {
        error: err.message,
        code: err.code || "INTERNAL_ERROR",
      },
      500,
    );
  }
}

/* =========================
   PUT TOR
========================= */
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

    if (!id) return withCors({ error: "TOR ID is required" }, 400);

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
      return withCors({ error: "All fields are required" }, 400);
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

    if (error) throw error;

    return withCors({
      message: "TOR updated successfully",
      tor: data,
    });
  } catch (err: any) {
    console.error("PUT TOR ERROR:", err);

    return withCors(
      {
        error: err.message,
        code: err.code || "INTERNAL_ERROR",
      },
      err.status || 500,
    );
  }
}

/* =========================
   DELETE TOR
========================= */
export async function DELETE(req: Request) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await req.json();

    if (!id) return withCors({ error: "TOR ID is required" }, 400);

    const { error } = await backendSupabase
      .from("tor_database_tables")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return withCors({ message: "TOR deleted successfully" });
  } catch (err: any) {
    console.error("DELETE TOR ERROR:", err);

    return withCors(
      {
        error: err.message,
        code: err.code || "INTERNAL_ERROR",
      },
      err.status || 500,
    );
  }
}
