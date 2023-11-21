const url = process.env.NEXT_PUBLIC_URL;

const getAllTeams = async (creatorId) => {
  // console.log("creator id ----", creatorId);
  try {
    const res = await fetch(`${url}/api/teams/${creatorId}`, { method: "GET" });

    if (!res) throw new Error("failed to fetch data");
    return res.json();
  } catch (error) {
    console.log("get teams err---", error);
  }
};
export default getAllTeams;
