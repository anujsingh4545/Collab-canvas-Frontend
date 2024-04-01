import axios from "axios";

import {X} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import toast from "react-hot-toast";
import userAtom from "../../Recoil/UserAtom";
import recallApp from "../../Recoil/RecallApp";

const SaveFile = ({image, setcallsave, WriteData, DrawData}) => {
  const [loading, setLoading] = useState(false);
  const FileName = useRef();
  const user = useRecoilValue(userAtom);
  const [recall, setrecall] = useRecoilState(recallApp);

  const saveFile = async () => {
    setLoading(true);

    if (FileName.current.value.length < 3) {
      toast.error("Please enter file name of length greater than 3 !🤌🏼");
      setLoading(false);
    } else {
      const url = window.location.href;
      const roomId = url.substring(url.lastIndexOf("/") + 1);

      const formData = new FormData();
      formData.append("name", FileName.current.value);
      formData.append("image", image);
      formData.append("userId", user._id);
      formData.append("url", url);
      formData.append("Id", roomId);
      formData.append("writeData", WriteData);
      formData.append("drawData", DrawData);

      await axios
        .post("http://localhost:3000/api/v1/room/saveFile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            setLoading(false);
            setcallsave(false);
            setrecall(!recall);
          } else {
            toast.error(response.data.message);
            setLoading(false);
          }
        })
        .catch((e) => {
          console.log(e);
          toast.error("Something went wrong!");
          setLoading(false);
        });
    }
  };

  return (
    <div className="  w-full h-screen fixed top-0 left-0 flex items-center justify-center z-40 ">
      <section className=" w-full h-screen fixed bg-black/40  top-0 left-0 " onClick={() => setcallsave(false)}></section>

      <section className=" w-[40%] h-fit bg-white z-40 rounded-md relative shadow-md p-5 ">
        <X size={20} className=" absolute top-2 right-2 cursor-pointer text-zinc-800 " onClick={() => setcallsave(false)} />
        <img src={image} alt="" />

        <input type="text" ref={FileName} className=" text-[0.7rem]  mt-3 border-[0.1px] outline-none w-full px-2 py-2 text-black border-zinc-400 " placeholder="Enter file name..." />

        {loading ? (
          <button className=" outline-none w-full mt-3 bg-gradient-to-tr from-orange-100 via-orange-700  to-orange-500 font-medium text-white  py-2  rounded-md cursor-wait ">Loading...</button>
        ) : (
          <button className=" outline-none w-full mt-3 bg-gradient-to-tr from-orange-100 via-orange-700  to-orange-500 font-medium text-white  py-2  rounded-md " onClick={saveFile}>
            Save File
          </button>
        )}
      </section>
    </div>
  );
};

export default SaveFile;
