import React from "react";
import RegisterForm from "../components/RegisterForm";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
