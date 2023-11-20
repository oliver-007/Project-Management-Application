import dbConnect from "@/libs/db";
import Note from "@/models/note.Schema";
import Team from "@/models/team.Schema";
import User from "@/models/user.Schema";
import { NextResponse } from "next/server";

dbConnect();

// ****************  !!!!!!  IMPORTANT  !!!!!!!  *****************
// " {params} " must always be 2nd argument, may be "request" argument is not always be necessary but to place " {params} " argument on 2nd position, u must use "request" as 1st argument.

// ***********  get single note  *************
export async function GET(request, { params }) {
  console.log("params from api dynamic route ---", params);
  try {
    if (!params.noteId) {
      return new NextResponse(
        { message: "Note ID is required" },
        { status: 400 }
      );
    }

    //************** !!!!  IMPORTANT  !!!!  ***************
    // if lean() is necessary then it must be used before using exec()
    const note = await Note.findById(params.noteId).lean().exec();
    // console.log("single note getting by Id---", note);

    // note with assignedToUserName
    const assignedTo = await note.assigned_to;
    const teamAssigned = await Team.findById(assignedTo).exec();
    const assignedToTeamName = await teamAssigned.name;
    const notesWithAssignedTeam = { ...note, assignedToTeamName };

    // console.log(
    //   " dynamic api route note with assigned user name === ",
    //   notesWithAssignedUser
    // );

    return NextResponse.json(notesWithAssignedTeam);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "internal server error", error },
      { status: 500 }
    );
  }
}

// **********  update note ***********
export async function PATCH(request, { params }) {
  // console.log(" update note params from API dynamic route ---", params);
  try {
    const note = await Note.findById(params.noteId);
    // console.log("update NOTE find from database api dynamic route=== ", note);
    if (!note) {
      return new NextResponse.json(
        { message: "Note not Found" },
        { status: 400 }
      );
    }

    const { title, text, priority, status, date, assigned_to } =
      await request.json();

    // console.log(
    //   "updated form data coming from frontend api dynamic route",
    //   updatedData
    // );

    const updatedResult = await Note.findByIdAndUpdate(
      params.noteId,
      {
        title,
        text,
        priority,
        status,
        date,
        assigned_to,
      },
      { new: true }
    );

    // console.log("updated result  api dynamic route ----", updatedResult);

    if (!updatedResult) {
      return new NextResponse.json({ message: "Update Failed !" });
    } else {
      return NextResponse.json(
        { message: `" ${updatedResult.title} " update SUCCESS` },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("error from api route---", error);
    return NextResponse.json(
      { message: "internal server error", error },
      { status: 500 }
    );
  }
}

// ************ delete note ************
export async function DELETE(request, { params }) {
  // console.log(" delete params api dynamic note route---", params);

  try {
    const task = await Note.findById(params.noteId).exec();
    if (!task) {
      return NextResponse.json({ message: "Note not found" }, { status: 400 });
    }

    const result = await Note.findByIdAndDelete(params.noteId).exec();

    // console.log("delete note api dynaic route----", result);

    return NextResponse.json(
      { message: ` " ${result.title} " deleted success` },
      { status: 200 }
    );
  } catch (error) {
    console.log("error---", error);
    return NextResponse.json(
      { message: "internal server error", error },
      { status: 500 }
    );
  }
}
