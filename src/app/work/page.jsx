"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { BsArrowUpRight, BsGithub } from "react-icons/bs";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";
import Image from "next/image";
import WorkSliderBtns from "@/components/WorkSliderBtns";

const projects = [
  {
    num: "01",
    category: "Mobile Application Development",
    title: "Project 1",
    description:
      "Developed a mobile application using Kotlin and Jetpack Compose with Firebase and REST API integration. Implemented Firebase Authentication for user management, integrated native mobile features, and followed the MVVM architecture. Utilized Dagger Hilt for dependency injection and integrated TMDb API for movie data, enabling custom features like comments and likes via Firebase services",
    stack: [
      { name: "Kotlin" },
      { name: "Firebase" },
      {
        name: "TMDb API",
      },
    ],
    image: "/assets/work/thumb1.png",
    live: "https://ihuedu-my.sharepoint.com/:p:/g/personal/it185400_ihu365_gr/EfS_8bkLmplKj0hL2arFmqkBmbdJyeywYjTtE8ONxCqbNQ?e=wsUbQj",
    github: "",
  },
  {
    num: "02",
    category: "Mobile Application Development",
    title: "Project 2",
    description:
      "Developed a mobile application using Kotlin, integrating the Gemini API to deliver answers to any user query. The app provides real-time responses, ensuring a seamless user experience. Focused on intuitive design, API integration, and optimizing performance, the project demonstrates expertise in mobile development and API utilization.",
    stack: [{ name: "Kotlin" }, { name: "Gemini API" }],
    image: "/assets/work/thumb2.png",
    live: "https://ihuedu-my.sharepoint.com/:i:/g/personal/it185400_ihu365_gr/ET6R8MUB001Ls-rEMpGR5BYB6518jCNd_dpWWxlU5e5Syw?e=w6yevg",
    github: "",
  },
  {
    num: "03",
    category: "Web Development",
    title: "Project 3",
    description:
      "Developed a responsive hotel website using HTML and CSS, focusing on clean design and usability. The site effectively showcases the hotel's offerings while ensuring compatibility across various devices and browsers.",
    stack: [{ name: "Html 5" }, { name: "CSS 3" }],
    image: "/assets/work/thumb3.png",
    live: "https://users.it.teithe.gr/~it185400/Paradise/",
    github: "",
  },
];

const Work = () => {
  const [project, setProject] = useState(projects[0]);

  const handleSlideChange = (swiper) => {
    // Get current slide index
    const currentIndex = swiper.activeIndex;
    // Update project state based on current slide index
    setProject(projects[currentIndex]);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-[80vh] flex flex-col justify-center py-12 xl:px-0"
    >
      <div className="container mx-auto">
        {" "}
        {/* Add relative positioning here */}
        <div className="flex flex-col xl:flex-row xl:gap-[30px]">
          <div className="w-full xl:w-[50%] xl:h-[460px] flex flex-col xl:justify-between order-2 xl:order-none">
            <div className="flex flex-col gap-[30px] h-[50%]">
              {/* outline num */}
              <div className="text-8xl leading-none font-extrabold text-transparent text-outline">
                {project.num}
              </div>
              {/* project category */}
              <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500 capitalize">
                {project.category}
              </h2>
              {/* project description */}
              <p className="text-white/60">{project.description}</p>
              {/* stack */}
              <ul className="flex gap-4">
                {project.stack.map((item, index) => {
                  return (
                    <li key={index} className="text-xl text-accent">
                      {item.name}
                      {index !== project.stack.length - 1 && ","}
                    </li>
                  );
                })}
              </ul>
              {/* border */}
              <div className="border border-white/20"></div>
              {/* buttons */}
              <div className="flex items-center gap-4">
                {/* live project button */}
                <Link href={project.live} target="_blank">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group">
                        <BsArrowUpRight className="text-white text-3xl group-hover:text-accent"></BsArrowUpRight>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Live project</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full xl:w-[50%] relative">
            {" "}
            {/* Add relative here for slider */}
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              className="xl:h-[520px] mb-12"
              onSlideChange={handleSlideChange}
            >
              {projects.map((project, index) => {
                return (
                  <SwiperSlide key={index} className="w-full">
                    <div className="h-[460px] relative group flex justify-center items-center bg-pink-50/20">
                      {/* overlay */}
                      <div className="absolute top-0 bottom-0 w-full h-full bg-black/10 z-10"></div>
                      {/* image */}
                      <div className="relative w-full h-full">
                        <Image
                          src={project.image}
                          fill
                          className="object-cover"
                          alt="project image"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
              {/* slider buttons */}
              <WorkSliderBtns
                containerStyles="flex gap-2 absolute right-0 bottom-[calc(50%_-_22px)] xl:bottom-0 z-20 w-full justify-between xl:w-max xl:justify-none"
                btnStyles="bg-accent hover:bg-accent-hover text-primary text-[22px] w-[44px] h-[44px] flex justify-center items-center transition-all"
              />
            </Swiper>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Work;
