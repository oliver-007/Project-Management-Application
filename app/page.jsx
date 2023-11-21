import getAllNotes from "@/actions/getAllNotes";
import getAllUsers from "@/actions/getAllUsers";
// import { Suspense, useEffect, useState } from "react";

export default async function Home() {
  // const [allUsers] = await Promise.all([getAllUsers()]);

  // console.log("all user & all notes", allUsers);

  return (
    <main className="grid grid-cols-1 place-items-center h-[1000px] items-center justify-between ">
      <div className=" rounded-md p-5 text-3xl font-bold text-center border bg-lime-300 border-sky-400 text-sky-500 ">
        <h1> For Details Please Login </h1>
      </div>
    </main>
  );
}
