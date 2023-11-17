"use client";

import getAllUsers from "@/actions/getAllUsers";
import getSingleNote from "@/actions/getSingleNote";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { RxCrossCircled } from "react-icons/rx";
import { useTeam } from "../context/TeamContext";

const UpdateNoteForm = () => {
  const [noteData, setNoteData] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [message, setMessage] = useState("");
  const { allTeams } = useTeam();
  console.log("all teams from update note form page===", allTeams);

  const router = useRouter();

  console.log("note data from update note form---", noteData);
  const params = useParams();
  const noteId = params.taskId;
  console.log("update note form params---- ", params);

  useEffect(() => {
    const fetchedFromData = async () => {
      try {
        const note = await getSingleNote(noteId);
        console.log("note from update note form----", note);

        // const users = await getAllUsers();
        // console.log("users from update note form ----", users);

        // setAllUsers(users);
        setNoteData(note);
      } catch (error) {
        console.log("error---", error);
      }
    };
    fetchedFromData();
  }, []);

  console.log("note data existing value ---", noteData);

  const { register, handleSubmit, formState, setValue } = useForm({
    title: "",
    priority: "",
    status: "",
    text: "",
    assigned_to: "",
    date: "",
  });

  const {
    assignedToUserName,
    date,
    priority,
    status,
    text,
    title,
    assigned_to,
  } = noteData;

  useEffect(() => {
    Object.entries(noteData).forEach(([name, value]) => setValue(name, value));
  }, [setValue, noteData]);

  const { errors, isSubmitSuccessful, isSubmitting } = formState;

  // ******** form submit
  const formSubmit = async (data) => {
    console.log("only form data : ", data);

    try {
      const formData = {
        ...data,
      };
      console.log("form data : ", formData);

      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errMsg = await res.json();
        setMessage(errMsg.message);
        console.log("note submission failed msg : ", errMsg);
      } else {
        const successMsg = await res.json();
        setMessage(successMsg.message);
        console.log("submit success msg : ", successMsg);
      }
    } catch (error) {
      console.log("err msg --", error);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      router.push("/dashboard");
    }
  }, [isSubmitSuccessful]);

  return (
    <div className="grid place-items-center h-screen">
      <div className=" shadow-lg gap-3 p-6 rounded-lg border-t-4 border-blue-400  ">
        <h1 className=" text-slate-800/70 text-xl font-bold my-4">
          Update Task :
        </h1>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(formSubmit)}
          noValidate
        >
          <div className="grid  justify-around w-[400px] pt-1 pb-3 items-center  ">
            <label
              htmlFor="title"
              className="text-slate-800/70 px-2 text-sm w-36 "
            >
              Title :
            </label>
            <input
              id="title"
              className="inputClass focus:outline-none focus:ring-1 focus:ring-blue-300   "
              type="text"
              placeholder="Title"
              // defaultValue={title}
              {...register("title", {
                required: {
                  value: true,
                  message: " * Title is required",
                },
              })}
            />
            <p className="text-rose-500 text-xs mt-1  pl-4 ">
              {" "}
              {errors.title?.message}{" "}
            </p>
          </div>

          {/* description */}
          <div className="grid  justify-around w-[400px] pt-1 pb-3 items-center  ">
            <label
              htmlFor="note_details"
              className="text-slate-800/70 px-2 text-sm w-36 "
            >
              Description :
            </label>

            <textarea
              id="note_details"
              className="inputClass focus:outline-none focus:ring-1 focus:ring-blue-300   "
              placeholder="Note Details"
              // defaultValue={text}
              {...register("text", {
                required: {
                  value: true,
                  message: " * Description is required",
                },
              })}
            />

            <p className="text-rose-500 text-xs mt-1  pl-4">
              {" "}
              {errors.text?.message}{" "}
            </p>
          </div>

          {/* Priority level input */}
          <div className="flex justify-around   w-[400px]  pb-3  ">
            <span className="text-slate-800/75 ">Priority :</span>
            <div>
              <input
                type="radio"
                id="low"
                value="low"
                {...register("priority", {
                  required: {
                    value: true,
                    message: "* Priority required",
                  },
                })}
              />
              <label
                className="ml-1 cursor-pointer text-slate-800/75"
                htmlFor="low"
              >
                Low
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="medium"
                value="medium"
                {...register("priority", {
                  required: {
                    value: true,
                    message: "* Priority required",
                  },
                })}
              />
              <label
                className="ml-1 cursor-pointer text-slate-800/75 "
                htmlFor="medium"
              >
                Medium
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="high"
                value="high"
                {...register("priority", {
                  required: {
                    value: true,
                    message: "* Priority required",
                  },
                })}
              />
              <label
                className="ml-1 cursor-pointer text-slate-800/75 "
                htmlFor="high"
              >
                High
              </label>
            </div>
          </div>

          <p className="text-rose-500 text-xs -mt-4 pl-4">
            {" "}
            {errors.priority?.message}{" "}
          </p>

          {/* Status  */}
          <div className="flex justify-around   w-[400px]  pb-3  ">
            <span className="text-slate-800/75 ">Status :</span>
            <div>
              <input
                type="radio"
                id="pending"
                value="pending"
                {...register("status", {
                  required: {
                    value: true,
                    message: "* Status required",
                  },
                })}
              />
              <label
                className="ml-1 cursor-pointer text-slate-800/75"
                htmlFor="pending"
              >
                Pending
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="in_progress"
                value="in_progress"
                {...register("status", {
                  required: {
                    value: true,
                    message: "* Status required",
                  },
                })}
              />
              <label
                className="ml-1 cursor-pointer text-slate-800/75"
                htmlFor="in_progress"
              >
                In Progress
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="completed"
                value="completed"
                {...register("status", {
                  required: {
                    value: true,
                    message: "* Status required",
                  },
                })}
              />
              <label
                className="ml-1 cursor-pointer text-slate-800/75 "
                htmlFor="completed"
              >
                Completed
              </label>
            </div>
          </div>
          <p className="text-rose-500 text-xs -mt-4 pl-4">
            {" "}
            {errors.status?.message}{" "}
          </p>

          {/* Due date */}
          <div className="grid  justify-around w-[400px] pt-1 pb-3 items-center  ">
            <label className="text-slate-800/70 pl-2 text-sm" htmlFor="date">
              Due Date :{" "}
            </label>
            <input
              className="inputClass text-slate-800/70 focus:outline-none focus:ring-1 focus:ring-blue-300  "
              id="date"
              type="date"
              // defaultValue={date}
              {...register("date", {
                // valueAsDate: true,
                required: {
                  value: true,
                  message: " * Due date required",
                },
              })}
            />
            <p className="text-rose-500 text-xs mt-1 pl-4">
              {" "}
              {errors.date?.message}{" "}
            </p>
          </div>

          {/* Assigned to */}
          <div className="grid  justify-around w-[400px] pt-1 pb-3 items-center  ">
            <label
              htmlFor="assignee"
              className="text-slate-800/70 px-2 text-sm w-36 "
            >
              Assigned to :
            </label>
            <select
              {...register("assigned_to", {
                // required: {
                //   value: true,
                //   message: "* plz confirm assigned user ",
                // },
              })}
              id="assignee"
              className=" inputClass text-slate-800/70 focus:outline-none focus:ring-1 focus:ring-blue-300 text-sm cursor-pointer hover:bg-slate-100/75 transition-colors duration-200 "
            >
              <option> {assignedToUserName} </option>

              {allTeams?.map((team) => {
                return (
                  <option className="" value={team?._id} key={team?._id}>
                    {team?.name}
                  </option>
                );
              })}
            </select>

            <p className="text-rose-500 text-xs mt-1  pl-4">
              {" "}
              {errors.assigned_to?.message}{" "}
            </p>
          </div>

          <div className="grid mt-3">
            <button
              disabled={isSubmitting}
              className=" rounded-b-lg bg-blue-400 text-white font-bold cursor-pointer px-6 py-2 hover:bg-blue-500  transition-color duration-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
            >
              {" "}
              Update
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

export default UpdateNoteForm;
