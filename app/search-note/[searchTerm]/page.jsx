"use client";

import { useNote } from "@/app/context/NoteContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GiProgression } from "react-icons/gi";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdPendingActions } from "react-icons/md";

const page = () => {
  const { allNotes } = useNote();
  // console.log("dynamic search note page ALL NOTES -----", allNotes);

  const [filteredNote, setFilteredNote] = useState([]);

  const params = useParams();
  const sQuery = params.searchTerm;

  // console.log("dynamic search params ---", sQuery);

  useEffect(() => {
    if (sQuery) {
      const queryData = allNotes.filter((note) => {
        return (
          note.title.toLowerCase().includes(sQuery.trim().toLowerCase()) ||
          note.status.toLowerCase().includes(sQuery.trim().toLowerCase()) ||
          note.priority.toLowerCase().includes(sQuery.trim().toLowerCase()) ||
          note.assignedToTeamName
            .toLowerCase()
            .includes(sQuery.trim().toLowerCase()) ||
          note.date.includes(sQuery)
        );
      });
      setFilteredNote(queryData);

      if (queryData.length === 0) {
        setFilteredNote([]);
      }

      // console.log("query data----", queryData);
    }
  }, [sQuery, allNotes]);
  // console.log("filtered note data dynamic search note page=====", filteredNote);

  return (
    <div>
      <div>
        <h1 className="text-center text-2xl text-slate-500">Filtered Tasks</h1>
      </div>
      {/* dispaly filtered data not found */}
      {filteredNote && filteredNote.length === 0 && <p>no data found</p>}

      {/* display filtered data */}
      {filteredNote && filteredNote.length > 0 && (
        <div className="grid grid-cols-3 gap-6 p-6 ">
          {filteredNote.map((note) => {
            const {
              creator_name,
              assignedToTeamName,
              date,
              priority,
              status,
              text,
              title,
            } = note;
            return (
              <Link href={`/dashboard/${note._id}`} key={note._id}>
                <div className=" cursor-pointer grid gap-3 hover:shadow-lg shadow-md hover:shadow-gray-500 transition-all duration-200 p-5 max-w-xs bg-gray-300/25 hover:ring-1 ring-offset-2 ring-offset-slate-300 rounded-md hover:ring-lime-300 hover:scale-105 text-sm ">
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
                  <div>
                    <h4 className="flex items-center justify-between  ">
                      Status : {status}
                      <span>
                        {note.status === "completed" && (
                          <IoCheckmarkDoneCircle
                            className="text-lime-600"
                            size={25}
                          />
                        )}
                        {note.status === "in_progress" && (
                          <GiProgression
                            className="text-orange-400"
                            size={25}
                          />
                        )}
                        {note.status === "pending" && (
                          <MdPendingActions
                            className="text-rose-600"
                            size={25}
                          />
                        )}
                      </span>
                    </h4>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default page;
