import React, {useEffect, useRef, useState} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const WriteSection = ({socket, getDataWrite, callWrite, databaseWrite}) => {
  const [text, setText] = useState(databaseWrite);
  const url = window.location.href;
  const roomId = url.substring(url.lastIndexOf("/") + 1) + "-write";

  useEffect(() => {
    const stringifiedData = JSON.stringify(text);
    getDataWrite(stringifiedData);
  }, [callWrite]);

  useEffect(() => {
    const joinRoom = (roomId) => {
      socket.emit("newUserWrite", roomId);
      socket.emit("joinRoom", roomId);
    };
    joinRoom(roomId);
  }, []);
  useEffect(() => {
    socket.on("text", (data) => {
      const parsedData = JSON.parse(data);
      setText(parsedData);
    });

    socket.on("requestDataWrite", () => {
      changeState();
    });
  }, [socket]);

  const changeState = () => {
    if (text) {
      const stringifiedData = JSON.stringify(text);
      const data = {
        roomId: roomId,
        text: stringifiedData,
      };
      socket.emit("text", data);
    }
  };

  return (
    <main className=" w-full h-screen ">
      <ReactQuill theme="snow" onChange={(e) => setText(e)} onKeyUp={changeState} value={text} className=" w-full  h-[calc(100vh-42px)] " />
    </main>
  );
};

export default WriteSection;
