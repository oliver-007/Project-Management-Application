"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import { RxCrossCircled } from "react-icons/rx";

const TeamCreateFrom = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const { data: session, status } = useSession();
  const { allUsers } = useUser();
  // console.log("all users ----", allUsers);

  useEffect(() => {
    setLoading(false);
  }, []);

  //   create team form submit
  const formSubmit = async (data) => {
    // console.log("team only form input data---", data);

    try {
      const allData = {
        ...data,
        creator_id: session?.user?.id,
        creator_name: session?.user?.name,
      };
      // console.log("team updated formData ---", allData);

      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allData),
      });

      const { message } = await res.json();
      setMessage(message);
    } catch (error) {
      console.log("err msg===", error);
    }
  };

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <div>
      <div className="">
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(formSubmit)}
          noValidate
        >
          <div className="flex flex-col py-3 px-5  justify-center   ">
            <label
              htmlFor="title"
              className="text-slate-800/70 px-2 py-2 text-sm  "
            >
              Team Name :
            </label>
            <input
              id="title"
              className=" inputClass  focus:outline-none focus:ring-1 focus:ring-blue-300 "
              type="text"
              placeholder="Team Name..."
              {...register("name", {
                required: {
                  value: true,
                  message: "* Team Name required",
                },
              })}
            />
            <p className="text-rose-500 text-sm mt-1 pl-4 ">
              {" "}
              {errors.name?.message}{" "}
            </p>
          </div>

          <div className="grid mt-3">
            <button className=" rounded-b-lg bg-blue-400 text-white font-bold cursor-pointer px-6 py-2 hover:bg-blue-500  transition-color duration-300 focus:outline-none focus:ring-1 focus:ring-blue-300">
              {" "}
              Create
            </button>
          </div>
        </form>

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
    </div>
  );
};

export default TeamCreateFrom;
