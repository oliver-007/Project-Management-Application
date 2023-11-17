import dbConnect from "@/libs/db";
import GoogleUser from "@/models/googleUser.schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, email, image } = await req.json();

  await dbConnect();
  await GoogleUser.create({ name, email, image });
  return NextResponse.json({ message: "User Register" }, { status: 201 });
}
