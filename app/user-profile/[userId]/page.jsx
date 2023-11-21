"use client";

import getAllUsers from "@/actions/getAllUsers";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import profilePic from "../../../public/profile-pic-log.png";
import Image from "next/image";
import Link from "next/link";
import { TiArrowBack } from "react-icons/ti";
import { useSession } from "next-auth/react";
import { RxCrossCircled } from "react-icons/rx";

const SingleUserPage = () => {
  const [singleUser, setSingleUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  // console.log("single user===", singleUser);

  const { data: session, status } = useSession();
  console.log("session Sender Id ---", session?.user?.id);

  const searchParams = useSearchParams();
  const teamId = searchParams.get("teamId");
  // console.log("search params team id ---", teamId);

  const params = useParams();
  const { userId } = params;

  const router = useRouter();

  useEffect(() => {
    const filteredUser = async () => {
      try {
        const users = await getAllUsers();
        const filtered = users.filter((user) => user._id === userId);
        setSingleUser(filtered);
        setLoading(false);
      } catch (error) {
        console.log("error---", error);
      }
    };
    filteredUser();
  }, [userId]);

  // ************** sent invitation to users
  const sendInvitation = async () => {
    try {
      const modifiedData = {
        teamId,
        senderId: session?.user?.id,
        receiverId: userId,
      };
      // console.log("sent invitation to -----", modifiedData);

      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modifiedData),
      });

      const { message } = await res.json();
      console.log("message==== ", message);
      setMessage(message);
    } catch (error) {
      console.log("err msg-===", error);
    }
  };

  return (
    <>
      <div>
        {loading ? (
          <p className=" grid justify-center items-center h-screen text-2xl font-bold text-slate-500 ">
            {" "}
            Loading....{" "}
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center bg-purple-200 h-screen ">
            <div className="mt-5 mb-20 bg-orange-400 w-20 h-10 rounded-full  justify-center items-center flex ring-2 ring-offset-2 ring-orange-400  ">
              <h2>User Bio</h2>
            </div>
            <div className="flex justify-center items-center gap-10 mb-5 ">
              <Image
                className="rounded-full w-48   h-48 "
                src={singleUser[0]?.image || profilePic}
                width={100}
                height={100}
                alt={singleUser[0]?.name || "profile Image"}
                priority={false}
              />
              <div className="flex flex-col gap-y-10">
                <div>
                  <h2 className="text-3xl">{singleUser[0]?.name}</h2>
                  <h2 className="text-xl">{singleUser[0]?.email}</h2>
                </div>

                <div className="flex items-center justify-center gap-10 ">
                  {/* back button */}
                  <div>
                    <button
                      onClick={() => router.back()}
                      className="bg-slate-500 rounded-full hover:ring-1 hover:ring-offset-2 hover:ring-zinc-500 hover:shadow-lg hover:shadow-zinc-400 hover:transition-all duration-200"
                    >
                      <div>
                        <span className="flex items-center justify-center px-2 py-1 gap-2 ">
                          <TiArrowBack className="text-white" size={20} />
                          <p className="text-base text-white ">Back</p>
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* add button */}
                  {teamId && (
                    <button
                      onClick={() => sendInvitation()}
                      className="bg-blue-400  text-white py-1 px-4 rounded-full hover:bg-sky-400 hover:ring-1 hover:ring-offset-2 hover:ring-sky-500 hover:shadow-lg hover:shadow-sky-300 hover:transition-colors duration-200 "
                    >
                      Add +
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* {message && (
              <p className="text-center mt-3 bg-gray-500 text-white rounded-full py-2 px-5 ">
                {" "}
                {message}{" "}
              </p>
            )} */}
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
          </div>
        )}
      </div>
    </>
  );
};

export default SingleUserPage;
