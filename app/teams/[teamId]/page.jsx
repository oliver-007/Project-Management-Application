"use client";

import { useTeam } from "@/app/context/TeamContext";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";

const SingleTeamPage = () => {
  const { allTeams } = useTeam();
  const { allUsers } = useUser();
  // console.log("all users ---", allUsers);
  const params = useParams();
  const { teamId } = params;

  const [remainingUsers, setRemainingUsers] = useState([]);
  // console.log("remaining users====", remainingUsers);
  const [currTeam, setCurrTeam] = useState([]);
  // console.log("curr team --", currTeam);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ******* Remove function
  const handleRemove = async (id) => {
    try {
      // sending member id to api route
      const res = await fetch(`/api/teams/${currTeam[0]._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: id }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        setMessage(message);
        console.log("Remove members from team failed", message);
      } else {
        const { message } = await res.json();
        setMessage(message);
        console.log("Remove members form team Success", message);
      }
    } catch (error) {
      console.log("err msg---", error);
    }
  };

  useEffect(() => {
    const currentTeam = allTeams.filter((team) => {
      return team._id === teamId;
    });
    setCurrTeam(currentTeam);
    setLoading(false);
    // console.log("current team info --", currentTeam);
  }, [allTeams, teamId]);

  // ******* filter out remaining users without team members
  useEffect(() => {
    const usersRemained = allUsers.filter(
      (user) => !currTeam[0]?.members.includes(user._id)
    );
    // console.log("remaining users====", remainingUsers);
    setRemainingUsers(usersRemained);
  }, [currTeam, allUsers]);

  return (
    <div className="p-8">
      <h1 className=" flex items-center justify-center text-3xl font-semibold text-slate-700/75 pb-5 bg-lime-100 ">
        {currTeam[0]?.name || <p>No Team Selected</p>}
      </h1>

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

      <div className=" grid grid-cols-2 gap-x-3">
        {/* choose member section */}
        <div className="bg-orange-200 px-5 py-3 ">
          <div className="py-1 text-lg rounded-full flex justify-center bg-indigo-300">
            <h2>---Choose members---</h2>
          </div>
          {loading ? (
            <p className="text-lg flex h-screen justify-center items-center font-semibold text-slate-500  ">
              Loading....
            </p>
          ) : (
            <div className=" h-[900px] overflow-y-scroll ">
              {!remainingUsers?.length > 0 ? (
                <p className=" text-yellow-700 text-lg font-semibold flex items-center justify-center mt-5 bg-slate-300 ring-1 ring-offset-2 ring-slate-400 py-2 rounded-full ">
                  {remainingUsers?.message || "No User Found"}
                </p>
              ) : (
                <div className=" ">
                  {remainingUsers?.map((user) => {
                    return (
                      <div key={user?._id} className="m-1">
                        <Link
                          href={{
                            pathname: `/user-profile/${user?._id}`,
                            query: { teamId: teamId },
                          }}
                        >
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

        {/* Current Team members */}
        <div className="bg-yellow-200 px-5 py-3 ">
          <div className="py-1 text-lg rounded-full flex justify-center bg-indigo-300">
            <h2>---Current Team Members---</h2>
          </div>

          <div className="h-[900px] overflow-y-scroll ">
            {!currTeam[0]?.membersInfo?.length > 0 ? (
              <p className=" text-yellow-700 text-lg font-semibold flex items-center justify-center mt-5 bg-slate-300 ring-1 ring-offset-2 ring-slate-400 py-2 rounded-full ">
                No Team Member Found
              </p>
            ) : (
              <div>
                {currTeam[0]?.membersInfo.map((mem) => {
                  return (
                    <div
                      key={mem?._id}
                      className="m-1 grid grid-cols-3 hover:bg-slate-100 rounded-full "
                    >
                      <Link
                        href={`/user-profile/${mem?._id}`}
                        className="col-span-2 "
                      >
                        <div className="flex items-center  gap-x-4 hover:bg-sky-200 rounded-full py-2 px-4 ">
                          <Image
                            className=" rounded-full w-10 h-10 "
                            src={`${mem?.image}`}
                            width={100}
                            height={100}
                            alt={`${mem?.name}`}
                            priority={false}
                          />
                          <p> {mem?.name} </p>
                        </div>
                      </Link>
                      <div className=" flex items-center justify-center  ">
                        <button
                          onClick={() => handleRemove(mem?._id)}
                          className="bg-rose-400 text-white px-4 py-1 rounded-full  hover:ring-1 hover:ring-offset-2 hover:bg-slate-100 hover:text-slate-700 hover:shadow-lg hover:shadow-rose-300  hover:ring-rose-500 hover:transition-all duration-200 "
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTeamPage;
