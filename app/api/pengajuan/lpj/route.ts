import { NextResponse } from "next/server";
import { backendSupabase } from "@/app/lib/supabaseClient";
import { verifyTokenFromRequest } from "@/app/lib/auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // ganti domain frontend saat production
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const isEmpty = (v: any) => v === undefined || v === null || v === "";

export async function OPTIONS() {
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
        admin_list:admin_id (
          id,
          admin_name,
          email
        )
      `,
      )
      .order("jadwal_awal", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ lpj_list: data }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
        code: err.code || "INTERNAL_ERROR",
        timeStamp: new Date().toISOString(),
      },
      { status: err.status || 500, headers: corsHeaders },
    );
  }
}

export async function POST(req: Request) {
  try {
    verifyTokenFromRequest(req);
    const body = await req.json();

    const requiredFields = [
      "nama_kegiatan",
      "tujuan",
      "latar_belakang",
      "peserta_mahasiswa",
      "jadwal_awal",
      "jadwal_akhir",
      "estimasi_jadwal",
      "dana_diajukan",
      "pic",
      "upload_file",
      "admin_id",
      "admin_name",
    ];

    for (const field of requiredFields) {
      if (isEmpty(body[field])) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400, headers: corsHeaders },
        );
      }
    }

    const { data, error } = await backendSupabase
      .from("lpj_database_tables")
      .insert([
        {
          ...body,
          status: body.status || "pending",
          catatan_pengajuan: body.catatan_pengajuan || null,
          peserta_dosen: body.peserta_dosen || null,
          peserta_alumni: body.peserta_alumni || null,
          dana_terpakai: body.dana_terpakai || null,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "23503") {
        return NextResponse.json(
          { error: "Admin ID not found" },
          { status: 400, headers: corsHeaders },
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: "LPJ submitted successfully", lpj: data },
      { status: 201, headers: corsHeaders },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
        code: err.code || "INTERNAL_ERROR",
        timeStamp: new Date().toISOString(),
      },
      { status: err.status || 500, headers: corsHeaders },
    );
  }
}

export async function PUT(req: Request) {
  try {
    verifyTokenFromRequest(req);
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "LPJ ID is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const { id, ...payload } = body;

    const { data, error } = await backendSupabase
      .from("lpj_database_tables")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: "LPJ updated successfully", lpj: data },
      { headers: corsHeaders },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
        code: err.code || "INTERNAL_ERROR",
        timeStamp: new Date().toISOString(),
      },
      { status: err.status || 500, headers: corsHeaders },
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
        { status: 400, headers: corsHeaders },
      );
    }

    const { error } = await backendSupabase
      .from("lpj_database_tables")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json(
      { message: "LPJ deleted successfully" },
      { headers: corsHeaders },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
        code: err.code || "INTERNAL_ERROR",
        timeStamp: new Date().toISOString(),
      },
      { status: err.status || 500, headers: corsHeaders },
    );
  }
}
