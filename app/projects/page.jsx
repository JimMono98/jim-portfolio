"use client";

import { BsArrowDownRight } from "react-icons/bs";
import Link from "next/link";

const projects = [
    {
        num: "01",
        title: "Software Engineering",
        description: "Smart Robot for Educational and Professional Environments",
        href: ""
    },
    {
        num: "02",
        title: "Mobile Application Development",
        description: "Movie Review Mobile App",
        href: ""
    },
    {
        num: "03",
        title: "Mobile Application Development",
        description: "Custom Python API Number Checker",
        href: ""
    },
    {
        num: "04",
        title: "Mobile Application Development",
        description: "Ai App",
        href: ""
    },
    {
        num: "05",
        title: "Graphics Programming",
        description: "Low-Poly 3D Room Scene Design",
        href: ""
    },
    {
        num: "06",
        title: "Full-Stack Development",
        description: "Design and Implementation of a Restaurant Information System Using Java Swing and NetBeans IDE",
        href: ""
    },
    {
        num: "07",
        title: "Full-Stack Development",
        description: "Design and Implementation of a Car Dealership Management System: A Database and a Java Application Development",
        href: ""
    },
    {
        num: "08",
        title: "Artificial Intelligence",
        description: "Decision Tree and SVM Classification/Regression Models: Comparison and Hyperparameter Exploration",
        href: ""
    },
    {
        num: "09",
        title: "Full-Stack Development",
        description: "Design and Implementation of a Web API for the Battleship Game Using PHP, MySQL, and AJAX",
        href: ""
    },
    {
        num: "10",
        title: "Web Security",
        description: "Penetration Testing-SSTI: Medium Difficulty Challenge on HackTheBox (No-Threshold)",
        href: ""
    },
    {
        num: "11",
        title: "Haptic Interfaces",
        description: "An Examination of the Vibration API: Integrating Tactile Feedback into Modern Mobile Web Applications",
        href: ""
    },
    {
        num: "12",
        title: "Internet of Things",
        description: "The Role of 5G Technology in Mitigating the Effects of COVID-19",
        href: ""
    },
    {
        num: "13",
        title: "Internet of Things",
        description: "The Implementation of 5G Technology in Enhancing Public Safety",
        href: ""
    },
    {
        num: "14",
        title: "Web Developer",
        description: "Personal Website",
        href: ""
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