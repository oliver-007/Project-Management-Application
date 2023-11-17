import Team from "@/models/team.Schema";
import User from "@/models/user.Schema";
import { NextResponse } from "next/server";

// // ******************** Get all Teams  *********************
// export async function GET() {
//   try {
//     const teams = await Team.find().lean().exec();
//     // console.log("teams api route page GET---", teams);

//     if (!teams?.length) {
//       return NextResponse.json({ message: "No Team Found" }, { status: 200 });
//     }

//     // teams with members name & image
//     const teamWithMemberName = await Promise.all(
//       teams.map(async (team) => {
//         const membersInfo = await Promise.all(
//           team.members?.map(async (mem) => {
//             // console.log("mem---", mem);
//             const memberAssigned = await User.findById(mem)
//               .select("-password")
//               .lean()
//               .exec();
//             // console.log("find by id member ----", memberAssigned);
//             const memberName = await memberAssigned?.name;
//             const memberImage = await memberAssigned?.image;

//             // console.log("member name ---", memberName);
//             // console.log("member image ---", memberImage);
//             return { memberImage, memberName };
//           })
//         );
//         return { ...team, membersInfo };
//       })
//     );

//     return NextResponse.json(teamWithMemberName);
//   } catch (error) {
//     console.log("err--", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// **************** Create Team ****************
export async function POST(reqest) {
  try {
    const { creator_id, creator_name, name } = await reqest.json();
    // console.log("team api route requested data to POST", members);

    if (!name) {
      return NextResponse.json({ message: "Name Required" }, { status: 400 });
    }

    const duplicateTeamName = await Team.findOne({ name }).lean().exec();
    if (duplicateTeamName) {
      return NextResponse.json(
        { message: "Team name already exist" },
        { status: 409 }
      );
    }

    // create & store new team
    const team = await Team.create({
      name,
      // members,
      creator_id,
      creator_name,
    });

    if (!team) {
      return new NextResponse.json(
        { message: "Invalid team data received" },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: `New team : '${team.name}' created` },
        { status: 201 },
        team
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
