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
      .from("lpj_database_tables")
      .select(
        `
        *,
        admin_list (
          id,
          admin_name,
          email
        )
      `,
      )
      .order("jadwal_awal", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ lpj_list: data });
  } catch (err: any) {
    console.error("Error fetching LPJ list:", err);
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
    verifyTokenFromRequest(req);

    const body = await req.json();
    const {
      nomor_surat,
      nama_kegiatan,
      tujuan,
      latar_belakang,
      peserta,
      jadwal_awal,
      jadwal_akhir,
      anggaran,
      pic,
      upload_file,
      estimasi_jadwal,
      status,
      catatan_pengajuan,
      admin_id,
      admin_name,
    } = body;

    // Validasi required fields
    if (
      !nomor_surat ||
      !nama_kegiatan ||
      !tujuan ||
      !latar_belakang ||
      !peserta ||
      !jadwal_awal ||
      !jadwal_akhir ||
      !anggaran ||
      !pic ||
      !upload_file ||
      !estimasi_jadwal ||
      !admin_id ||
      !admin_name
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 },
      );
    }

    // Set default status jika tidak ada
    const finalStatus = status || "pending";

    const { data, error } = await backendSupabase
      .from("lpj_database_tables")
      .insert([
        {
          nomor_surat,
          nama_kegiatan,
          tujuan,
          latar_belakang,
          peserta,
          jadwal_awal,
          jadwal_akhir,
          anggaran,
          pic,
          upload_file,
          estimasi_jadwal,
          status: finalStatus,
          catatan_pengajuan: catatan_pengajuan || null,
          admin_id,
          admin_name,
        },
      ])
      .select()
      .single();

    if (error) {
      // Handle foreign key violation
      if (error.code === "23503") {
        return NextResponse.json(
          { error: "Admin ID not found" },
          { status: 400 },
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: "LPJ submitted successfully", lpj: data },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Error creating LPJ:", err);
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
      peserta,
      jadwal_awal,
      jadwal_akhir,
      anggaran,
      pic,
      upload_file,
      estimasi_jadwal,
      status,
      catatan_pengajuan,
      admin_id,
      admin_name,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "LPJ ID is required" },
        { status: 400 },
      );
    }

    // Validasi required fields
    if (
      !nomor_surat ||
      !nama_kegiatan ||
      !tujuan ||
      !latar_belakang ||
      !peserta ||
      !jadwal_awal ||
      !jadwal_akhir ||
      !anggaran ||
      !pic ||
      !upload_file ||
      !estimasi_jadwal ||
      !admin_id ||
      !admin_name
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 },
      );
    }

    const { data, error } = await backendSupabase
      .from("lpj_database_tables")
      .update({
        nomor_surat,
        nama_kegiatan,
        tujuan,
        latar_belakang,
        peserta,
        jadwal_awal,
        jadwal_akhir,
        anggaran,
        pic,
        upload_file,
        estimasi_jadwal,
        status,
        catatan_pengajuan: catatan_pengajuan || null,
        admin_id,
        admin_name,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "LPJ not found" }, { status: 404 });
      }
      if (error.code === "23503") {
        return NextResponse.json(
          { error: "Admin ID not found" },
          { status: 400 },
        );
      }
      throw error;
    }

    return NextResponse.json({
      message: "LPJ updated successfully",
      lpj: data,
    });
  } catch (err: any) {
    console.error("Error updating LPJ:", err);
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
        { error: "LPJ ID is required" },
        { status: 400 },
      );
    }

    const { error } = await backendSupabase
      .from("lpj_database_tables")
      .delete()
      .eq("id", id);

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "LPJ not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ message: "LPJ deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting LPJ:", err);
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
