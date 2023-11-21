"use client";

import getAllTeams from "@/actions/getAllTeams";
import getSingleNote from "@/actions/getSingleNote";
import { useTeam } from "@/app/context/TeamContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineEdit, AiTwotoneDelete } from "react-icons/ai";
import { GiProgression } from "react-icons/gi";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdPendingActions } from "react-icons/md";
import { TiArrowBack } from "react-icons/ti";

const SingleNote = () => {
  const [noteData, setNoteData] = useState({});
  console.log("note data ---- ", noteData);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
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
  }, [session?.user?.id, setAllTeams]);

  // ****** handle show alert
  const handleAlert = (id, title) => {
    setProjectName(title);
    setProjectId(id);
    setShowAlert(true);
  };

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
        <div className="px-10  ">
          {/* show alert box */}
          {showAlert ? (
            <div className="flex items-center justify-center  ">
              <div className="bg-cyan-100 flex justify-around items-center py-2 px-4 w-full ">
                <p className="text-lg text-slate-700">
                  You really want to
                  <span className="font-bold ">
                    {" "}
                    Delete &quot; {projectName} &quot;{" "}
                  </span>
                  ?
                </p>
                <div className="flex items-center  justify-around w-64">
                  <button
                    onClick={() => setShowAlert(false)}
                    className="bg-lime-400 px-3 py-1 rounded-lg text-slate-700 hover:ring-1 hover:ring-offset-2 hover:ring-blue-400 hover:bg-slate-100 hover:text-slate-700 hover:transition-colors duration-200 "
                  >
                    No
                  </button>
                  <button
                    onClick={() => handleDelete(projectId)}
                    className="bg-red-400 px-3 py-1 rounded-lg text-white hover:ring-1 hover:ring-offset-2 hover:ring-red-500 hover:bg-slate-100 hover:text-slate-700 hover:transition-colors duration-200"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <div className="grid rounded-md grid-cols-4  justify-center items-center h-[1000px] bg-orange-200/50 ">
            <div className="  grid gap-3 col-start-2 col-span-2 shadow-lg p-8 bg-slate-100 rounded-lg ">
              <div className="pb-5 flex items-center justify-center ">
                <h1 className=" underline underline-offset-4 text-xl font-semibold capitalize ">
                  {title}
                </h1>
              </div>
              <div className="bg  p-2 border border-slate-400 rounded-lg ">
                <h3 className=" flex flex-col   ">
                  <span className="font-bold  ">Details :</span>
                  {text}
                </h3>
              </div>
              <div className="flex items-center justify-center ">
                <h1 className="flex gap-x-2">
                  Creator :
                  <span className="underline-offset-4 underline capitalize  font-bold">
                    {creator_name}
                  </span>
                </h1>
              </div>
              <div className="flex justify-between items-center ">
                <h2 className="flex gap-x-2">
                  assigned to :
                  <span className="underline-offset-4 underline  font-bold">
                    {assignedToTeamName}
                  </span>
                </h2>
                <h4 className=" flex gap-x-2 ">
                  Due date :
                  <span className="underline underline-offset-4 font-bold ">
                    {date}
                  </span>
                </h4>
              </div>

              <div>
                <div className="flex items-center justify-between  ">
                  {/* Status : {status} */}
                  <h1 className="flex gap-x-2">
                    Priority :
                    <span
                      className={
                        (`${priority}` === "low"
                          ? "bg-lime-300 px-1 capitalize rounded-sm  font-bold  tracking-wider "
                          : undefined) ||
                        (`${priority}` === "medium"
                          ? "bg-orange-300 px-1 capitalize rounded-sm font-bold tracking-wider  "
                          : undefined) ||
                        (`${priority}` === "high"
                          ? "bg-rose-400 px-1 text-white capitalize rounded-sm font-bold tracking-wider "
                          : undefined)
                      }
                    >
                      {priority}
                    </span>{" "}
                  </h1>
                  <div className="flex gap-x-3">
                    <h3 className="flex gap-x-2 ">
                      {" "}
                      Status :{" "}
                      <span className="font-bold underline capitalize underline-offset-4  ">
                        {" "}
                        {status}{" "}
                      </span>{" "}
                    </h3>
                    <span className="">
                      {status === "completed" && (
                        <IoCheckmarkDoneCircle
                          className="text-lime-600"
                          size={25}
                        />
                      )}
                      {status === "in_progress" && (
                        <GiProgression className="text-orange-400" size={25} />
                      )}
                      {status === "pending" && (
                        <MdPendingActions className="text-rose-600" size={25} />
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* buttons  */}
              <div className="flex items-center justify-between pt-14 ">
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
                        onClick={() => handleAlert(_id, title)}
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

export default SingleNote;
