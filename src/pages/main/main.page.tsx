import me from "@/assets/me.jpg";
import node from "@/assets/nodejs.png";
import python from "@/assets/python.png";
import react from "@/assets/react.png";
import { SkillCard } from "@/components/SkillCard";
import { Brain, Code, Monitor } from "@phosphor-icons/react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export const MainPage = () => {
  const { i18n } = useTranslation();
  return (
    <>
      <div className=" bg-neutral-800 px-8">
        <div className="flex flex-row max-w-6xl m-auto">
          <div className="flex flex-1 flex-col justify-between py-6">
            <section className="flex flex-col md:ml-auto w-80 gap-4">
              <span className="bg-green-400 w-fit p-1 rounded text-neutral-800">
                {i18n.t("commons.owner.title")}
              </span>
              <h1 className="font-tech text-4xl">
                {i18n.t("pages.main.talkIsCheap")}
              </h1>
              <p className="font-tech text-neutral-500">
                {i18n.t("pages.main.sinceTwelve")}
              </p>
              <a
                href="https://wa.me/5511950645574"
                className="mt-8 text-green-400 underline cursor-pointer font-tech"
              >
                {i18n.t("pages.main.letsChat")}
              </a>
            </section>
            <div className="flex flex-col sm:flex-row mt-32 space-y-8 sm:space-y-0 sm:space-x-10 font-tech">
              <article className="flex flex-row items-center">
                <span className="text-4xl mr-4 font-medium">{new Date().getFullYear() - new Date('01/01/2021').getFullYear()}</span>
                <p className="text-neutral-500">
                  {i18n.t("pages.main.yearsOf")}
                  <br />
                  {i18n.t("pages.main.experience")}
                </p>
              </article>
              <article className="flex flex-row items-center">
                <span className="text-4xl mr-4 font-medium">+30</span>
                <p className="text-neutral-500">
                  {i18n.t("pages.main.projects")}
                </p>
              </article>
            </div>
          </div>
          <div className="flex flex-1 relative items-center justify-center">
            <Image
              src={me}
              alt="Henrique"
              className="hidden md:flex z-10 rounded-full min-h-[300px] min-w-[300px]  lg:h-[500px] md:w-[500px] border-2 border-green-400 object-cover"
            />
            <div className="hidden orbit1 absolute lg:flex items-center justify-center h-24 w-24 z-30 bg-[#141414] rounded-full m-auto">
              <Image
                src={react}
                alt="React icon"
                className="flex h-[60%] w-fit"
              />
            </div>
            <div className="hidden orbit2 absolute lg:flex items-center justify-center h-24 w-24 z-30 bg-[#141414] rounded-full m-auto">
              <Image
                src={node}
                alt="Node Icon"
                className="rotate-[-120deg] h-[60%] w-fit"
              />
            </div>
            <div className="hidden orbit3 absolute lg:flex  items-center justify-center h-24 w-24 z-30 bg-[#141414] rounded-full m-auto">
              <Image
                src={python}
                alt="Python icon"
                className="rotate-[-240deg]  h-[60%] w-fit"
              />
            </div>
          </div>
        </div>
      </div>
      <main className="overflow-auto pt-40 flex flex-col">
        <div className="flex max-w-6xl m-auto px-8 xl:px-0 flex-col md:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <SkillCard
              name="Design Thinking"
              icon={<Brain />}
              description={i18n.t("pages.main.designThinkingDescription")}
            />
            <SkillCard
              name="Front-end"
              icon={<Monitor />}
              description={i18n.t("pages.main.frontEndDescription")}
            />
            <SkillCard
              name="Back-end"
              icon={<Code />}
              description={i18n.t("pages.main.backEndDescription")}
            />
          </div>
          <div className="flex flex-1 flex-col mt-20 md:mt-0 px-8 lg:px-32 space-y-8">
            <h5 className="font-tech text-neutral-500">
              {i18n.t("pages.main.shortAboutMe.title")}
            </h5>
            <h1 className="text-4xl font-medium font-tech">
              {i18n.t("pages.main.shortAboutMe.heading")}
            </h1>
            <h2 className="text-xl font-medium ">
              {i18n.t("pages.main.shortAboutMe.niceQuote")}
            </h2>
            <p className="font-tech text-neutral-500">
              {i18n.t("pages.main.shortAboutMe.description")}
            </p>
          </div>
        </div>
      </main>
    </>
  );
};
