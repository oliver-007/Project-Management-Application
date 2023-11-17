import Team from "@/models/team.Schema";
import User from "@/models/user.Schema";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Note from "@/models/note.Schema";
const { ObjectId } = mongoose.Types;
// ******************** Get all Teams  *********************
export async function GET(request, { params }) {
  // console.log("params api route team---", params.creatorId);
  try {
    const teams = await Team.find({ creator_id: params.Id }).lean().exec();
    // console.log("teams api route page GET---", teams);

    if (!teams?.length) {
      return NextResponse.json({ message: "No Team Found" }, { status: 200 });
    }

    // teams with members name & image
    const teamWithMemberName = await Promise.all(
      teams.map(async (team) => {
        const membersInfo = await Promise.all(
          team.members?.map(async (mem) => {
            // console.log("mem---", mem);
            const memberAssigned = await User.findById(mem)
              .select("-password")
              .lean()
              .exec();
            // console.log("find by id member ----", memberAssigned);

            // const memberName = await memberAssigned?.name;

            // const memberImage = await memberAssigned?.image;

            // console.log("member name ---", memberName);
            // console.log("member image ---", memberImage);

            // return { memberImage, memberName };
            return memberAssigned;
          })
        );
        return { ...team, membersInfo };
      })
    );

    return NextResponse.json(teamWithMemberName);
  } catch (error) {
    console.log("err--", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ***************** UPDATE team members *****************
export async function PATCH(request, { params }) {
  try {
    const team_id = await params.Id;
    // console.log(" team_id api team route==", team_id);

    const { member_id } = await request.json();
    // console.log("member_id api team route===", member_id);

    // ********** IMPORTANT  **********
    // member_id is String type, so it has to be converted to an actual ObjectId instance before performing the comparison. so, use the ObjectId constructor from the mongoose package to create ObjectId instances.
    const mem_id = new ObjectId(member_id);
    // console.log("mem_id api team route===", mem_id);
    // console.log("type of mem id", typeof mem_id);

    if (!team_id) {
      return new NextResponse.json(
        { message: "Team not found" },
        { status: 400 }
      );
    }

    if (!member_id) {
      return new NextResponse.json(
        { message: "Member not found" },
        { status: 400 }
      );
    }

    const currentTeam = await Team.findById(team_id).lean().exec();
    // console.log("current team api team route----", currentTeam);

    // *********** IMPORTANT ***********
    // special filter method to filter out ObjectId ----  MongoDB's ObjectId instances have a custom " .equals() " method for comparison.
    const remainingMembers = await currentTeam?.members?.filter(
      (memId) => !memId.equals(mem_id)
    );

    // console.log("remaining_members api team route---", remainingMembers);

    const result = await Team.findByIdAndUpdate(
      team_id,
      { members: remainingMembers },
      { new: true }
    );

    // console.log("updated team member api team route----", result);

    if (!result) {
      return new NextResponse.json(
        { message: "Team Member Remove Failed !" },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: ` Member removed from " ${result?.name} " team SUCCESS` },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("error from api team route---", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ************* DELETE team  ***************
export async function DELETE(request, { params }) {
  try {
    const team_id = params.Id;
    console.log("team id api team route dynamic---", team_id);

    const validTeam = await Team.findById(team_id).lean().exec();
    // console.log("valid team api team route dynamic ---", validTeam);

    if (!validTeam) {
      return NextResponse.json({ message: "Team not found!" }, { status: 400 });
    }

    // note assigned validation ***  make sure that no note is assigned to this team_id
    const noteAssigned = await Note.find({ assigned_to: team_id });

    // console.log("noteAssigned from api dynamic team route----", noteAssigned);

    if (noteAssigned?.length > 0) {
      return NextResponse.json(
        {
          message:
            "This team is working on a project. To extinct this team, plz transfer / delete assigned project first.",
        },
        { status: 400 }
      );
    }

    // team member removal validation ***  make sure that no user is assigned to this team as team member.
    const existingMember = await validTeam?.members;
    // console.log("team members api team route dynamic---", existingMember);

    if (existingMember?.length > 0) {
      return NextResponse.json(
        { message: "Need to remove all members first" },
        { status: 400 }
      );
    }

    const result = await Team.findByIdAndDelete(validTeam?._id).exec();

    if (!result) {
      return NextResponse.json(
        { message: "Delete Team Failed !" },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: "Delete Team Success" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("err msg----", error);
    return NextResponse.json(
      { message: "Internal Server Error!" },
      { status: 500 }
    );
  }
}
