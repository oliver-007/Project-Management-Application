const url = process.env.NEXT_PUBLIC_URL;

const getAllInvitations = async (receiver_Id) => {
  // console.log("receiver id ---", receiver_Id);

  try {
    const res = await fetch(
      `${url}/api/invitations/${receiver_Id}`,
      { method: "GET" }
      //   { caches: "no-store" }
    );

    if (!res) throw new Error("failed to fetch invitations");

    return res.json();
  } catch (error) {
    console.log("err msg=-", error);
  }
};

export default getAllInvitations;
