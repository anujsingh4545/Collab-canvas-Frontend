import React, {useEffect, useState} from "react";
import SavedList from "./SavedList";
import axios from "axios";
import {useRecoilState} from "recoil";
import userAtom from "../../Recoil/UserAtom";
import {lookInSession} from "../../Common/Session";
import {FileEdit} from "lucide-react";

const SavedWork = () => {
  const [user, setuser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const getFiles = async () => {
      let userSession = lookInSession("CollabUser");

      setLoading(true);

      await axios
        .post(
          "http://localhost:3000/api/v1/user/getFile",
          {},
          {
            headers: {
              authorization: `Bearer ${userSession}`,
            },
          }
        )
        .then((response) => {
          if (response.data.success) {
            setuser(response.data.user);
            setLoading(false);
          }
        })
        .catch((e) => {
          setLoading(false);
        });
    };

    getFiles();
  }, [reload]);
  return (
    <div className=" my-10 px-10 ">
      <h2 className=" font-Rubik tracking-wider  text-[1.5rem] font-bold ">Saved Work</h2>

      {loading ? (
        <main className="grid grid-cols-5 gap-x-5 gap-y-5 mt-5">
          <section className=" w-full  rounded-md animate-pulse bg-black/10 h-40 "></section>
          <section className=" w-full  rounded-md animate-pulse bg-black/10 h-40 "></section>
          <section className=" w-full  rounded-md animate-pulse bg-black/10 h-40 "></section>
        </main>
      ) : (
        <section className=" grid grid-cols-5 gap-x-5 gap-y-5 mt-5 ">
          {user.saved.map((file) => (
            <SavedList key={file.id} id={file.id} name={file.name} IMGurl={file.Imageurl} Pageurl={file.pageUrl} time={file.time} setReload={setReload} reload={reload} />
          ))}
        </section>
      )}
    </div>
  );
};

export default SavedWork;
