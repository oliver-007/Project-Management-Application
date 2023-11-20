"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [error, setError] = useState(false);

  const router = useRouter();

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { errors, isSubmitSuccessful, isSubmitting } = formState;

  const formSubmit = async (data) => {
    try {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (res.error) {
        setError(res.error);
      }
      router.replace("/dashboard");
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="grid place-items-center grid-cols-4  grid-rows-6 px-16 ">
      <div className="shadow-lg gap-3 p-6 rounded-lg border-y-4 border-blue-400  col-start-2 col-span-2 row-start-3 row-span-2 w-full max-w-2xl ">
        <h1 className=" text-slate-800/70 text-xl font-bold my-4">Login :</h1>
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="flex flex-col gap-3  "
        >
          <input
            className="inputClass focus:outline-none focus:ring-1 focus:ring-blue-300 "
            type="email"
            autoComplete="on"
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
          <p className="text-rose-500 text-xs -mt-2 pl-4">
            {" "}
            {errors.email?.message}{" "}
          </p>
          <input
            className="inputClass focus:outline-none focus:ring-1 focus:ring-blue-300 "
            type="password"
            placeholder="Password"
            {...register("password", {
              required: {
                value: true,
                message: "* Password required",
              },
            })}
          />
          <p className="text-rose-500 text-xs -mt-2 pl-4">
            {" "}
            {errors.password?.message}{" "}
          </p>

          <button className=" rounded-b-lg bg-blue-400 text-white font-bold cursor-pointer px-6 py-2 hover:bg-blue-500  transition-color duration-300 ">
            {" "}
            Login
          </button>

          {/* google authentication */}
          {/* <button
            onClick={() => signIn("google")}
            type="button"
            className=" rounded-b-lg bg-blue-400 text-white font-bold cursor-pointer px-6 py-2 hover:bg-blue-500  transition-color duration-300 "
          >
            {" "}
            Continue with Google
          </button> */}

          <p className="text-sm mt-3 text-center">
            {" "}
            Don't have an account ?{" "}
            <Link href={`/register`}>
              <span className="text-blue-400 tracking-widest underline font-bold hover:text-green-500 transition-color duration-300">
                Register
              </span>
            </Link>{" "}
            now.
          </p>
        </form>
        {error && (
          <p className="text-center mt-3 bg-rose-500 text-white rounded-full py-2 px-5 ">
            {" "}
            {error}{" "}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
