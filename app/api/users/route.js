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

// ************** // Update user
// export async function PATCH(reqest) {
//   const { id, name, email, roles, active } = await reqest.json();

//   if (!id || !email || !name) {
//     return NextResponse.json(
//       { message: "All fields required" },
//       { status: 400 }
//     );
//   }

//   // Check user's existance
//   const user = await User.findById(id).exec();

//   if (!user) {
//     return NextResponse.json({ message: "User not found" }, { status: 400 });
//   }

//   // Check for Duplicat user
//   const duplicate = await User.findOne({ email }).lean().exec();

//   // Check for duplicate
//   if (duplicate && duplicate?._id !== id) {
//     return NextResponse.json(
//       { message: "mail id already used" },
//       { status: 409 }
//     );
//   }

//   await (user.name = name),
//     await (user.email = email),
//     await (user.roles = roles),
//     await (user.active = active);

//   const updatedUser = await user.save();

//   return NextResponse.json(
//     { message: `'${updatedUser.name}' Updated` },
//     { status: 200 }
//   );
// }

//************* // Delete user
// export async function DELETE(reqest) {
//   try {
//     const { id } = await reqest.json();

//     // check id
//     if (!id) {
//       return NextResponse.json(
//         { message: "user ID required " },
//         { status: 400 }
//       );
//     }

//     // assigned note check
//     const assignedNote = await Note.findOne({ user: id }).lean().exec();

//     if (assignedNote) {
//       return NextResponse.json(
//         { message: "Note assigned to this User" },
//         { status: 400 }
//       );
//     }

//     // confirm user
//     const user = await User.findById(id).exec();

//     if (!user) {
//       return NextResponse.json(
//         { message: " user not found " },
//         { status: 400 }
//       );
//     }
//     const result = await User.findByIdAndDelete(user.id);

//     return NextResponse.json(
//       { message: `'${result.name}' deleted ` },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { message: "Failed to delete user " },
//       { status: 400 },
//       error
//     );
//   }
// }
