import {BadgeInfoIcon} from "lucide-react";
import React, {useState} from "react";
import SavedWork from "../components/Home/SavedWork";

import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../Common/Firebase";
import {storeInSession} from "../Common/Session";
import {useRecoilState, useRecoilValue} from "recoil";
import userAtom from "../Recoil/UserAtom";
import loadingUser from "../Recoil/LoadingUser";

const Home = ({logout}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [user, setUser] = useRecoilState(userAtom);
  const userLoading = useRecoilValue(loadingUser);

  const createRoom = async () => {
    setLoading(true);
    await axios
      .post("http://localhost:3000/api/v1/room/createId", {})
      .then((response) => {
        if (response.data.success) {
          setLoading(false);
          navigate(`/${response.data.uid}`);
          toast.success("Room created successfully !🤌🏼");
        } else {
          setLoading(false);

          toast.error("Something went wrong !🥲");
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        toast.error("Something went wrong !🥲");
      });
  };

  const SocailLogin = async () => {
    setLoading1(true);
    let provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;

        if (user) {
          const userData = {
            name: user.displayName,
            email: user.email,
          };

          console.log(userData);

          await axios
            .post("http://localhost:3000/api/v1/user/login", userData)
            .then((response) => {
              if (response.data.success) {
                setUser(response.data.user);
                storeInSession("CollabUser", response.data.token);
                setLoading1(false);
                toast.success(response.data.message);
              } else {
                toast.error(response.data.message);
                setLoading1(false);
              }
            })
            .catch((e) => {
              toast.error("Something went wrong!");
              setLoading1(false);
            });
        }
      })
      .catch((e) => {
        setLoading1(false);
      });
  };

  return (
    <main>
      <div className=" w-full  h-screen grid grid-cols-2 ">
        <section className=" flex flex-col items-center justify-center  ">
          {/*  */}

          <div className=" w-fit border-0 border-black text-center ">
            <h1 className=" font-Rubik text-[3rem] font-semibold ">Collaborative Canvas</h1>
            <p className=" w-full text-right text-[1rem] text-orange-600 font-Nunito italic tracking-widest font-bold ">where ideas meet ink...</p>
          </div>

          <p className=" px-10 text-justify mt-10 font-Nunito italic text-[0.95rem]">
            Uniting Creative Minds in a Virtual Canvas" is a dynamic platform where individuals converge to co-create, sketch, and write in perfect harmony. It's a digital playground where collaborative creativity knows no bounds, allowing users to synchronize their artistic talents in real-time, fostering a seamless fusion of ideas and imagination.
          </p>

          <div className=" w-full items-center justify-center flex gap-x-5 mt-10 ">
            {userLoading ? (
              <main className="flex flex-col gap-y-2 w-[20rem] h-[70px] ">
                <section className=" bg-black/5 animate-pulse p-1 rounded-full "></section>
                <section className=" bg-black/5 animate-pulse p-1 rounded-full "></section>
              </main>
            ) : (
              <>
                {loading ? (
                  <button className=" px-11 py-3 border-[0.1px] border-orange-500 outline-none font-medium  cursor-wait ">Loading ...</button>
                ) : (
                  <button className=" px-10 py-3 border-[0.1px] border-orange-500 outline-none font-medium  " onClick={createRoom}>
                    Create a room
                  </button>
                )}
                {loading1 ? (
                  <button className=" px-11 bg-gradient-to-tr from-orange-100 via-orange-700  to-orange-500 font-medium text-white outline-none py-3 border-[0.1px] border-orange-300  cursor-wait ">Loading ...</button>
                ) : user && user._id ? (
                  <button className=" px-16 bg-gradient-to-tr from-orange-100 via-orange-700  to-orange-500 font-medium text-white outline-none py-3 border-[0.1px] border-orange-300 " onClick={logout}>
                    Logout
                  </button>
                ) : (
                  <button className=" px-16 bg-gradient-to-tr from-orange-100 via-orange-700  to-orange-500 font-medium text-white outline-none py-3 border-[0.1px] border-orange-300 " onClick={SocailLogin}>
                    Login
                  </button>
                )}
              </>
            )}
          </div>

          {userLoading ? (
            <main className=" mt-5 flex flex-col gap-y-2 w-[20rem] ">
              <section className=" bg-black/5 animate-pulse p-1 rounded-full "></section>
            </main>
          ) : (
            <p className=" px-8 tracking-wider italic text-[0.8rem] rounded-full py-2 bg-zinc-100 text-gray-500  mt-5 flex items-center justify-center gap-3 ">
              <BadgeInfoIcon size={15} className="  " />
              {user && user._id ? `Hello there ${user.name}! 🤌🏼` : " Save and view your last work by logging in..."}
            </p>
          )}

          {/*  */}
        </section>

        {/*  */}
        <section className=" w-full h-screen flex items-center justify-center  ">
          <img src="/1.png" alt="" className="  w-full  h-full " />
        </section>
      </div>

      {/*  */}

      {user && user.saved.length > 0 && <SavedWork />}

      {/*  */}
    </main>
  );
};

export default Home;
