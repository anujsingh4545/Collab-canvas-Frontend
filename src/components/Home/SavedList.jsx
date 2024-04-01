import {lookInSession} from "../../Common/Session";
import axios from "axios";
import {Copy, X} from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const SavedList = ({id, name, IMGurl, Pageurl, time, setReload, reload}) => {
  const date = new Date(time);
  const formattedTime = date.toLocaleTimeString([], {hour: "numeric", minute: "2-digit", hour12: true});
  const formattedDate = date.toLocaleDateString([], {month: "numeric", day: "numeric", year: "numeric"});

  const copyToClipboard = () => {
    const url = Pageurl;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Url copied to Clipboard! 🤌🏼");
      })
      .catch((error) => {
        toast.error("Something went wrong !🥲");
      });
  };

  const navigatePage = () => {
    window.open(Pageurl, "_blank");
  };

  const deleteFile = async () => {
    let userSession = lookInSession("CollabUser");
    await axios
      .post(
        "http://localhost:3000/api/v1/user/deleteFile",
        {fileId: id},
        {
          headers: {
            authorization: `Bearer ${userSession}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setReload(!reload);
        }
      })
      .catch((e) => {
        toast.error("Something went wrong!");
      });
  };

  return (
    <main className="w-full  flex flex-col   border-[0.1px] rounded-md shadow-md  py-2 ">
      <section className=" flex justify-between items-center  px-2 gap-x-3  pb-1">
        <p className=" italic text-zinc-700 font-medium flex-1 text-[0.7rem] line-clamp-1 ">{name} </p>
        <X size={15} className=" cursor-pointer  text-zinc-500" onClick={deleteFile} />
      </section>
      <img src={IMGurl} alt="" className=" h-[7rem] w-full cursor-pointer" onClick={navigatePage} />

      <section className=" flex justify-between items-center  px-2 gap-x-3  pt-3">
        <p className="  text-zinc-400 font-medium flex-1 text-[0.6rem] line-clamp-1 ">
          {formattedTime} ~ {formattedDate}
        </p>
        <Copy size={15} className=" cursor-pointer  text-zinc-300 hover:text-zinc-400" onClick={copyToClipboard} />
      </section>
    </main>
  );
};

export default SavedList;
