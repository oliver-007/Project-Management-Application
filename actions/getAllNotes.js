const url = process.env.NEXT_PUBLIC_URL;

const getAllNotes = async () => {
  try {
    const res = await fetch(
      `${url}/api/notes`,
      { method: "GET" }
      //   { caches: "no-store" }
    );

    if (!res) throw new Error("failed to fetch notes");
    return res.json();
  } catch (error) {
    console.log("get notes error---", error);
  }
};

export default getAllNotes;
