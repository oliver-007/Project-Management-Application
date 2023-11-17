const url = process.env.NEXT_PUBLIC_URL;

const getAllUsers = async () => {
  const res = await fetch(
    `${url}/api/users`,
    { method: "GET" }
    // { caches: "no-store" }
  );

  if (!res) throw new Error("failed to fetch data");
  return res.json();
};

export default getAllUsers;
