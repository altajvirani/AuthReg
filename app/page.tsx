/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import AuthReg from "./components/AuthReg";
import LocalStorageDemo from "./components/LocalStorageDemo";

export default function Home() {
  const initialRender = useRef(true);

  const [loginToken, setLoginToken] = useState<string | null>(null);
  const [saveLoginInfo, setSaveLoginInfo] = useState<boolean>(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      saveLoginInfo &&
      typeof localStorage !== "undefined"
    ) {
      const storedLoginToken = localStorage.getItem("loginToken");
      if (storedLoginToken) setLoginToken(JSON.parse(storedLoginToken));
      else setLoginToken(null);
    }
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (typeof window !== "undefined") {
      if (!saveLoginInfo && typeof sessionStorage !== "undefined")
        sessionStorage.setItem("loginToken", loginToken ?? "null");
      else if (saveLoginInfo && typeof localStorage !== "undefined")
        localStorage.setItem("loginToken", loginToken ?? "null");
    }
  }, [loginToken]);

  return (
    <main className="min-w-[100dvw] min-h-[100dvh]">
      {!initialRender.current &&
      typeof loginToken !== "undefined" &&
      loginToken &&
      loginToken.trim().length ? (
        <LocalStorageDemo setLoginToken={setLoginToken} />
      ) : (
        <AuthReg
          setLoginToken={setLoginToken}
          setSaveLoginInfo={setSaveLoginInfo}
        />
      )}
    </main>
  );
}
