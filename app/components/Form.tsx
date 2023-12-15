import React, { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

interface FormProps {
  mode: string;
  userNameRef: React.RefObject<HTMLInputElement>;
  emailRef: React.RefObject<HTMLInputElement>;
  pwdRef: React.RefObject<HTMLInputElement>;
  submitRef: React.RefObject<HTMLButtonElement>;
}

const Form: React.FC<FormProps> = ({
  mode,
  userNameRef,
  emailRef,
  pwdRef,
  submitRef,
}) => {
  interface FormInput {
    type: string;
    startIcon?: JSX.Element;
    endIcon?: any;
    handler?: ([...args]: any[]) => void;
  }

  const formInputs: FormInput[] = [
    {
      type: "username",
      startIcon: <FaUserAlt size={19} />,
    },
    {
      type: "email",
      startIcon: <MdEmail size={21} />,
    },
    {
      type: "password",
      startIcon: <FaLock size={19} />,
      endIcon: { on: <FaEyeSlash />, off: <FaEye /> },
    },
  ];

  const [pwdVis, setPwdVis] = useState<boolean>(false);

  return (
    <>
      {formInputs.map(
        (inp: FormInput, key: number) =>
          ((mode === "forgotpwd" &&
            inp.type !== "username" &&
            inp.type !== "password") ||
            (mode === "login" && inp.type !== "email") ||
            mode === "signup") && (
            <div
              key={key}
              className="relative flex flex-row bg-slate-100 text-slate-700 rounded-xl mt-5">
              <div className="w-max min-h-full flex items-center justify-center pl-4 pr-3">
                {inp.startIcon}
              </div>
              <input
                className="w-full bg-transparent outline-none pr-5 py-4"
                ref={
                  inp.type === "password"
                    ? pwdRef
                    : inp.type === "email"
                    ? emailRef
                    : userNameRef
                }
                type={
                  inp.type === "email"
                    ? "email"
                    : inp.type === "password" && !pwdVis
                    ? "password"
                    : "text"
                }
                placeholder={`Enter your ${
                  inp.type === "username" && mode === "login"
                    ? inp.type + " or email"
                    : inp.type
                }`}
                autoFocus={
                  ((mode === "login" || mode === "forgotpwd") &&
                    inp.type === "email") ||
                  (mode === "signup" && inp.type === "username")
                    ? true
                    : false
                }
                onKeyDown={
                  (e) =>
                    // {
                    e.key === "Enter"
                      ? mode === "signup" && inp.type === "username"
                        ? emailRef.current?.focus()
                        : (mode === "signup" && inp.type === "email") ||
                          (mode === "login" && inp.type === "username")
                        ? pwdRef.current?.focus()
                        : submitRef.current?.click()
                      : null

                  // if (e.key === "Enter") {
                  //   if (mode === "signup" && inp.type === "username")
                  //     emailRef.current?.focus();
                  //   else if (
                  //     (mode === "signup" && inp.type === "email") ||
                  //     (mode === "login" && inp.type === "username")
                  //   )
                  //     pwdRef.current?.focus();
                  //   else submitRef.current?.click();
                  // }
                  // }
                }
              />
              {inp.endIcon && (
                <div
                  className="w-max min-h-full flex items-center justify-center pr-5 cursor-pointer"
                  onClick={() => setPwdVis(!pwdVis)}>
                  {pwdVis ? inp.endIcon.on : inp.endIcon.off}
                </div>
              )}
            </div>
          )
      )}
    </>
  );
};

export default Form;
