import Image from "next/image";
// import localFont from "next/font/local";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { BiHomeCircle, BiHash, BiUser, BiMoney, BiImageAlt } from "react-icons/bi";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
// import { Inter } from "next/font/google";
import FeedCard from "@/components/FeedCard/index";
import { SlOptions } from "react-icons/sl";
import { useCallback } from "react";
import toast from "react-hot-toast";
// import { graphql } from "@/gql";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
//
// const geistSans = localFont({
// src: "./fonts/GeistVF.woff",
// variable: "--font-geist-sans",
// weight: "100 900",
// });
// const geistMono = localFont({
// src: "./fonts/GeistMonoVF.woff",
// variable: "--font-geist-mono",
// weight: "100 900",
// });

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}
const sidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />,
  },
  {
    title: "Explore",
    icon: <BiHash />,
  },
  {
    title: "Notifications",
    icon: <BsBell />,
  },
  {
    title: "Messages",
    icon: <BsEnvelope />,
  },
  {
    title: "Bookmarks",
    icon: <BsBookmark />,
  },
  {
    title: "TwitterBlue",
    icon: <BiMoney />,
  },
  {
    title: "profile",
    icon: <BiUser />,
  },
  {
    title: "More Options",
    icon: <SlOptions />,
  },
];

export default function Home() {
  const { user } = useCurrentUser();

  const queryClient = useQueryClient();
  console.log(user);
  const handleSelectImage = useCallback(()=> {
    const input = document.createElement('input');
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  
  },[]);
  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error(`Google token not found `);

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success("verifies Success");
      console.log(verifyGoogleToken);

      if (verifyGoogleToken)
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);

      // await queryClient.invalidateQueries(['current-user']);
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    [queryClient]
  );
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen  px-56 ">
        <div className="col-span-3 pt-1 px-4  mr-36 relative">
          <div className="text-2xl h-fit hover:bg-gray-800 rounded-full p-2 transition-all cursor-pointer w-fit ">
            <BsTwitter />
          </div>
          <div className="mt-1 text-xl font-semibold pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li
                  className="flex justify-start items-start gap-4 hover:bg-gray-800 rounded-full px-3 py-3 w-fit cursor-pointer mt-2"
                  key={item.title}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span>{item.title}</span>{" "}
                </li>
              ))}
            </ul>
            <div className="mt-5 px-3">
              <button className="bg-[#1d9bf0] font-semibold text-lg  px-10 py-2 rounded-full w-fit ">
                Tweet
              </button>
            </div>
          </div>
          {user && (
            <div className=" absolute bottom-5 flex gap-2 items-center bg-slate-800 px-5  py-2 rounded-full w-full">
              {user && user.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user?.profileImageURL}
                  alt="user-image"
                  height={50}
                  width={50}
                />
              )}
              <div>
                <h3 className="text-xl px-2 py-1 text-center text-xl">
                  {user.firstName}
                  {user.lastName}
                </h3>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-5 border-r-[1px]  border-l-[1px]  mt-4  h-screen overflow-scroll border-gray-600 ">
          <div>
            <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer ">
              {" "}
            </div>
            <div className="grid grid-cols-12 gap-3 ">
              <div className="col-span-1">
                {user?.profileImageURL && (
                  <Image
                    className="rounded-full"
                    src={user?.profileImageURL}
                    alt="user-image"
                    height={50}
                    width={50}
                  />
                )}
              </div>
              <div className="col-span-11 ">
                <textarea
                  className=" w-full bg-transparent text-xl px-3 border-b border-slate-700"
                  placeholder="What's happening?"
                  rows={3}
                ></textarea>
                <div className="mt-2 flex justify-between items-center mb-4 mr-2">
                <BiImageAlt onClick={handleSelectImage} className="text-xl"/>
                <button className="bg-[#1d9bf0] font-semibold text-sm  px-2 py-1 rounded-xl  ">
                Tweet
              </button>
                </div>
              </div>
            </div>
          </div>
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3 p-5 ">
          {!user && (
            <div className=" p-5 bg-slate-700 px-5 py-6 w-fit rounded-lg text-center">
              <h1 className="my-2 text-2xl">New to Twitter ?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
