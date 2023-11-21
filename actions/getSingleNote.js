const url = process.env.NEXT_PUBLIC_URL;

const getSingleNote = async (noteId) => {
  // console.log("note id from get single note-----", noteId);
  try {
    const res = await fetch(
      `${url}/api/notes/${noteId}`,
      { method: "GET" }
      //   { caches: "no-store" }
    );

    if (!res) throw new Error("failed to fetch single note");
    return res.json();
  } catch (error) {
    console.log("error---", error);
  }
};

export default getSingleNote;
