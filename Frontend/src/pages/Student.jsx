import React from "react";
import NavBar from "../components/NavBar";

const Student = () => {
  return (
    <div className=" min-h-screen bg-slate-50">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900">Student Dashboard</h2>
        <p className="mt-1 text-slate-500">View and manage your assignments</p>
      </main>
    </div>
  );
};

export default Student;
