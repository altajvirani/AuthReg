"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import SocialsBtns from "./SocialsBtns";
import Form from "./Form";
import { Toaster, toast } from "sonner";

const useHandleResize = () => {
  const [isWidthSmaller, setIsWidthSmaller] = useState<boolean>();
  useLayoutEffect(() => {
    const handleResize = () =>
      setIsWidthSmaller(window.innerWidth <= window.innerHeight ? true : false);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isWidthSmaller;
};

export default function AuthReg() {
  const isWidthSmaller = useHandleResize();

  const [mode, setMode] = useState<string>("login");

  const userNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);
  const rememberMeRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleRememberMe = () => {};

  interface PromiseResponse {
    success: boolean;
    message?: string;
  }

  const handleBasicAuth = async (
    usernameOrEmail: string,
    password: string
  ): Promise<PromiseResponse> => {
    return { success: true };
  };

  const handleBasicReg = async (
    username: string,
    email: string,
    password: string
  ): Promise<PromiseResponse> => {
    console.log(username, typeof username);
    try {
      const signupResponse = await fetch(
        "https://localhost:7169/api/Auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            username: username,
            password: password,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Server Response:", await signupResponse.text()); // Log the response text
      if (signupResponse.ok) {
        console.log("Account created.");
        return { success: true };
      } else {
        const errorData = await signupResponse.json();
        console.log("Failure: ", errorData);
        return {
          success: false,
          message: errorData.message || "Unknown error",
        };
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      return { success: false, message: "An error occurred during signup." };
    }
  };

  const handleForgotPwd = (email: string) => {};

  const createToast = (
    callback: (...args: any[]) => Promise<PromiseResponse>,
    params: any[],
    loadingMessage: string,
    successMessage: string,
    errorMessage: string
  ) => {
    toast.promise(callback(...params), {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    });
  };

  const handleSubmit = () => {
    const username = userNameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const password = pwdRef.current?.value.trim();
    let response: PromiseResponse;

    if (mode === "login" && username && password)
      createToast(
        handleBasicReg,
        [username, email, password],
        "Creating account, please wait...",
        "Welcome aboard!",
        "Failed to create your account, please try again."
      );
    // handleBasicAuth(username, password);
    else if (mode === "signup" && username && email && password) {
      createToast(
        handleBasicReg,
        [username, email, password],
        "Creating account, please wait...",
        "Welcome aboard!",
        "Failed to create your account, please try again."
      );
    } else if (mode === "forgotpwd" && email) handleForgotPwd(email);
  };

  const switchLoginSigup = () =>
    mode !== "forgotpwd"
      ? setMode((prevMode) => (prevMode === "login" ? "signup" : "login"))
      : setMode("forgotpwd");

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <form
        className={`${
          isWidthSmaller ? "w-full" : "w-[32rem]"
        } h-max flex flex-col px-5 py-4`}>
        <span className="font-extrabold text-2xl text-slate-800">
          {mode === "login"
            ? "Log in"
            : mode === "signup"
            ? "Sign up"
            : "Forgot Password?"}
        </span>
        <span
          className={`text-slate-500 ${mode === "forgotpwd" ? "mt-3" : ""}`}>
          {mode === "login"
            ? "Unlock the world with your credentials."
            : mode === "signup"
            ? "Create your account and start your journey today."
            : "Enter the email address you signed up with and wait for your recovery details to be sent."}
        </span>
        {mode !== "forgotpwd" && (
          <>
            <SocialsBtns mode={mode} />
            <div className="w-full flex items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-2 text-gray-500">Or</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
          </>
        )}
        <Form
          mode={mode}
          userNameRef={userNameRef}
          emailRef={emailRef}
          pwdRef={pwdRef}
          submitRef={submitRef}
        />
        {mode === "login" && (
          <div className="flex flex-row items-center justify-between mt-3">
            <label className="label cursor-pointer flex flex-row items-center justify-start gap-2 m-0 p-0">
              <input
                ref={rememberMeRef}
                type="checkbox"
                className="checkbox checkbox-sm rounded-md checked:border-none [--chkbg:theme(colors.green.500)]"
                onClick={handleRememberMe}
              />
              <span className="label-text w-max text-base text-slate-600">
                Remember me
              </span>
            </label>
            <span
              className="underline text-base text-slate-600 flex items-center transition-colors hover:text-blue-700 active:text-blue-700 cursor-pointer"
              onClick={() => setMode("forgotpwd")}>
              Forgot Password?
            </span>
          </div>
        )}
        <button
          ref={submitRef}
          // type="submit"
          type="button"
          className="btn btn-primary bg-green-500 border-none rounded-xl text-white mt-6 hover:bg-green-500"
          onClick={handleSubmit}>
          {mode === "login"
            ? "Log in"
            : mode === "signup"
            ? "Sign up"
            : "Submit"}
        </button>
        <Toaster richColors closeButton position="top-center" />
        <div className="flex flex-row items-center justify-between mt-3">
          <span className="w-max text-base text-slate-600">
            {mode === "login"
              ? "Not a member yet?"
              : mode === "signup"
              ? "Already a member?"
              : "Didn't get the code yet?"}
          </span>
          <span
            className="underline text-base text-slate-600 flex items-center transition-colors hover:text-blue-700 active:text-blue-700 cursor-pointer"
            onClick={() =>
              mode !== "forgotpwd"
                ? switchLoginSigup()
                : emailRef.current?.value.trim().length
                ? handleForgotPwd(emailRef.current?.value)
                : null
            }>
            {mode === "login"
              ? "Sign up"
              : mode === "signup"
              ? "Log in"
              : "Resend Code"}
          </span>
        </div>
      </form>
    </div>
  );
}
