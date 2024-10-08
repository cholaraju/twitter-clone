import Image from "next/image";
import { useState } from "react";
// import localFont from "next/font/local";

// import { Inter } from "next/font/google";
import FeedCard from "@/components/FeedCard/index";
import { useCallback } from "react";
// import { graphql } from "@/gql";
import { useCurrentUser } from "@/hooks/user";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import Twitterlayout from "@/components/FeedCard/Layout/TwitterLayout";
import { BiImageAlt } from "react-icons/bi";
import { GetServerSideProps } from "next";
import { graphql } from "@/gql";
import { graphqlClient } from "@/clients/api";
import { getAllTweetsQuery } from "@/graphql/query/tweet";
//
// const geistSans = localFont(
// src: "./fonts/GeistVF.woff",
// variable: "--font-geist-sans",
// weight: "100 900",
// });
// const geistMono = localFont({
// src: "./fonts/GeistMonoVF.woff",
// variable: "--font-geist-mono",
// weight: "100 900",
// });
interface HomeProps {
  tweets?: Tweet[]
}


export default function Home(props: HomeProps ) {
  const { user } = useCurrentUser();
  const { mutate } = useCreateTweet();

  const [content, setContent] = useState("");

  // console.log(user);
  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, []);
  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
    });
  }, [content, mutate]);

  return (
    <div>
      <Twitterlayout>
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className=" w-full bg-transparent text-xl px-3 border-b border-slate-700"
                placeholder="What's happening?"
                rows={3}
              ></textarea>
              <div className="mt-2 flex justify-between items-center mb-4 mr-2">
                <BiImageAlt onClick={handleSelectImage} className="text-xl" />
                <button
                  onClick={handleCreateTweet}
                  className="bg-[#1d9bf0] font-semibold text-sm  px-2 py-1 rounded-xl  "
                >
                  Tweet
                </button>
              </div>
            </div>
          </div>
        </div>
        {props.tweets?.map((tweet) =>
          tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
        )}
      </Twitterlayout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps>  = async (context) => {
  const allTweets = await graphqlClient.request(getAllTweetsQuery);
  return {
    props: {
      tweets: allTweets.getAllTweets as Tweet[],
    },
  };
};
