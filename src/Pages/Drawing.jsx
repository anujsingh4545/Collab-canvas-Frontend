import {Excalidraw} from "@excalidraw/excalidraw";
import React, {useEffect, useState} from "react";

const Drawing = ({socket, getDataDraw, callDraw, databaseDraw}) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const url = window.location.href;
  const roomId = url.substring(url.lastIndexOf("/") + 1) + "-draw";
  let prev = null;

  useEffect(() => {
    if (excalidrawAPI) {
      const {collaborators, activeTool, frameRendering, scrollX, scrollY, width, zoom, offsetLeft, offsetTop, height, ...updatedAppState} = excalidrawAPI.getAppState();

      const stringifiedData = JSON.stringify({elements: excalidrawAPI.getSceneElements(), appState: updatedAppState});
      getDataDraw(stringifiedData);
    }
  }, [callDraw]);

  useEffect(() => {
    const joinRoom = (roomId) => {
      socket.emit("joinRoom", roomId);
      socket.emit("newUserDraw", roomId);
    };

    joinRoom(roomId);
  }, []);

  useEffect(() => {
    socket.on("element", (data) => {
      const parsedData = JSON.parse(data);
      if (excalidrawAPI) {
        excalidrawAPI.updateScene({
          elements: parsedData.elements,
          appState: parsedData.appState,
        });
      }
    });

    socket.on("requestDataDraw", () => {
      changeState();
    });
  }, [socket, excalidrawAPI]);

  const changeData = (e) => {
    if (!prev && e.button == "up") {
    } else {
      prev = e.button;

      const {collaborators, activeTool, frameRendering, scrollX, scrollY, width, zoom, offsetLeft, offsetTop, height, ...updatedAppState} = excalidrawAPI.getAppState();

      const stringifiedData = JSON.stringify({elements: excalidrawAPI.getSceneElements(), appState: updatedAppState});
      const data = {
        roomId: roomId,
        drawing: stringifiedData,
      };

      socket.emit("element", data);
    }
  };
  const changeState = () => {
    if (excalidrawAPI && excalidrawAPI.getAppState()) {
      const {collaborators, activeTool, frameRendering, scrollX, scrollY, width, zoom, offsetLeft, offsetTop, height, ...updatedAppState} = excalidrawAPI.getAppState();

      const stringifiedData = JSON.stringify({elements: excalidrawAPI.getSceneElements(), appState: updatedAppState});
      const data = {
        roomId: roomId,
        drawing: stringifiedData,
      };

      socket.emit("element", data);
    }
  };
  return (
    <div className=" w-full h-screen ">
      <Excalidraw theme="dark" initialData={databaseDraw} excalidrawAPI={(api) => setExcalidrawAPI(api)} onPointerUpdate={changeData} />
    </div>
  );
};

export default Drawing;
