import User from "@/app/models/user.model";
import authOption from "@/lib/auth";
import connectDb from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await getServerSession(authOption);

    // ✅ FIXED CONDITION
    if (!session || !session.user?.email || !session.user?.id) {
      return NextResponse.json(
        { message: "user does not have session" },
        { status: 401 }
      );
    }

    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: `user get error ${error}` },
      { status: 500 }
    );
  }
}
