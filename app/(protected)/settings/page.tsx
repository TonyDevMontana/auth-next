"use client";
import { signOut, useSession } from "next-auth/react";

const SettingsPage = () => {
  const session = useSession();

  return (
    <>
      <div>{JSON.stringify(session)}</div>
      <button
        onClick={() => {
          signOut();
        }}
        className='border bg-white rounded-lg p-10'
      >
        Sign out
      </button>
    </>
  );
};

export default SettingsPage;
