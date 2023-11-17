"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFilter } from "../context/FilterContext";

const SearchForm = () => {
  const { filterQuery, setFilterQuery } = useFilter();

  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitSuccessful },
    reset,
  } = useForm();

  // search data form submit function
  const formSubmit = async (data) => {
    const sQuery = data.search;
    // console.log("search data ---->", sQuery);

    setFilterQuery(sQuery);
  };

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful]);
  return (
    <div className=" grid justify-center items-center w-full py-4  ">
      <div className="flex justify-center items-center bg-slate-300 px-5 py-3 rounded-full ">
        <form
          onSubmit={handleSubmit(formSubmit)}
          className=" flex gap-6 text-sm justify-center"
        >
          <div className="flex items-center gap-2 ">
            <input
              {...register("search")}
              type="text"
              id="search"
              placeholder="search..."
              className=" w-40 h-7 ring-1 ring-offset-2 ring-slate-300 bg-slate-200 rounded-sm focus:outline-none focus:ring-blue-400 px-3 py-1 text-sm hover:bg-lime-100/50 hover:transition-colors duration-200"
            />
          </div>

          <div>
            <button
              disabled={!isDirty}
              className="grid justify-center items-center bg-gray-600 rounded-full text-white px-3 py-2 hover:bg-blue-400 hover:ring-1 hover:ring-offset-2 hover:ring-blue-400 hover:transition-colors duration-200 "
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
