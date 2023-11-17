import dbConnect from "@/libs/db";
import Invitation from "@/models/invitation.Schema";
import Team from "@/models/team.Schema";
import User from "@/models/user.Schema";
import { NextResponse } from "next/server";

dbConnect();

// ****************  !!!!!!  IMPORTANT  !!!!!!!  *****************
// " {params} " must always be 2nd argument, may be "request" argument is not always be necessary but to place " {params} " argument on 2nd position, u must use "request" as 1st argument.

// ************* Get all invitations
export async function GET(request, { params }) {
  const receiverId = params.Id;
  // console.log("params api route invitation---", receiverId);
  try {
    if (!receiverId) {
      return new NextResponse.json(
        { message: "receiver id required " },
        { status: 400 }
      );
    }
    //************** !!!!  IMPORTANT  !!!!  ***************
    // if lean() is necessary then it must be used before using exec()
    const invitations = await Invitation.find({ receiverId }).lean().exec();

    // console.log("all invitation related with receiver ----", invitations);

    if (!invitations?.length) {
      return NextResponse.json(
        { message: "No Invitation Found" },
        { status: 400 }
      );
    }

    const invitationWithInfo = await Promise.all(
      invitations.map(async (inv) => {
        const sender_Id = await inv.senderId;
        // console.log("sender_ID", sender_Id);

        const team_id = await inv.teamId;
        // console.log("team_id", team_id);

        // ***** sender info
        const senderInfo = await User.findById(sender_Id)
          .select("-password")
          .exec();
        const senderName = await senderInfo?.name;
        const senderImg = await senderInfo?.image;

        // ****** team info
        const teamInfo = await Team.findById(team_id).exec();
        const teamName = await teamInfo?.name;

        return { ...inv, senderName, senderImg, teamName };
      })
    );

    // console.log("invitation with info===== >", invitationWithInfo);

    // sort all data according to its created date. so that new data come first.
    invitationWithInfo.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    return NextResponse.json(invitationWithInfo);
  } catch (error) {
    console.log("error ---", error);
    return NextResponse.json(
      { message: "Internal Server Error! " },
      { status: 500 },
      error
    );
  }
}

// ************** Delete Invitation *********
export async function DELETE(request, { params }) {
  try {
    const invitation_id = params.Id;
    // console.log("api route invitation id ----", invitation_id);

    const invitation = await Invitation.findById(invitation_id).lean().exec();
    // console.log("find out invitation ===", invitation);

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation not Found" },
        { status: 400 }
      );
    }

    const result = await Invitation.findByIdAndDelete(invitation_id).exec();

    return NextResponse.json(
      { message: ` Invitation Delete Success ` },
      { status: 200 }
    );
  } catch (error) {
    console.log("err msg--", error);
    return NextResponse.json(
      { message: "Internal Server Error !" },
      { status: 500 },
      error
    );
  }
}

// **************** Patch Invitation *********
export async function PATCH(request, { params }) {
  try {
    const invitation_id = params.Id;
    console.log("invitation id from api route PATCH----", invitation_id);

    const invitation = await Invitation.findById(invitation_id).exec();
    console.log("invitation form api route inivtation===", invitation);

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation not Found !" },
        { status: 400 }
      );
    }

    const updatedInvitationStatus = await Invitation.findByIdAndUpdate(
      invitation?._id,
      { invitationStatus: "Accepted" },
      { new: true }
    );

    if (!updatedInvitationStatus) {
      return new NextResponse.json(
        { message: "inivtation status update Failed" },
        { status: 400 }
      );
    } else {
      const team_id = invitation?.teamId;
      console.log("team id api invitation dynamic route ---", team_id);

      const selectedTeam = await Team.findById(team_id).exec();
      console.log("seelcted team----", selectedTeam);

      const receiver_id = await invitation?.receiverId;

      await selectedTeam?.members.push(receiver_id);

      await selectedTeam.save();

      await Invitation.findByIdAndDelete(invitation?._id).exec();

      return NextResponse.json(
        {
          message: `Invitation ACCEPTED Success & joined to " ${selectedTeam?.name} " team `,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("err from api route---", error);
    return NextResponse.json(
      { message: "internal server error", error },
      { status: 500 }
    );
  }
}
