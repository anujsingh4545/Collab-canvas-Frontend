import axios from "axios";
import {lookInSession} from "./Session";

export const verifyUser = async () => {
  let userSession = lookInSession("CollabUser");

  if (!userSession) return null;

  try {
    const res = await axios.post(
      "https://collab-canvas-backend.vercel.app/api/v1/user/getuser",
      {},
      {
        headers: {
          authorization: `Bearer ${userSession}`,
        },
      }
    );

    if (res.data.success) {
      return res.data.user;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
