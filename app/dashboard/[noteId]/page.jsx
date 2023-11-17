"use client";

import getAllTeams from "@/actions/getAllTeams";
import getSingleNote from "@/actions/getSingleNote";
import { useTeam } from "@/app/context/TeamContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineEdit, AiTwotoneDelete } from "react-icons/ai";
import { TiArrowBack } from "react-icons/ti";

const singleNote = () => {
  const [noteData, setNoteData] = useState({});
  console.log("note data ---- ", noteData);
  const [loading, setLoading] = useState(true);
  const { allTeams, setAllTeams } = useTeam();

  const { data: session, status: session_status } = useSession();

  console.log("session_status---", session_status);
  console.log("session----", session);

  const router = useRouter();
  const params = useParams();
  const { noteId } = params;
  console.log("params ----", noteId);

  // *** fetching single note
  useEffect(() => {
    const fetchedSingleNote = async () => {
      try {
        const note = await getSingleNote(noteId);
        console.log("single note dashboar dynamic page ----", note);
        setNoteData(note);
        setLoading(false);
      } catch (error) {
        console.log("error---", error);
      }
    };

    fetchedSingleNote();
  }, []);

  // *** fetching teams
  useEffect(() => {
    const fetchedTeams = async () => {
      const teams = await getAllTeams(session?.user?.id);
      console.log("all teams from dynamic note page", teams);
      setAllTeams(teams);
    };

    fetchedTeams();
  }, []);

  // handle delete function
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errMsg = await res.json();
        console.log("Delete note FAILED", errMsg);
      } else {
        const errMsg = await res.json();
        console.log("Delete Note SUCCESS", errMsg);
      }
      router.push("/dashboard");
    } catch (error) {
      console.log("error----", error);
    }
  };

  const {
    creator_name,
    assignedToTeamName,
    date,
    priority,
    status,
    text,
    title,
    _id,
  } = noteData;
  return (
    <>
      {loading ? (
        <p className="  grid justify-center items-center h-screen text-2xl font-bold text-slate-500 ">
          {" "}
          Loading....{" "}
        </p>
      ) : (
        <div className="grid  justify-center items-center h-screen  ">
          <div className="  grid gap-5 p-5 max-w-2xl bg-gray-300/25  rounded-md text-2xl ">
            <div className=" max-w-xs ">
              <h1> Task Creator : {creator_name} </h1>
              <h1> Task title: {title} </h1>
              <h1>
                {" "}
                Task Priority :{" "}
                <span
                  className={
                    (`${priority}` === "low"
                      ? "bg-lime-300 px-1 capitalize rounded-sm "
                      : undefined) ||
                    (`${priority}` === "medium"
                      ? "bg-orange-300 px-1 capitalize rounded-sm "
                      : undefined) ||
                    (`${priority}` === "high"
                      ? "bg-rose-400 px-1 text-white capitalize rounded-sm "
                      : undefined)
                  }
                >
                  {priority}
                </span>{" "}
              </h1>
              <p className="">Description : {text}</p>
            </div>
            <div>Due date : {date} </div>
            <div>
              <h2>assigned to : {assignedToTeamName} </h2>
            </div>
            <div className="grid gap-6">
              <h4>Status : {status} </h4>

              {/* buttons  */}
              <div className="flex items-center justify-between ">
                {/* back button */}
                <div className="bg-slate-500 rounded-md hover:ring-1 hover:ring-offset-2 hover:ring-zinc-500 hover:shadow-lg hover:shadow-zinc-400 hover:transition-all duration-200  ">
                  <Link href={"/dashboard"}>
                    <div>
                      <span className="flex items-center justify-center px-2 py-1 gap-2 ">
                        <TiArrowBack className="text-white" size={20} />
                        <p className="text-base text-white ">Back</p>
                      </span>
                    </div>
                  </Link>
                </div>

                {/* edit + delete button */}
                {noteData.creator_id === session?.user?.id &&
                  session_status === "authenticated" && (
                    <div className="flex gap-x-4 justify-center items-center">
                      {/* edit button */}
                      <Link href={`/update-note/${_id}`}>
                        <div className=" hover:shadow-lg hover:shadow-lime-300 hover:ring-1 ring-offset-2 ring-lime-300 rounded-md hover:transition-all duration-200 bg-lime-300 text-slate-600 px-2 py-1 text-base ">
                          <span className="flex justify-center items-center gap-x-1 ">
                            <AiOutlineEdit size={20} />
                            Edit
                          </span>
                        </div>
                      </Link>

                      {/* delete button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(_id)}
                        className=" hover:shadow-lg hover:shadow-rose-300 hover:ring-1 ring-offset-2 ring-rose-300 rounded-md hover:transition-all duration-200  bg-rose-500  text-white px-2 py-1 text-base "
                      >
                        <span className="flex justify-center items-center gap-x-1 ">
                          <AiTwotoneDelete size={20} />
                          Delete
                        </span>
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default singleNote;
