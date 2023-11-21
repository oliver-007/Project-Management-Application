import dbConnect from "../../../libs/db";
import User from "../../../models/user.Schema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import Note from "@/models/note.Schema";

// database connection
dbConnect();

// GET all users
export async function GET(request) {
  try {
    const users = await User.find().select("-password").lean();
    if (!users?.length) {
      return NextResponse.json({ message: "User not found" }, { status: 200 });
    }
    return NextResponse.json(users);
  } catch (err) {
    console.log("err message : ", err.message);
    return NextResponse.json(
      { message: "Failed to fetch data !", err },
      { status: 500 }
    );
  }
}

// Create User
export async function POST(request) {
  try {
    const { name, email, image, password } = await request.json();

    // confirm data
    if (!name || !email || !password || !image) {
      return NextResponse.json(
        { message: "All fields required !" },
        { status: 400 }
      );
    }

    // Check Duplicate user
    const userExist = await User.findOne({ email }).lean().exec();
    if (userExist) {
      return NextResponse.json(
        { message: "User Already Exist !" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create and store now user
    const user = await User.create({
      name,
      image,
      email,

      password: hashedPass,
    });

    if (user) {
      return NextResponse.json(
        { message: `New user " ${user.name} " created ` },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid user data received" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 400 },
      error
    );
  }
}
