import dbConnect from "@/libs/db";
import Invitation from "@/models/invitation.Schema";
import Team from "@/models/team.Schema";
import User from "@/models/user.Schema";
import { NextResponse } from "next/server";

dbConnect();

// **************** invitation sent
export async function POST(request) {
  try {
    const { senderId, receiverId, teamId } = await request.json();

    // console.log("raw receiver ====", receiverId);
    // console.log("raw sender ====", senderId);
    // console.log("raw team id ====", teamId);

    const validSender = await User.findById(senderId)
      .select("-password")
      .lean()
      .exec();
    // console.log("valid sernder----", validSender);

    const validTeam = await Team.findById(teamId).lean().exec();
    // console.log("valid team---", validTeam);

    const validReceiver = await User.findById(receiverId)
      .select("-password")
      .lean()
      .exec();
    // console.log("valid receivers ----", validReceiver);

    if (validReceiver && validSender && validTeam) {
      const existingInvitation = await Invitation.findOne({
        senderId: validSender._id,
        receiverId: validReceiver._id,
        teamId: validTeam._id,
      });
      // console.log("existing invitation -----", existingInvitation);

      if (!existingInvitation) {
        const createInvitation = await Invitation.create({
          senderId: validSender._id,
          teamId: validTeam._id,
          receiverId: validReceiver._id,
        });

        // console.log("create invitation ---", createInvitation);
        return NextResponse.json(
          {
            message: `Invitation sent to " ${validReceiver?.name} " Successful`,
          },
          { status: 201 }
        );
      } else {
        const invitStatus = await existingInvitation?.invitationStatus;
        // console.log("invitation status ---- ", invitStatus);

        if (invitStatus === "Pending") {
          return NextResponse.json(
            { message: "Invitation already sent" },
            { status: 400 }
          );
        }
        if (invitStatus === "Accepted") {
          return NextResponse.json(
            { message: "User already in Team" },
            { status: 409 }
          );
        }

        // ****************** IMPORNENT **********************
        // this DECLINED condition doesn't belong to here, Receiver will Decline invitation request and then this condition will run from other component, but not from here. I'm just storing it here for future use.
        // if (invitStatus === "Declined") {
        //   // at first deleting old invitation
        //   await Invitation.findByIdAndDelete(existingInvitation._id);

        //   //  then creating new invitation again for old receiver
        //   const createInvitation = await Invitation.create({
        //     sender: validSender._id,
        //     teamId: validTeam._id,
        //     receiver: validReceiver._id,
        //   });
        //   console.log(
        //     "new invitation creating for sending invitation to old receiver again ----",
        //     createInvitation
        //   );
        //   return NextResponse.json(
        //     { message: "Invitation sent Again " },
        //     { status: 201 }
        //   );
        // }
      }
    } else {
      return NextResponse.json(
        { message: " Sender || Receiver || Team Validation Error" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("error---", error);
    return NextResponse.json(
      { message: "Failed to send inviation" },
      { status: 500 },
      error
    );
  }
}
