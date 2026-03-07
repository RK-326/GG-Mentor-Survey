import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/admin/surveys/[id]/responses — bulk update status
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json();
  const { ids, status, adminNotes } = body as {
    ids: string[];
    status?: string;
    adminNotes?: string;
  };

  if (!ids?.length) {
    return NextResponse.json({ error: "No ids provided" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (status) data.status = status;
  if (adminNotes !== undefined) data.adminNotes = adminNotes;

  const result = await prisma.response.updateMany({
    where: { id: { in: ids }, surveyId: id },
    data,
  });

  return NextResponse.json({ updated: result.count });
}

// GET /api/admin/surveys/[id]/responses — paginated responses list
export async function GET(req: NextRequest, ctx: Ctx) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search");
  const sort = url.searchParams.get("sort") || "date_desc";

  // Build where
  const where: Record<string, unknown> = { surveyId: id };
  if (status) where.status = status;
  if (search) {
    where.answers = {
      some: {
        textValue: { contains: search, mode: "insensitive" },
      },
    };
  }

  // Sort
  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "score_desc") orderBy = { totalScore: "desc" };
  else if (sort === "score_asc") orderBy = { totalScore: "asc" };
  else if (sort === "date_asc") orderBy = { createdAt: "asc" };

  const [responses, total] = await Promise.all([
    prisma.response.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        answers: {
          include: {
            question: { select: { fieldKey: true, label: true, type: true } },
            selectedOption: { select: { label: true } },
          },
        },
      },
    }),
    prisma.response.count({ where }),
  ]);

  return NextResponse.json({ responses, total, page, limit });
}
