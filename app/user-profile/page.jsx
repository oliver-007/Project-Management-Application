"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import profilePic from "../../public/profile-pic-log.png";
import { useEffect, useState } from "react";
import getAllInvitations from "@/actions/getAllInvitations";
import Link from "next/link";
import { headers } from "@/next.config";
import { RxCrossCircled } from "react-icons/rx";

const UserProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  // console.log("session  :", session);

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/" });
    router.push(data.url);
  };

  const receiver_Id = session?.user?.id;
  // console.log("receiver id profile page ---", receiver_Id);

  useEffect(() => {
    const fetchedInvitations = async () => {
      try {
        const receiverInvitations = await getAllInvitations(receiver_Id);
        // console.log(
        //   "fetched receivers invitations profile page ===",
        //   receiverInvitations
        // );

        setInvitations(receiverInvitations);
        setLoading(false);
      } catch (error) {
        console.log("err msg---", error);
      }
    };

    fetchedInvitations();
  }, [session, receiver_Id]);

  // ******** Decline function
  const handleDecline = async (id) => {
    // console.log("invitation id  decline fucntion ----", id);

    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const { message } = await res.json();
        setMessage(message);
        console.log("Delete Invitation Failed", message);
      } else {
        const { message } = await res.json();
        setMessage(message);
        console.log("Delete Invitation Success", message);
      }
    } catch (error) {
      console.log("err msg---", error);
    }
  };

  // ******** Accept function
  const handleAccept = async (id) => {
    // console.log("handle accept id ===", id);

    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const { message } = await res.json();
        setMessage(message);
        console.log("invitation Accept Failed", message);
      } else {
        const { message } = await res.json();
        setMessage(message);
        console.log("invitation Accept Success", message);
      }
    } catch (error) {
      console.log("err msg===", error);
    }
  };

  return (
    <>
      <div className="px-8">
        <div className="grid grid-cols-3 bg-pink-100 h-screen p-5 ">
          {/* profile section */}
          <div className="bg-purple-200 col-span-2 ">
            <div className="flex flex-col items-center justify-center">
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
              <div className="mt-10 mb-36 bg-orange-400 w-20 h-10 rounded-full  justify-center items-center flex ">
                <h2>Profile</h2>
              </div>
              <div className="flex justify-center items-center gap-4 mb-5 ">
                <Image
                  className="rounded-full w-20   h-20 "
                  src={session?.user?.image || profilePic}
                  width={100}
                  height={100}
                  alt={session?.user?.name || "profile Image"}
                  priority={false}
                />
                <h2 className="text-3xl">{session?.user?.name}</h2>
              </div>

              <h2 className="text-xl">{session?.user?.email}</h2>
            </div>

            {status === "unauthenticated" ? (
              <div className="hidden"></div>
            ) : (
              <div className="text-center mt-32">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="hover:border border-rose-500 py-3 px-5 rounded-full bg-rose-500  shadow-md text-white "
                >
                  {" "}
                  Log out{" "}
                </button>
              </div>
            )}
          </div>

          {/* notification section */}
          <div className="bg-lime-100 flex flex-col gap-y-3 px-5 py-2 h-2/3 overflow-y-scroll  ">
            <div className="py-1 text-lg rounded-full flex justify-center bg-indigo-300">
              <h2>--- Invitations ---</h2>
            </div>
            {loading ? (
              <p className="text-lg flex h-screen justify-center items-center font-semibold text-slate-500  ">
                Loading...
              </p>
            ) : (
              <div>
                {!invitations.length > 0 ? (
                  <p className=" text-yellow-700 text-lg font-semibold flex items-center justify-center mt-5 bg-slate-300 ring-1 ring-offset-2 ring-slate-400 py-2 rounded-full ">
                    {" "}
                    {invitations.message}{" "}
                  </p>
                ) : (
                  <div className="grid justify-center items-center gap-y-2">
                    {invitations?.map((inv) => {
                      return (
                        <div
                          key={inv._id}
                          className="flex flex-col bg-slate-50 items-center p-2 ring-1 ring-slate-400 rounded-md hover:bg-cyan-100 "
                        >
                          <div className="flex  gap-x-2 items-center p-3 w-full ">
                            <Image
                              className=" rounded-full w-10 h-10"
                              src={inv?.senderImg}
                              width={100}
                              height={100}
                              alt={inv?.senderName}
                            />
                            <p>
                              {" "}
                              <span className="font-bold tracking-wider ">
                                {inv?.senderName}
                              </span>{" "}
                              sent request to join{" "}
                              <span className="font-bold tracking-wider ">
                                {inv?.teamName}{" "}
                              </span>{" "}
                            </p>
                          </div>

                          {/* button section */}
                          <div className="flex justify-around items-center w-full  py-2 ">
                            <button
                              onClick={() => handleDecline(inv?._id)}
                              className="bg-rose-400 text-white px-2 py-1 rounded-full hover:bg-white hover:text-slate-700 hover:ring-1 hover:ring-offset-2 hover:ring-rose-400 hover:transition-colors duration-200 "
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAccept(inv?._id)}
                              className="bg-blue-400 text-white px-3 py-1 rounded-full hover:bg-white hover:text-slate-700 hover:ring-1 hover:ring-offset-2 hover:ring-blue-400 hover:transition-colors duration-200 "
                            >
                              Accept
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
        </div>
      </div>
    </>
  );
};

export default UserProfile;
