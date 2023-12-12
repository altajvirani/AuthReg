/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

interface AuthRegProps {
  setLoginToken: Dispatch<SetStateAction<string>>;
}

const AuthReg: React.FC<AuthRegProps> = ({ setLoginToken }) => {
  // const initialRender = useRef(true);

  // const [loginToken, setLoginToken] = useState<string>("");

  // useEffect(() => {
  //   if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
  //     const storedLoginToken = localStorage.getItem("loginToken");
  //     setLoginToken(storedLoginToken ?? loginToken);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (initialRender.current) {
  //     initialRender.current = false;
  //     return;
  //   }
  //   if (typeof window !== "undefined" && typeof localStorage !== "undefined")
  //     localStorage.setItem("loginToken", loginToken);
  // }, [loginToken]);

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
    console.log(usernameOrEmail);
    return new Promise(async (resolve, reject) => {
      try {
        const loginResponse = await fetch(
          "https://localhost:7169/api/Auth/login",
          {
            method: "POST",
            body: JSON.stringify({
              username: usernameOrEmail,
              password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const responseText = await loginResponse.text();
        console.log("Raw Response Text:", responseText);
        if (loginResponse.ok) {
          setLoginToken(responseText);
          resolve({ success: true });
        } else
          reject({
            success: false,
            message: responseText || "Unknown error",
          });
      } catch (error) {
        reject({
          success: false,
          message: "Oops! Something went wrong, please try again.",
        });
      }
    });
  };

  const handleBasicReg = (
    username: string,
    email: string,
    password: string
  ): Promise<PromiseResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const signupResponse = await fetch(
          "https://localhost:7169/api/Auth/register",
          {
            method: "POST",
            body: JSON.stringify({
              username,
              password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const responseText = await signupResponse.text();
        console.log("Raw Response Text:", responseText);
        if (signupResponse.ok) resolve({ success: true });
        else
          reject({
            success: false,
            message: responseText || "Unknown error",
          });
      } catch (error) {
        reject({ success: false, message: "An error occurred during signup." });
      }
    });
  };

  const handleForgotPwd = (email: string): Promise<PromiseResponse> => {
    return new Promise((resolve, _) =>
      setTimeout(() => resolve({ success: true }), 3000)
    );
  };

  const createToast = (
    type: string,
    loadingMessage: string,
    message: string,
    errorMessage?: string,
    callback?: (...args: any[]) => Promise<PromiseResponse>,
    params?: any[]
  ) => {
    switch (type) {
      case "warning":
        toast.warning(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "promise":
        toast.promise(
          async () => {
            const response = await callback!(...params!);
            return response;
          },
          {
            loading: loadingMessage,
            success: (response: PromiseResponse) => {
              if (response.success) {
                return message;
              }
            },
            error: (error: Error & { message?: string }) => {
              return error.message || errorMessage;
            },
          }
        );
        break;
      default:
        toast(message);
    }
  };

  const handleSubmit = () => {
    const username = userNameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const password = pwdRef.current?.value.trim();

    if (mode === "login" && username && password)
      createToast(
        "promise",
        "Logging in, please wait...",
        "Welcome back!",
        "Failed to log in, please try again.",
        handleBasicAuth,
        [username, password]
      );
    else if (mode === "signup" && username && email && password) {
      createToast(
        "promise",
        "Creating account, please wait...",
        "Welcome aboard!",
        "Failed to create your account, please try again.",
        handleBasicReg,
        [username, email, password]
      );
    } else if (mode === "forgotpwd" && email) {
      createToast(
        "promise",
        "Sending password reset link on your email, please wait...",
        "Password reset link sent! Please check your email inbox.",
        "Failed to send OTP, please try again.",
        handleForgotPwd,
        [email]
      );
    }
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
};

export default AuthReg;
