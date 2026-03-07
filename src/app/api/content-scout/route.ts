import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, telegram, references, reelsIdeas, moodboardUrl } = body;

    // Validate required fields
    if (!name?.trim() || !telegram?.trim()) {
      return NextResponse.json(
        { error: "Имя и Telegram обязательны" },
        { status: 400 }
      );
    }

    if (!Array.isArray(references) || references.length !== 5) {
      return NextResponse.json(
        { error: "Нужно ровно 5 референсов" },
        { status: 400 }
      );
    }

    for (const ref of references) {
      if (!ref.url?.trim() || !ref.explanation?.trim()) {
        return NextResponse.json(
          { error: "Каждый референс должен содержать ссылку и объяснение" },
          { status: 400 }
        );
      }
    }

    if (!Array.isArray(reelsIdeas) || reelsIdeas.length !== 3) {
      return NextResponse.json(
        { error: "Нужно ровно 3 идеи рилсов" },
        { status: 400 }
      );
    }

    for (const idea of reelsIdeas) {
      if (
        !idea.hook?.trim() ||
        !idea.scenario?.trim() ||
        !idea.visual?.trim() ||
        !idea.cta?.trim()
      ) {
        return NextResponse.json(
          {
            error:
              "Каждая идея рилса должна содержать хук, сценарий, визуал и CTA",
          },
          { status: 400 }
        );
      }
    }

    if (!moodboardUrl?.trim()) {
      return NextResponse.json(
        { error: "Ссылка на мудборд обязательна" },
        { status: 400 }
      );
    }

    const submission = await prisma.contentScoutSubmission.create({
      data: {
        name: name.trim(),
        telegram: telegram.trim(),
        references,
        reelsIdeas,
        moodboardUrl: moodboardUrl.trim(),
      },
    });

    return NextResponse.json({ id: submission.id }, { status: 201 });
  } catch (err) {
    console.error("Content scout submission error:", err);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const submissions = await prisma.contentScoutSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (err) {
    console.error("Content scout list error:", err);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

// DELETE /api/content-scout — bulk delete submissions
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { ids } = body as { ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids required" }, { status: 400 });
    }

    const deleted = await prisma.contentScoutSubmission.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({ deleted: deleted.count });
  } catch (err) {
    console.error("Content scout bulk delete error:", err);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
