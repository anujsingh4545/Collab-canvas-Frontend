import React, {useEffect, useState} from "react";
import Home from "./Pages/Home";
import {Route, Router, Routes} from "react-router-dom";
import DashBoard from "./Pages/DashBoard";
import toast, {Toaster} from "react-hot-toast";
import {verifyUser} from "./Common/VerifyUser";
import {useRecoilState} from "recoil";
import loadingUser from "./Recoil/LoadingUser";
import userAtom from "./Recoil/UserAtom";
import {removeFromSession} from "./Common/Session";
import recallApp from "./Recoil/RecallApp";

const App = ({socket}) => {
  const [loading, setLoading] = useRecoilState(loadingUser);
  const [user, setuser] = useRecoilState(userAtom);
  const [recall, setrecall] = useRecoilState(recallApp);

  useEffect(() => {
    setLoading(true);
    const getdata = async () => {
      const data = await verifyUser();
      if (data) {
        setuser(data);
        setLoading(false);
      } else {
        setuser(null);
        setLoading(false);
      }
    };
    getdata();
  }, [recall]);

  const logoutUser = () => {
    removeFromSession("CollabUser");
    setuser(null);
    setrecall(!recall);
    toast.success("Logged out successfully! 🤌🏼");
  };

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home logout={logoutUser} />} />
        <Route path="/:id" element={<DashBoard socket={socket} />} />
      </Routes>
    </>
  );
};

export default App;
