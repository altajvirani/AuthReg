/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const useHandleResize = () => {
  const [isWidthSmaller, setIsWidthSmaller] = useState<boolean>();
  useLayoutEffect(() => {
    const checkWidth = () =>
      setIsWidthSmaller(window.innerWidth <= window.innerHeight);
    window.addEventListener("resize", checkWidth);
    checkWidth();
    return () => window.removeEventListener("resize", checkWidth);
  }, []);
  return isWidthSmaller;
};

export default function LocalStorageDemo() {
  const initialRender = useRef(true);
  const isWidthSmaller = useHandleResize();

  interface StudentData {
    id: number;
    name: string;
    rollNo: number;
  }

  const initialClassData: StudentData[] = [];
  const [classData, setClassData] = useState<StudentData[]>(initialClassData);

  const studentNameRef = useRef<HTMLInputElement>(null);
  const studentRollNoRef = useRef<HTMLInputElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const storedData = localStorage.getItem("classData");
      setClassData(storedData ? JSON.parse(storedData!) : initialClassData);
    }
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    typeof window !== "undefined" && typeof localStorage !== "undefined"
      ? localStorage.setItem("classData", JSON.stringify(classData))
      : null;
  }, [classData]);

  const addStudentData = () => {
    studentNameRef.current?.value.length &&
    studentRollNoRef.current?.value.length
      ? setClassData((prevClassData: any) => [
          ...prevClassData,
          {
            name: studentNameRef.current?.value,
            rollNo: studentRollNoRef.current?.valueAsNumber,
          },
        ])
      : null;
  };

  return (
    <div className="bg-slate-100 w-[100dvw] h-[100dvh] flex items-center justify-center p-8">
      <div
        className={`${
          isWidthSmaller ? "w-full h-full" : "max-w-[26rem] h-[30rem]"
        } sm:w-full md:w-[26rem] bg-slate-50  rounded-3xl border-[0.1rem] border-slate-300 p-5 flex flex-col flex-grow gap-4`}>
        <div className="w-full h-max flex gap-4 m-0 p-0">
          <input
            type="input"
            ref={studentNameRef}
            pattern="[^a-zA-Z\d\s:]"
            className="w-full outline-none bg-slate-100 text-slate-600 rounded-xl border-[0.1rem] border-slate-300 px-4 py-3"
            placeholder="Name"
            autoFocus
            required
            onKeyDown={(e) => {
              if (e.key === "Enter" && studentNameRef.current?.value.length)
                studentRollNoRef.current?.focus();
            }}
          />
          <input
            type="number"
            min={1}
            ref={studentRollNoRef}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full outline-none bg-slate-100 text-slate-600 rounded-xl border-[0.1rem] border-slate-300 px-4 py-3"
            placeholder="Roll No."
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Backspace") {
                if (e.key === "Enter") addBtnRef.current?.click();
                else if (!studentRollNoRef.current?.value.length)
                  studentNameRef.current?.focus();
                e.preventDefault();
              }
            }}
          />
        </div>
        <button
          ref={addBtnRef}
          className="px-4 py-3 bg-teal-600 hover:bg-teal-500 rounded-xl text-white font-semibold transition-colors"
          onClick={addStudentData}>
          Add Student
        </button>
        <div className="w-full h-full overflow-x-hidden overflow-y-auto flex flex-col gap-3">
          {classData.length > 0 &&
            classData.map((studentData: StudentData, key: number) => (
              <div
                key={key}
                className="w-full h-[3.5rem] bg-cyan-100 border-[0.1rem] border-sky-300 rounded-xl text-cyan-800 px-3 py-4 flex items-center gap-2">
                <span className="rounded-md bg-cyan-600 text-slate-100 w-6 h-6 flex items-center justify-center">
                  {studentData.rollNo}
                </span>
                <span className="font-semibold truncate break-words">
                  {studentData.name}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
