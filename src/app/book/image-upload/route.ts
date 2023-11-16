import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);

  const filename = searchParams.get("filename");

  if (!filename || request.body === null) {
    return NextResponse.json({ error: "Invalid file name or file content" }, { status: 400 });
  }

  const blobPath = `booking/images/${uuidv4()}-${filename}`;
  const blob = await put(blobPath, request.body, {
    access: "public",
  });

  return NextResponse.json(blob);
}
