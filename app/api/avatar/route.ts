import { del, get, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function hasValidSignature(bytes: Uint8Array, contentType: string) {
  if (contentType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (contentType === "image/png") {
    return bytes.slice(0, 8).join(",") === "137,80,78,71,13,10,26,10";
  }
  if (contentType === "image/webp") {
    return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
      && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}

export async function GET() {
  const { data: session } = await getAuth().getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Autentifikatsiya talab qilinadi." }, { status: 401 });
  }

  const pathname = session.user.image;
  if (!pathname || !pathname.startsWith(`avatars/${session.user.id}/`)) {
    return NextResponse.json({ error: "Profil rasmi topilmadi." }, { status: 404 });
  }

  const blob = await get(pathname, { access: "private" });
  if (!blob) return NextResponse.json({ error: "Profil rasmi topilmadi." }, { status: 404 });

  return new Response(blob.stream, {
    headers: {
      "Content-Type": blob.blob.contentType,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function POST(request: Request) {
  const requestOrigin = new URL(request.url).origin;
  if (request.headers.get("origin") !== requestOrigin) {
    return NextResponse.json({ error: "So'rov manbasi tasdiqlanmadi." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_FILE_SIZE + 64 * 1024) {
    return NextResponse.json({ error: "Rasm hajmi 5 MB dan oshmasligi kerak." }, { status: 413 });
  }

  const { data: session } = await getAuth().getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Autentifikatsiya talab qilinadi." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Rasm faylini tanlang." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Rasm hajmi 5 MB dan oshmasligi kerak." }, { status: 413 });
  }

  const extension = MIME_EXTENSIONS[file.type];
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!extension || !hasValidSignature(bytes, file.type)) {
    return NextResponse.json({ error: "Faqat JPEG, PNG yoki WebP rasmlar qabul qilinadi." }, { status: 415 });
  }

  const previousPath = session.user.image;
  const blob = await put(`avatars/${session.user.id}/profile.${extension}`, new Blob([bytes], { type: file.type }), {
    access: "private",
    addRandomSuffix: true,
    contentType: file.type,
  });

  const { error } = await getAuth().updateUser({ image: blob.pathname });
  if (error) {
    await del(blob.pathname);
    console.error("[avatar] Failed to persist avatar metadata", error);
    return NextResponse.json({ error: "Profil rasmini saqlab bo'lmadi. Qayta urinib ko'ring." }, { status: 500 });
  }

  if (previousPath?.startsWith(`avatars/${session.user.id}/`) && previousPath !== blob.pathname) {
    await del(previousPath).catch((error: unknown) => {
      console.error("[avatar] Failed to remove replaced avatar", error);
    });
  }

  return NextResponse.json({ image: "/api/avatar" }, { status: 201 });
}
