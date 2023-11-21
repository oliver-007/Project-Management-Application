"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const currentPath = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  // const session = useSession();
  // console.log("session navbar status :  ", session);

  return (
    <div className="px-11 mt-6">
      <div className="flex justify-around bg-sky-400 rounded-lg py-3 mb-3 ">
        <div className="flex justify-center ">
          <ul className=" space-x-6 ">
            <Link
              href={"/"}
              className={
                `${currentPath}` === "/"
                  ? "border-b-2 rounded-b-sm border-black py-1 transition-all duration-300  "
                  : "pb-2"
              }
            >
              Home
            </Link>
            <Link
              href={"/dashboard"}
              className={
                `${currentPath}` === "/dashboard"
                  ? "border-b-2 rounded-b-sm border-black py-1 transition-all duration-300  "
                  : "pb-2"
              }
            >
              Dashboard
            </Link>
            <Link
              href={"/add-note"}
              className={
                `${currentPath}` === "/add-note"
                  ? "border-b-2 rounded-b-sm border-black py-1 transition-all duration-300  "
                  : "pb-2"
              }
            >
              Add-note
            </Link>

            <Link
              href={"/teams"}
              className={
                `${currentPath}` === "/teams"
                  ? "border-b-2 rounded-b-sm border-black py-1 transition-all duration-300"
                  : "pb-2"
              }
            >
              Team-Management
            </Link>
            {status === "unauthenticated" ? (
              <>
                <Link
                  href={"/login"}
                  className={
                    `${currentPath}` === "/login"
                      ? "border-b-2 rounded-b-sm border-black py-1 transition-all duration-300"
                      : "pb-2"
                  }
                >
                  Login
                </Link>
                <Link
                  href={"/register"}
                  className={
                    `${currentPath}` === "/register"
                      ? "border-b-2 rounded-b-sm border-black py-1 transition-all duration-300  "
                      : "pb-2"
                  }
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="hidden"></div>
            )}
          </ul>
        </div>

        {status === "unauthenticated" ? (
          <div className="hidden"></div>
        ) : (
          <div>
            <Link
              href={"/user-profile"}
              className={
                `${currentPath}` === "/user-profile"
                  ? "border-b-2 rounded-b-sm border-black py-1 transition-all duration-300  "
                  : "pb-2"
              }
            >
              Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
