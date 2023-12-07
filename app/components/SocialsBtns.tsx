import React from "react";
import GoogleLogo from "../assets/GoogleLogo";
import FacebookLogo from "../assets/FacebookLogo";
import GithubLogo from "../assets/GithubLogo";

interface SocialsBtnsProps {
  mode: string;
}

const SocialsBtns: React.FC<SocialsBtnsProps> = ({ mode }) => {
  interface SocialBtn {
    socialsType: string;
    svgComp: JSX.Element;
    handler?: ([...args]: any[]) => void;
  }

  const withSocials: SocialBtn[] = [
    { socialsType: "Google", svgComp: <GoogleLogo /> },
    { socialsType: "Facebook", svgComp: <FacebookLogo /> },
    { socialsType: "Github", svgComp: <GithubLogo /> },
  ];

  return (
    <div className="w-full flex items-center justify-center py-5 gap-3">
      {withSocials.map((socialBtn: SocialBtn, index: number) => (
        <button
          type="button"
          key={index}
          className="btn btn-primary bg-white flex flex-grow items-center justify-center border-[0.05rem] border-md rounded-xl border-slate-400 px-5 py-3 transition-all hover:shadow-[0_0_2rem_-0.2rem_rgba(0,0,0,0.2)] hover:bg-white hover:border-slate-400 active:shadow-none">
          {socialBtn.svgComp}
        </button>
      ))}
    </div>
  );
};

export default SocialsBtns;
