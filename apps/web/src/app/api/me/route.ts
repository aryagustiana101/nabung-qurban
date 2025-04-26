import { NextResponse } from "next/server";
import { auth } from "~/server/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", result: null },
      { status: 401 },
    );
  }

  return NextResponse.json(
    { success: true, message: null, result: session.user },
    { status: 200 },
  );
}
