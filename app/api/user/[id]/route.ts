import { backendSupabase } from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";
import { verifyTokenFromRequest } from "@/app/lib/auth";
import bcrypt from "bcryptjs";

/* =========================
   CORS HELPER
========================= */
function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, PUT, PATCH, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  return response;
}

/* =========================
   OPTIONS (PRE-FLIGHT)
========================= */
export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 200 }));
}

/* =========================
   GET USER BY ID
========================= */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;

    const { data, error } = await backendSupabase
      .from("user_list")
      .select(
        `
        id,
        name,
        email,
        nim,
        program_studi,
        description,
        roles_id,
        roles_table (
          id_roles,
          name_roles,
          keterangan
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return withCors(
        NextResponse.json({ error: "User not found" }, { status: 404 }),
      );
    }

    return withCors(NextResponse.json({ user: data }));
  } catch (err: any) {
    console.error("GET user error:", err);
    return withCors(
      NextResponse.json(
        {
          error: err.message || "Internal server error",
          code: err.code || "INTERNAL_ERROR",
          timeStamp: new Date().toString(),
        },
        { status: err.status || 500 },
      ),
    );
  }
}

/* =========================
   PUT (FULL UPDATE)
========================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;

    const { name, email, nim, program_studi, description, roles_id, password } =
      await req.json();

    if (!name || !email || !nim || !program_studi || !roles_id) {
      return withCors(
        NextResponse.json(
          {
            error: "name, email, nim, program_studi, and roles_id are required",
          },
          { status: 400 },
        ),
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return withCors(
        NextResponse.json({ error: "Invalid email format" }, { status: 400 }),
      );
    }

    const { data: emailExists } = await backendSupabase
      .from("user_list")
      .select("id")
      .eq("email", email)
      .neq("id", id)
      .maybeSingle();

    if (emailExists) {
      return withCors(
        NextResponse.json({ error: "Email already exists" }, { status: 409 }),
      );
    }

    const { data: nimExists } = await backendSupabase
      .from("user_list")
      .select("id")
      .eq("nim", nim)
      .neq("id", id)
      .maybeSingle();

    if (nimExists) {
      return withCors(
        NextResponse.json({ error: "NIM already exists" }, { status: 409 }),
      );
    }

    const updateData: any = {
      name,
      email,
      nim,
      program_studi,
      roles_id,
      description: description ?? null,
      updated_at: new Date(),
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const { data, error } = await backendSupabase
      .from("user_list")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        id,
        name,
        email,
        nim,
        program_studi,
        description,
        roles_id,
        roles_table (
          id_roles,
          name_roles,
          keterangan
        )
      `,
      )
      .single();

    if (error) throw error;

    return withCors(
      NextResponse.json({
        message: "User updated successfully",
        user: data,
      }),
    );
  } catch (err: any) {
    console.error("PUT user error:", err);
    return withCors(
      NextResponse.json(
        {
          error: err.message || "Internal server error",
          code: err.code || "INTERNAL_ERROR",
          timeStamp: new Date().toString(),
        },
        { status: err.status || 500 },
      ),
    );
  }
}

/* =========================
   PATCH (PARTIAL UPDATE)
========================= */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;

    const { name, email, nim, program_studi, description, roles_id, password } =
      await req.json();

    const updateData: any = {};

    if (name) updateData.name = name;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return withCors(
          NextResponse.json({ error: "Invalid email format" }, { status: 400 }),
        );
      }

      const { data: emailExists } = await backendSupabase
        .from("user_list")
        .select("id")
        .eq("email", email)
        .neq("id", id)
        .maybeSingle();

      if (emailExists) {
        return withCors(
          NextResponse.json({ error: "Email already exists" }, { status: 409 }),
        );
      }

      updateData.email = email;
    }

    if (nim) {
      const { data: nimExists } = await backendSupabase
        .from("user_list")
        .select("id")
        .eq("nim", nim)
        .neq("id", id)
        .maybeSingle();

      if (nimExists) {
        return withCors(
          NextResponse.json({ error: "NIM already exists" }, { status: 409 }),
        );
      }

      updateData.nim = nim;
    }

    if (program_studi) updateData.program_studi = program_studi;
    if (roles_id) updateData.roles_id = roles_id;
    if (description !== undefined) updateData.description = description;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return withCors(
        NextResponse.json(
          { error: "At least one field to update is required" },
          { status: 400 },
        ),
      );
    }

    updateData.updated_at = new Date();

    const { data, error } = await backendSupabase
      .from("user_list")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        id,
        name,
        email,
        nim,
        program_studi,
        description,
        roles_id,
        roles_table (
          id_roles,
          name_roles,
          keterangan
        )
      `,
      )
      .single();

    if (error) throw error;

    return withCors(
      NextResponse.json({
        message: "User updated successfully",
        user: data,
      }),
    );
  } catch (err: any) {
    console.error("PATCH user error:", err);
    return withCors(
      NextResponse.json(
        {
          error: err.message || "Internal server error",
          code: err.code || "INTERNAL_ERROR",
          timeStamp: new Date().toString(),
        },
        { status: err.status || 500 },
      ),
    );
  }
}

/* =========================
   DELETE USER
========================= */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    verifyTokenFromRequest(req);
    const { id } = await context.params;

    const { error } = await backendSupabase
      .from("user_list")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return withCors(
      NextResponse.json({ message: "User deleted successfully" }),
    );
  } catch (err: any) {
    console.error("DELETE user error:", err);
    return withCors(
      NextResponse.json(
        {
          error: err.message || "Internal server error",
          code: err.code || "INTERNAL_ERROR",
          timeStamp: new Date().toString(),
        },
        { status: err.status || 500 },
      ),
    );
  }
}
