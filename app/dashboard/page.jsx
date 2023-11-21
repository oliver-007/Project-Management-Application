"use client";

import getAllNotes from "@/actions/getAllNotes";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { GiProgression } from "react-icons/gi";
import { MdPendingActions } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import SearchForm from "../components/SearchForm";
import { useNote } from "../context/NoteContext";
import getAllUsers from "@/actions/getAllUsers";
import { useUser } from "../context/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse } from "date-fns";
import { useFilter } from "../context/FilterContext";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const { allNotes, setAllNotes } = useNote();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showCal, setShowCal] = useState(false);
  const [filteredNote, setFilteredNote] = useState([]);
  // console.log("filtered note=--==", filteredNote);
  const { filterQuery, setFilterQuery } = useFilter();
  // console.log(
  //   "filter query dashboard page filter context api ----",
  //   filterQuery
  // );

  // **** string search query function
  useEffect(() => {
    if (filterQuery) {
      const queryData = allNotes.filter((note) => {
        return (
          note.title.toLowerCase().includes(filterQuery.trim().toLowerCase()) ||
          note.status
            .toLowerCase()
            .includes(filterQuery.trim().toLowerCase()) ||
          note.priority
            .toLowerCase()
            .includes(filterQuery.trim().toLowerCase()) ||
          note.assignedToTeamName
            .toLowerCase()
            .includes(filterQuery.trim().toLowerCase()) ||
          note.date.includes(filterQuery)
        );
      });
      setFilteredNote(queryData);
      if (queryData.length === 0) {
        setFilteredNote([]);
      }
      // console.log("query data----", queryData);
    }
  }, [filterQuery]);

  // handle date range
  const handleDateRange = (dates) => {
    const [start, end] = dates;
    let filtered = allNotes.filter((singleNote) => {
      let parsedDate = parse(singleNote.date, "yyyy-MM-dd", new Date());
      return parsedDate >= start && parsedDate <= end;
    });

    setStartDate(start);
    setEndDate(end);
    setFilteredNote(filtered);
  };

  // handle reset filter
  const handleRemoveFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredNote([]);
    setFilterQuery("");
  };

  useEffect(() => {
    const fetchedAllNotes = async () => {
      const notes = await getAllNotes();
      // console.log("notes ---- dashboard ---", notes);
      setAllNotes(notes);
    };

    if (loading) {
      fetchedAllNotes();
      setLoading(false);
    }
  }, []);

  return (
    <>
      <div className=" grid grid-cols-4 p-2 mx-11 gap-x-2 border border-slate-300 rounded-md bg-slate-100">
        {/* filter section */}
        <div className="bg-purple-200 flex flex-col gap-y-7 px-4 rounded-md ">
          {/* search form */}
          <div className="py-8">
            <SearchForm />
          </div>
          <div className="flex flex-col gap-y-5 py-4 justify-around items-center  ">
            <button
              onClick={() => setShowCal(!showCal)}
              className="flex justify-center items-center bg-amber-600 rounded-full text-white px-3 py-1 hover:bg-sky-400 hover:ring-1 hover:ring-offset-2 hover:ring-blue-500 hover:transition-colors duration-200 "
            >
              Search by Due Date
            </button>

            {!showCal ? (
              <div></div>
            ) : (
              // ****** filter by date
              <DatePicker
                selected={startDate}
                onChange={handleDateRange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
              />
            )}
            {/* romove button */}
            <button
              onClick={handleRemoveFilter}
              className="flex justify-center items-center bg-rose-600 rounded-full text-white px-3 py-1 hover:bg-green-500 hover:ring-1 hover:ring-offset-2 hover:ring-green-500 hover:transition-colors duration-200 "
            >
              Remove All Filters
            </button>
          </div>
        </div>

        {/* *********** all notes && filtered notes section ************ */}
        <div className=" col-span-3 pt-6 bg-red-300 rounded-md">
          <div className="px-6">
            <h1 className="text-center text-2xl text-slate-500 bg-sky-200 rounded-full ">
              {filteredNote.length > 0 ? "Filtered Projects" : "All Porjects"}
            </h1>
          </div>
          <div className="  p-6 ">
            {loading && (
              <p className=" grid justify-center items-center text-2xl font-bold text-slate-500 ">
                {" "}
                Loading....{" "}
              </p>
            )}

            {!allNotes?.length > 0 ? (
              <div className="flex items-center justify-center">
                <h1 className="text-3xl text-slate-500 ">
                  {allNotes?.message}
                </h1>
              </div>
            ) : startDate === null && endDate === null && !filterQuery ? (
              <div className="  grid grid-cols-3 gap-x-7 gap-y-10 justify-center items-center  bg-orange-100  p-5 rounded-md  h-[1000px] overflow-y-scroll   ">
                {allNotes?.map((note) => {
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
                      <div className=" cursor-pointer grid gap-3 hover:shadow-lg shadow-md hover:shadow-gray-500 transition-all duration-200 p-5 bg-gray-300/25 hover:ring-1 ring-offset-2 ring-offset-slate-300 rounded-md hover:ring-lime-300 hover:scale-105 text-sm ">
                        <div className="pb-5">
                          <h1 className="text-xl font-semibold ">{title}</h1>
                        </div>
                        <div className="flex justify-between items-center ">
                          <h2 className="flex flex-col gap-1 items-center justify-center ">
                            assigned to :
                            <span className="underline-offset-4 underline  font-bold">
                              {assignedToTeamName}
                            </span>
                          </h2>
                          <h4 className=" flex flex-col gap-1 items-center justify-center ">
                            Due date :
                            <span className="underline underline-offset-4 font-bold ">
                              {date}
                            </span>
                          </h4>
                        </div>

                        <div>
                          <h4 className="flex items-center justify-between  ">
                            {/* Status : {status} */}
                            <h1>
                              {/* Priority : */}
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
            ) : !filteredNote?.length > 0 ? (
              <div className="bg-slate-300 text-slate-700 flex items-center justify-center rounded-full p-4 text-xl capitalize ">
                ~ No project found ~{" "}
              </div>
            ) : (
              <div className="  grid grid-cols-3 gap-x-7 gap-y-10 justify-center  bg-orange-100  p-5 rounded-md  h-[1000px] overflow-y-scroll   ">
                {filteredNote?.map((note) => {
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
                      <div className=" cursor-pointer grid gap-3 hover:shadow-lg shadow-md hover:shadow-gray-500 transition-all duration-200 p-5 bg-gray-300/25 hover:ring-1 ring-offset-2 ring-offset-slate-300 rounded-md hover:ring-lime-300 hover:scale-105 text-sm ">
                        <div className="pb-5">
                          <h1 className="text-xl font-semibold ">{title}</h1>
                        </div>
                        <div className="flex justify-between items-center ">
                          <h2 className="flex flex-col gap-1 items-center justify-center ">
                            assigned to :
                            <span className="underline-offset-4 underline  font-bold">
                              {assignedToTeamName}
                            </span>
                          </h2>
                          <h4 className=" flex flex-col gap-1 items-center justify-center ">
                            Due date :
                            <span className="underline underline-offset-4 font-bold ">
                              {date}
                            </span>
                          </h4>
                        </div>

                        <div>
                          <h4 className="flex items-center justify-between  ">
                            {/* Status : {status} */}
                            <h1>
                              {/* Priority : */}
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
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
