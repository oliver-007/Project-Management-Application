import getAllNotes from "@/actions/getAllNotes";
import getAllUsers from "@/actions/getAllUsers";
// import { Suspense, useEffect, useState } from "react";

export default async function Home() {
  // const [allUsers] = await Promise.all([getAllUsers()]);

  // console.log("all user & all notes", allUsers);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className=" rounded-md p-5 text-3xl font-bold text-center bg-gray-400 text-black ">
        <h1> For Details Please Login </h1>
      </div>
    </main>
  );
}
