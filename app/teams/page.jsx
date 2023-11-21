"use client";

import React, { useEffect, useState } from "react";
import TeamCreateFrom from "./TeamCreateFrom";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import Link from "next/link";
import getAllUsers from "@/actions/getAllUsers";
import getAllTeams from "@/actions/getAllTeams";
import { useTeam } from "../context/TeamContext";
import { useSession } from "next-auth/react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { RxCrossCircled } from "react-icons/rx";

const TeamPage = () => {
  const { allUsers, setAllUsers } = useUser();
  const [openTeamForm, setOpenTeamForm] = useState(false);
  const { allTeams, setAllTeams } = useTeam();
  const [loading, setLoading] = useState(true);
  // console.log("all teams from team-management page---", allTeams);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [tmId, setTmId] = useState("");
  const [tmName, setTmName] = useState("");

  const { data: session, status } = useSession();
  const creatorId = session?.user?.id;

  // ******* handle show alert
  const handleAlert = (id, name) => {
    setTmName(name);
    setTmId(id);
    setShowAlert(true);
  };

  // ******** Delete function
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const { message } = await res.json();
        setMessage(message);
        setShowAlert(false);
        console.log("Delete team failed---", message);
      } else {
        const { message } = await res.json();
        setMessage(message);
        setShowAlert(false);
        console.log("Delete team Success", message);
      }
    } catch (error) {
      console.log("err msg====", error);
    }
  };

  useEffect(() => {
    const fetchedTeams = async () => {
      const teams = await getAllTeams(creatorId);
      // console.log("all teams from team-management page---", teams);
      setAllTeams(teams);
      setLoading(false);
    };
    fetchedTeams();
  }, [session, creatorId, setAllTeams]);

  useEffect(() => {
    const fetchedUsers = async () => {
      const users = await getAllUsers();
      setAllUsers(users);
      setLoading(false);
    };
    fetchedUsers();
  }, [setAllUsers]);
  return (
    <div className="px-7">
      {/* show alert box */}
      {showAlert ? (
        <div className="flex items-center justify-center  ">
          <div className="bg-cyan-100 flex justify-around items-center py-2 px-4 w-full ">
            <p className="text-lg text-slate-700">
              You really want to
              <span className="font-bold ">
                {" "}
                Delete &quot; {tmName} &quot;{" "}
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
                onClick={() => handleDelete(tmId)}
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
      <div className="bg-pink-300 grid h-[1000px] grid-cols-5 p-4 ">
        {/* displaying All Teams name */}
        <div className="bg-lime-200 p-8 col-span-2 ">
          <div className="py-1 text-lg rounded-full flex justify-center bg-indigo-300">
            <h2>--- Teams ---</h2>
          </div>

          {/* show response message */}
          {message && (
            <div className="flex justify-around items-center bg-black rounded-full my-2 py-2 ">
              <p className="text-center  text-yellow-400 rounded-full py-2 px-5 ">
                {" "}
                {message}{" "}
              </p>

              <button
                onClick={() => setMessage("")}
                className=" p-2 hover:text-rose-500 text-lime-400 duration-200 "
              >
                {" "}
                <RxCrossCircled size={25} />{" "}
              </button>
            </div>
          )}
          {loading ? (
            <p className="text-lg flex h-screen justify-center items-center font-semibold text-slate-500  ">
              Loading...
            </p>
          ) : (
            <div>
              {!allTeams?.length > 0 ? (
                <p className=" text-yellow-700 text-lg font-semibold flex items-center justify-center mt-5 bg-slate-300 ring-1 ring-offset-2 ring-slate-400 py-2 rounded-full ">
                  {" "}
                  {allTeams?.message}{" "}
                </p>
              ) : (
                <div className=" p-2  ">
                  {allTeams?.map((tm) => {
                    return (
                      <div
                        key={tm._id}
                        className="grid grid-cols-3 hover:bg-slate-100 rounded-full "
                      >
                        <Link href={`/teams/${tm?._id}`} className="col-span-2">
                          <div className="m-2 bg-amber-200 hover:bg-sky-200 rounded-full flex justify-center items-center">
                            <h2 className="text-lg px-4 py-2 "> {tm?.name} </h2>
                          </div>
                        </Link>
                        <div className=" flex items-center justify-center  ">
                          <button
                            onClick={() => handleAlert(tm._id, tm.name)}
                            className="bg-rose-400 text-white py-1 px-3  rounded-full  hover:ring-1 hover:ring-offset-2 hover:bg-slate-100 hover:text-slate-700 hover:shadow-lg hover:shadow-rose-300  hover:ring-rose-500 hover:transition-all duration-200 "
                          >
                            <RiDeleteBin2Line size={25} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* create team section */}
        <div className="bg-purple-200  p-8 col-span-2  ">
          <div className=" flex flex-col  ">
            {" "}
            <button
              type="button"
              onClick={() => setOpenTeamForm(!openTeamForm)}
              className="ring-1 ring-offset-2 ring-lime-400 px-3 py-1 rounded-full bg-orange-200 "
            >
              Create Team
            </button>
            {openTeamForm ? <TeamCreateFrom /> : <div></div>}
          </div>
        </div>

        {/* display All Users Name */}
        <div className="bg-orange-200 h-full py-8 px-3 ">
          <div className="py-1 text-lg rounded-full flex justify-center bg-indigo-300">
            <h2>--- Users ---</h2>
          </div>
          {loading ? (
            <p className="text-lg flex justify-center items-center font-semibold text-slate-500  ">
              Loading....
            </p>
          ) : (
            <div className=" h-[850px] overflow-y-scroll ">
              {!allUsers?.length > 0 ? (
                <p className=" text-yellow-700 text-lg font-semibold flex items-center justify-center mt-5 bg-slate-300 ring-1 ring-offset-2 ring-slate-400 py-2 rounded-full ">
                  {" "}
                  {allUsers?.message}{" "}
                </p>
              ) : (
                <div>
                  {allUsers?.map((user) => {
                    return (
                      <div key={user?._id} className="m-1">
                        <Link href={`/user-profile/${user?._id}`}>
                          <div className="flex items-center gap-x-4 hover:bg-sky-200 rounded-full py-2 px-4 ">
                            <Image
                              className=" rounded-full w-10 h-10 "
                              src={`${user?.image}`}
                              width={100}
                              height={100}
                              alt={`${user?.name}`}
                              priority={false}
                            />
                            <p> {user?.name} </p>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
