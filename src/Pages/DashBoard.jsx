import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "../components/Ui/Resizable";
import React, {useEffect, useRef, useState} from "react";
import {io} from "socket.io-client";

import WriteSection from "./WriteSection";
import Drawing from "./Drawing";
import {BookMarked, Home, Share} from "lucide-react";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";
import SaveFile from "../components/DashBoard/SaveFile";
import html2canvas from "html2canvas";
import {useRecoilState} from "recoil";
import {lookInSession} from "../Common/Session";
import axios from "axios";

const DashBoard = ({socket}) => {
  const [callsave, setcallsave] = useState(false);
  const [image, setImage] = useState(null);
  const [callWrite, setcallWrite] = useState(false);
  const [callDraw, setcallDraw] = useState(false);
  const [WriteData, setWriteData] = useState(null);
  const [DrawData, setDrawData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [databaseWrite, setDatabaseWrite] = useState(null);
  const [databaseDraw, setDatabaseDraw] = useState(null);

  useEffect(() => {
    const getPageData = async () => {
      setLoading(true);
      let userSession = lookInSession("CollabUser");
      const url = window.location.href;
      const roomId = url.substring(url.lastIndexOf("/") + 1);
      if (!userSession) {
        setLoading(false);
      } else {
        await axios
          .post(
            "http://localhost:3000/api/v1/room/getdata",
            {roomId: roomId},
            {
              headers: {
                authorization: `Bearer ${userSession}`,
              },
            }
          )
          .then((response) => {
            if (response.data.success) {
              const parsedWrite = JSON.parse(response.data.data.writeData);
              setDatabaseWrite(parsedWrite);
              const parsedDraw = JSON.parse(response.data.data.drawData);
              setDatabaseDraw(parsedDraw);
              setLoading(false);
              toast.success(response.data.message);
            } else {
              setLoading(false);
            }
          })
          .catch((e) => {
            console.log(e);
            setLoading(false);
            toast.error("Something went wrong!");
          });
      }
    };

    getPageData();
  }, []);

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Url copied to Clipboard! 🤌🏼");
      })
      .catch((error) => {
        toast.error("Something went wrong !🥲");
      });
  };

  const getDataWrite = async (data) => {
    if (data) {
      setWriteData(data);
    }
  };

  const getDataDraw = async (data) => {
    if (data) {
      setDrawData(data);
    }
  };

  const SaveBoxInitialStep = async () => {
    let imgData;
    await html2canvas(document.body).then((canvas) => {
      imgData = canvas.toDataURL("image/png");
      setImage(imgData);
    });

    setcallWrite(!callWrite);
    await getDataWrite();
    setcallDraw(!callDraw);
    await getDataDraw();

    setcallsave(true);
  };

  return loading ? (
    <></>
  ) : (
    <main className=" w-full h-full relative ">
      <div className=" absolute bottom-0 w-[3rem] h-fit rounded-tr-full bg-black flex flex-col items-center justify-start pb-5 pt-10 z-20 gap-y-6 text-zinc-400 ">
        <Link to="/">
          <Home size={20} className=" hover:text-zinc-100 cursor-pointer " />
        </Link>
        <BookMarked size={20} className=" hover:text-zinc-100 cursor-pointer" onClick={SaveBoxInitialStep} />

        {callsave && <SaveFile image={image} setcallsave={setcallsave} WriteData={WriteData} DrawData={DrawData} />}
        <Share size={20} onClick={copyToClipboard} className=" hover:text-zinc-100 cursor-pointer " />
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={45} className=" min-w-[350px]">
          <WriteSection socket={socket} getDataWrite={getDataWrite} callWrite={callWrite} databaseWrite={databaseWrite} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={55} className=" min-w-[500px]">
          <Drawing socket={socket} getDataDraw={getDataDraw} callDraw={callDraw} databaseDraw={databaseDraw} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};

export default DashBoard;
