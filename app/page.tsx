/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import AuthReg from "./components/AuthReg";
import LocalStorageDemo from "./components/LocalStorageDemo";

export default function Home() {
  const initialRender = useRef(true);

  const [loginToken, setLoginToken] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const storedLoginToken = localStorage.getItem("loginToken");
      setLoginToken(storedLoginToken ?? loginToken);
    }
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (typeof window !== "undefined" && typeof localStorage !== "undefined")
      localStorage.setItem("loginToken", loginToken);
  }, [loginToken]);

  return (
    <main className="min-w-[100dvw] min-h-[100dvh]">
      {!initialRender.current &&
      typeof loginToken !== "undefined" &&
      loginToken.trim().length &&
      loginToken ? (
        <LocalStorageDemo setLoginToken={setLoginToken} />
      ) : (
        <AuthReg setLoginToken={setLoginToken} />
      )}
    </main>
  );
}
