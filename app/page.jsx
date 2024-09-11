"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Typed from "typed.js";
import { Button } from "@/components/ui/button";
import { FiDownload } from "react-icons/fi";

//components
import Social from "@/components/Social";
import Photo from "@/components/Photo";
import Stats from "@/components/Stats";

const Home = () => {
  const pathname = usePathname(); // Get the current path
  const [key, setKey] = useState(0); // Add a state to force reinitialization

  useEffect(() => {
    // When the home page is revisited, increment the key to force reinitialization
    if (pathname === "/") {
      setKey((prevKey) => prevKey + 1);
    }
  }, [pathname]);

  useEffect(() => {
    // Initialize Typed.js
    const typed = new Typed('.multiple-text', {
      strings: ["Software Engineer.", "Full-Stack Developer.", "Database Developer.", "Database Developer.", "Mobile Application Developer.", "UI/UX Developer.", "Graphics Programmer.", "Web Developer."],
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 1000,
      loop: true
    });

    // Clean up the Typed instance on component unmount
    return () => {
      typed.destroy();
    };
  }, [key]); // Add the 'key' as a dependency to reinitialize Typed.js when the key changes

  return (
    <section className="h-full">
      <div className="container mx-auto h-full">
        <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8 xl:pb-24">
          <div className="text-center xl:text-left order-2 xl:order-none">
            <span className="text-accent text-xl multiple-text"></span>
            <h1 className="h1 mb-6">
              Hello, I'm <br />
              <span className="text-accent">Jim Mono.</span> <br />
            </h1>
              <p className="max-w-[500px] mb-9 text-white/80">
                I am a passionate Software Engineer with a strong foundation in full-stack development, database systems, and UI/UX design. My diverse experience includes developing web and mobile applications, 3D graphics, and innovative IoT projects. 
              </p>
              {/* buttons and socials */}
            <div className="flex flex-col xl:flex-row items-center gap-8">
                <a 
                  href="/assets/face1.png"
                  download="face1.png"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="uppercase flex items-center gap-2"
                  >
                <span>Download CV</span>
                <FiDownload className="text-xl" />
              </Button>
            </a>
              <div className="mb-8 xl:mb-0">
                <Social
                  containerStyles="flex gap-6"
                  iconStyles="w-9 h-9 border border-accent rounded-full flex justify-center items-center text-accent text-base hover:bg-accent hover:text-primary hover:transition-all duration-500"
                />
              </div>
            </div>
          </div>
          {/* PHOTO */}
          <div className="order-1 xl:order-none mb-8 xl:mb-0">
            <Photo />
          </div>
        </div>
      </div>
      <Stats />
    </section>
  );
};

export default Home;
