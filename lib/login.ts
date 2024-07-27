"use client";
import { signIn } from "next-auth/react";

export const loginWithCredentials = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  return response;
};
