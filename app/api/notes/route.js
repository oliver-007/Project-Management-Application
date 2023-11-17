import dbConnect from "@/libs/db";
import Note from "@/models/note.Schema";
import Team from "@/models/team.Schema";
import User from "@/models/user.Schema";
import { NextResponse } from "next/server";

dbConnect();

// ************* // Get all notes
export async function GET() {
  try {
    const notes = await Note.find().lean().exec();
    if (!notes?.length) {
      return NextResponse.json({ message: "No Notes found" }, { status: 400 });
    }
    // console.log("notes api route page---", notes);

    // Notes with username
    const notesWithUser = await Promise.all(
      //  Important to keep in mind:  Promise.all()
      notes.map(async (note) => {
        // console.log("note api route ----", note);
        const creatorId = await note.creator_id;
        const user = await User.findById(creatorId).exec();
        const creator_name = user?.name;
        // console.log("user name -----", creator_name);
        const assignedTo = await note.assigned_to;
        const teamAssigned = await Team.findById(assignedTo).exec();
        const assignedToTeamName = await teamAssigned?.name;
        // console.log("user Assigned to ---", assignedToUserName);
        return { ...note, creator_name, assignedToTeamName };
      })
    );

    // console.log("note with user name & assigned to name ----", notesWithUser);
    return NextResponse.json(notesWithUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server error", error },
      { status: 500 }
    );
  }
}

// *********** // Create Note
export async function POST(reqest) {
  try {
    const {
      creator_id,
      creator_name,
      title,
      text,
      status,
      priority,
      date,
      assigned_to,
    } = await reqest.json();

    // confirm data
    if (
      !creator_id ||
      !title ||
      !text ||
      !creator_name ||
      !status ||
      !priority ||
      !date ||
      !assigned_to
    ) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    // Check Duplicate
    const duplicateNote = await Note.findOne({ title }).lean().exec();
    if (duplicateNote) {
      return NextResponse.json(
        { message: "Note name already Exist" },
        { status: 409 }
      );
    }

    // Creat & store new note
    const note = await Note.create({
      creator_id,
      creator_name,
      title,
      text,
      status,
      priority,
      date,
      assigned_to,
    });

    if (!note) {
      return new NextResponse.json(
        { message: "Invalid note data received" },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: `New note : '${note.title}' created` },
        { status: 201 },
        note
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
      error
    );
  }
}
