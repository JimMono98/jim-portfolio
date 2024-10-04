"use client";

import { BsArrowDownRight } from "react-icons/bs";
import Link from "next/link";

const projects = [
    {
        num: "01",
        title: "Web Development",
        description: "Personal Website",
        href: "/"
    },
    {
        num: "02",
        title: "Mobile Application Development",
        description: "Movie Review Mobile App",
        href: "https://ihuedu-my.sharepoint.com/:p:/g/personal/it185400_ihu365_gr/EfS_8bkLmplKj0hL2arFmqkBmbdJyeywYjTtE8ONxCqbNQ?e=wsUbQj"
    },
    {
        num: "03",
        title: "Mobile Application Development",
        description: "Custom Python API Number Checker",
        href: "https://ihuedu-my.sharepoint.com/:i:/g/personal/it185400_ihu365_gr/EaiGUVKBLEJIu0_-fjmNsQgBa_y_4PHjalZIrKm6eDNvvQ?e=qpiaCu"
    },
    {
        num: "04",
        title: "Mobile Application Development",
        description: "Ai App",
        href: "https://ihuedu-my.sharepoint.com/:i:/g/personal/it185400_ihu365_gr/ET6R8MUB001Ls-rEMpGR5BYB6518jCNd_dpWWxlU5e5Syw?e=w6yevg"
    },
    {
        num: "05",
        title: "Graphics Programming",
        description: "Low-Poly 3D Room Scene Design",
        href: "https://ihuedu-my.sharepoint.com/:w:/g/personal/it185400_ihu365_gr/EdSmiC3hKL9AmnPv_B8SAeIBg-8NOZv5w5BVu-ZETG_YEQ?e=1bzGMY"
    },
    {
        num: "06",
        title: "Full-Stack Development",
        description: "Design and Implementation of a Restaurant Information System Using Java Swing and NetBeans IDE",
        href: "https://ihuedu-my.sharepoint.com/:b:/g/personal/it185400_ihu365_gr/ERGVPwNJLQpAt2bbJ4wzC7MB2WrlryYPFJBSHldFXm1t7Q?e=1yXq78"
    },
    {
        num: "07",
        title: "Full-Stack Development",
        description: "Design and Implementation of a Car Dealership Management System: A Database and a Java Application Development",
        href: "https://ihuedu-my.sharepoint.com/:b:/g/personal/it185400_ihu365_gr/EVkYFF0f7gJDtVHOsYkWgngBNuZwsttefGkXAlz6gmTrHQ?e=x4EVVt"
    },
    {
        num: "08",
        title: "Artificial Intelligence",
        description: "Decision Tree and SVM Classification/Regression Models: Comparison and Hyperparameter Exploration",
        href: "https://ihuedu-my.sharepoint.com/:f:/g/personal/it185400_ihu365_gr/ElZdZPGmrOdEtCW02ExZT3MBbIYGTWmhiUQsWud8mpDIKg?e=DvJAer"
    },
    {
        num: "09",
        title: "Full-Stack Development",
        description: "Design and Implementation of a Web API for the Battleship Game Using PHP, MySQL, and AJAX",
        href: "https://ihuedu-my.sharepoint.com/:i:/g/personal/it185400_ihu365_gr/EenSf0wVKeRAiv4KDcXf4doBd_BXFq-xXafMguqXu8ixsw?e=bXWlbq"
    },
    {
        num: "10",
        title: "Web Security",
        description: "Penetration Testing-SSTI: Medium Difficulty Challenge on HackTheBox (No-Threshold)",
        href: "https://ihuedu-my.sharepoint.com/:p:/g/personal/it185400_ihu365_gr/EZPv6bLIMVpKqGZjg7Jt17EB7IODLspAWo_hoJS8GrVPFA?e=PyY1Gi"
    },
    {
        num: "11",
        title: "Haptic Interfaces",
        description: "An Examination of the Vibration API: Integrating Tactile Feedback into Modern Mobile Web Applications",
        href: "https://ihuedu-my.sharepoint.com/:p:/g/personal/it185400_ihu365_gr/EaSEa3Tf1pVKqTN3Y1tqlaMBWH_wKmwdgcqfuYPG8Te0gg?e=HpVtK5"
    },
    {
        num: "12",
        title: "Internet of Things",
        description: "The Role of 5G Technology in Mitigating the Effects of COVID-19",
        href: "https://ihuedu-my.sharepoint.com/:w:/g/personal/it185400_ihu365_gr/EWXmtvrXHeNJgajw5vloW-sBNT8KJ9b16lE3z8UgHZ2AMQ?e=I1XPGc"
    },
    {
        num: "13",
        title: "Internet of Things",
        description: "The Implementation of 5G Technology in Enhancing Public Safety",
        href: "https://ihuedu-my.sharepoint.com/:w:/g/personal/it185400_ihu365_gr/EWhKw3qPUFNFlk21apOCFFMBZP2F3jWpIRBJX3jWaAYecQ?e=xdYfpn"
    },
    {
        num: "14",
        title: "Mobile Application Development",
        description: "Car Review Mobile App",
        href: "https://www.figma.com/design/juDBwXAcxce5gmwJVJbxcW/Figma-basics?node-id=1669-162202&m=dev&t=wpKGINVjCUV8TOvL-1"
    },
    {
        
        num: "15",
        title: "Software Engineering",
        description: "Smart Robot for Educational and Professional Environments",
        href: "https://ihuedu-my.sharepoint.com/:b:/g/personal/it185400_ihu365_gr/EWra4Gqf1tlAnfhXw16mRD4BvrdfZh8A-Ct1zNbw-UffqQ?e=EIQJkM"
    },
];

import { motion } from "framer-motion";

 

const Projects = () => {
    return (
    <section className="min-h-[80vh] flex flex-col justify-center py-12 xl:py-0">
        <div className="container mx-auto">          
            <motion.div 
                initial={{opacity: 0}} 
                animate={{
                    opacity: 1,
                    transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
            }} 
            className="grid grid-cols-1 md:grid-cols-2 gap-[60px]"
            >    
            {projects.map((projects, index) => {
                return (
                    <div key={index}
                    className="flex-1 flex flex-col justify-center gap-6 group"
                    >
                        {/* top */}
                        <div className="w-full flex justify-between items-center">
                            <div className="text-5xl font-extrabold text-outline text-transparent group-hover:text-outline-hover transition-all duration-500">
                                {projects.num}
                                </div>
                            <Link
                                href={projects.href}
                                target="_blank"
                                className="w-[70px] h-[70px] rounded-full bg-white group-hover:bg-accent transition-all duration-500 flex justify-center items-center hover:-rotate-45"
                            >
                                <BsArrowDownRight className="text-primary text-3xl"/>                            
                            </Link>
                        </div>
                        {/* title */}
                        <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500">
                            {projects.title}
                            </h2>
                        {/* description */}
                        <p className="text-white/60">{projects.description}</p>
                        {/*border*/}
                        <div className="border-b border-white/20 w-full"></div>
                    </div>
                );
            })}
            </motion.div>  
        </div>    
    </section>
    );
};

export default Projects;