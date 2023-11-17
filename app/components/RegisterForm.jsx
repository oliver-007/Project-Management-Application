"use client";

import { signIn } from "next-auth/react";
import { CldImage, CldUploadButton, getCldImageUrl } from "next-cloudinary";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import profilePic from "../../public/profile-pic-log.png";
import Image from "next/image";
import { AiOutlineCamera } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";

const RegisterForm = () => {
  const [message, setMessage] = useState("");
  const [public_id, setPublic_id] = useState("");
  const [imageUrl, setimageUrl] = useState("");
  const { register, formState, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      image: "",
      email: "",
      password: "",
    },
  });
  const { errors, isSubmitSuccessful } = formState;

  const handleUploadSuccess = (data) => {
    // console.log("image object data --", data);
    // console.log("image object data --", data.info.public_id);
    setPublic_id(data?.info?.public_id);
  };

  //  image url
  const imgUrl = getCldImageUrl({
    src: public_id,
  });
  useEffect(() => {
    imgUrl && setimageUrl(imgUrl);
  }, [imgUrl]);

  // console.log("imag url --", imgUrl);

  const formSubmit = async (data) => {
    // console.log("form data", data);
    // const formData = new FormData();
    // formData.append("image", imgUrl);

    const allData = { ...data, image: imgUrl };

    // console.log("all data with image url--", allData);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allData),
      });

      if (!res.ok) {
        const errMsg = await res.json();
        setMessage(errMsg.message);
        console.log("Failed to submit", errMsg);
      } else {
        const errMsg = await res.json();
        setMessage(errMsg.message);
      }
    } catch (error) {
      console.log("error submitting data ", error);
    }
  };

  useEffect(() => {
    isSubmitSuccessful && reset();
    setimageUrl("");
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="grid place-items-center h-screen">
      <div className=" gap-3 border-t-4 border-cyan-400 rounded-lg shadow-lg p-6 ">
        <h1 className=" text-slate-800/70 text-xl font-bold my-4 ">
          Register :{" "}
        </h1>
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="flex flex-col gap-3"
        >
          {/* cloudinary button image upload */}
          <div className="flex justify-between relative items-center rounded-full  bg-slate-200 w-16 h-16 ">
            <div className="  ">
              {imageUrl ? (
                <CldImage
                  width={100}
                  height={100}
                  crop="thumb"
                  gravity="faces"
                  src={imageUrl}
                  alt="profile img"
                  className="rounded-full w-16 h-16 "
                />
              ) : (
                <Image
                  width={100}
                  height={100}
                  src={profilePic}
                  alt="profile pic"
                  className="rounded-full w-16 h-16"
                />
              )}
            </div>
            <div className="flex items-center justify-center inset-0 absolute rounded-full hover:opacity-100 opacity-0 bg-slate-500/50 ">
              <CldUploadButton
                onUpload={handleUploadSuccess}
                uploadPreset="PMA_d2d7sxas"
                className=" rounded-full px-4 py-1  "
              >
                <AiOutlineCamera size={20} className="text-zinc-800" />
              </CldUploadButton>
            </div>
          </div>
          {/* // ************* // name */}
          <input
            className="inputClass focus:outline-none focus:ring-1 focus:ring-blue-300 "
            type="text"
            placeholder="name"
            {...register("name", {
              required: {
                value: true,
                message: "* name required",
              },
              minLength: {
                value: 3,
                message: "* name must be more than 3 characters",
              },
            })}
          />
          {errors && (
            <p className="text-rose-500 text-xs -mt-2 pl-4">
              {errors.name?.message}
            </p>
          )}

          {/* img upload */}
          {/* <div>
            <label className="text-slate-500 text-sm px-1" htmlFor="Profile">
              Profile picture :
            </label>
            <input
              className="w-[300px]  file:border-0 file:hover:cursor-pointer file:bg-cyan-500 file:text-white file:px-2 file:py-1 file:rounded-full file:hover:bg-cyan-200 file:hover:text-zinc-600 hover:cursor-pointer file:hover:transition-colors file:hover:duration-500 text-sm text-slate-500  py-1 px-5 "
              id="profile"
              {...register("image", {
                required: {
                  value: true,
                  message: "* profile pic required ",
                },
              })}
              type="file"
            />
            {errors && (
              <p className="text-rose-500 text-xs -mt-1 pl-4">
                {errors.image?.message}
              </p>
            )}
          </div> */}

          {/* // **************** // e-mail */}
          <input
            className="inputClass focus:outline-none focus:ring-1 focus:ring-blue-300 "
            type="text"
            placeholder="E-mail"
            {...register("email", {
              required: {
                value: true,
                message: "* E-mail required",
              },
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "* invalid mail ",
              },
            })}
          />
          {errors && (
            <p className="text-rose-500 text-xs -mt-2 pl-4">
              {errors.email?.message}
            </p>
          )}

          {/* // ********** // password */}
          <input
            className="inputClass focus:outline-none focus:ring-1 focus:ring-blue-300 "
            type="password"
            placeholder="Password"
            {...register("password", {
              required: {
                value: true,
                message: "* Password required",
              },
              minLength: {
                value: 6,
                message: "* password must be more than 5 characters ",
              },
            })}
          />
          {errors && (
            <p className="text-rose-500 text-xs -mt-2 pl-4">
              {errors.password?.message}
            </p>
          )}

          <button className="bg-cyan-400 hover:bg-cyan-500 transition-colors duration-300 text-white rounded-b-lg py-2">
            {" "}
            Register{" "}
          </button>

          {/* registration with google */}
          {/* <button
            onClick={() => signIn("google")}
            type="button"
            className=" bg-cyan-400 hover:bg-cyan-500 transition-colors duration-300 text-white rounded-b-lg py-2"
          >
            {" "}
            Continue with Google
          </button> */}

          <p className="text-sm text-center mt-3  ">
            Already have an account ?{" "}
            <Link href={`/login`}>
              <span className="text-blue-400 tracking-wider hover:text-green-500 transition-colors duration-200 font-bold underline cursor-pointer ">
                Login
              </span>
            </Link>{" "}
            now.
          </p>
        </form>
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
    </div>
  );
};

export default RegisterForm;
