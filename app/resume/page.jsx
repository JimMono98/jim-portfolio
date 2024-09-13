"use client";

import { FaHtml5, FaCss3, FaJs, FaReact, FaFigma, FaJava, FaPhp, FaPython } from "react-icons/fa"

import { SiTailwindcss, SiC, SiCplusplus, SiCsharp, SiBlender, SiApachenetbeanside, SiPostgresql, SiMysql, SiJquery, SiKotlin, SiMariadb, SiLinux, SiParrotsecurity, SiKalilinux, SiWireshark, SiCisco, SiVirtualbox, SiFilezilla, SiDocker, SiHackthebox, SiTryhackme, SiBurpsuite, SiFirebase, SiR, SiAndroidstudio} from "react-icons/si"

// about data
const about = {
    title: "About me",
    description: "I am a passionate Software Engineer with a strong foundation in full-stack development, database systems, and UI/UX design. My diverse experience includes developing web and mobile applications, 3D graphics, and innovative IoT projects.",
    info: [
        {
            fieldName: "Name",
            fieldValue: "Jim Mono."
        },
        {
            fieldName: "Phone",
            fieldValue: "(+30 6986610660)"
        },
        {
            fieldName: "Experience",
            fieldValue: "8+ Years"
        },
        {
            fieldName: "LinkedIn",
            fieldValue: "Dimitrios Monogenidis"
        },
        {
            fieldName: "Nationality",
            fieldValue: "Hellenic"
        },
        {
            fieldName: "Email",
            fieldValue: "jimkaiolakala@gmail.com"
        },
        {
            fieldName: "Freelance",
            fieldValue: "Available"
        },
        {
            fieldName: "Languages",
            fieldValue: "Greek, English, German"
        },
    ]
};

// experience data
const experience = {
    icon: "/assets/resume/badge.svg",
    title: "My experience",
    description: "I have a diverse background, combining hands-on experience in hospitality with a strong foundation in web development and software engineering. While working as a Human Resources Manager and Web Developer at Hotel Paradise Kriopigi, I enhanced both technical systems and team management. My time in hospitality roles at NAMMOS Mykonos and Villas Seaside Lounge has strengthened my adaptability and multitasking abilities.",
        items: [
        {
            company: "Hotel Paradise Kriopigi",
            position: "Human Resources Manager",
            duration: "Summer 2024",
        },
        {
            company: "Freelance",
            position: "Freelance Web Developer",
            duration: "2018 - 2024",
        },
        {
            company: "NAMMOS Mykonos",
            position: "Waiter",
            duration: "Summer 2018",
        },
        {
            company: "Villas Seaside",
            position: "Waiter",
            duration: "Summer 2017",
        },
        
    ]
};

// education data
const education = {
    icon: "/assets/resume/cap.svg",
    title: "My education",
    description: "I have pursued a Software Engineering degree at the International Hellenic University of Thessaloniki from 2018 to 2024, graduating with a strong grade of 8/10. My studies have provided me with a solid foundation in programming, system design, and emerging technologies. Before that, I earned my High School Diploma in 2016 with a grade of 16/20, along with a Communicator Level (B2) English Certificate in 2013.",
       items: [
        {
            institution: "DI.PA.E",
            degree: "Software Engineer",
            duration: "2018 - Present",
        },
        {
            institution: "General High School",
            degree: "High School Diploma",
            duration: "2013 - 2016",
        },
        {
            institution: "English Certificate",
            degree: "Communicator Level (B2)",
            duration: "2012",
        },  
    ]
};

// skills data
const skills = {
    title: "My skills",
    description: "I have developed some skillsets through my university education and self-learning in software engineering. These skills range from front-end development, including web design and user interface creation, to backend systems and database management. My knowledge in cybersecurity and 3D modeling further expands my technical capabilities. The icons reflect my proficiency, starting with my strongest skills",       
    skillList: [
        {
            icon: <FaJava />,
            name: "Java",
        },
        {
            icon: <SiKotlin />,
            name: "Kotlin",
        },
        {
            icon: <FaPython />,
            name: "Python",
        },
        {
            icon: <FaReact />,
            name: "React.js",
        },
        {
            icon: <SiAndroidstudio />,
            name: "Android Studio",
        },
        {
            icon: <SiC />,
            name: "C",
        },
        {
            icon: <SiCplusplus />,
            name: "C++",
        },
        {
            icon: <SiR />,
            name: "R",
        },
        {
            icon: <SiPostgresql />,
            name: "Postgresql",
        },
        {
            icon: <SiFirebase />,
            name: "Firebase",
        },
        {
            icon: <SiMysql />,
            name: "MySQL",
        },
        {
            icon: <SiMariadb />,
            name: "MariaDB",
        },
        {
            icon: <SiVirtualbox />,
            name: "Virtualbox",
        },
        {
            icon: <SiLinux />,
            name: "Linux",
        },
        {
            icon: <SiParrotsecurity />,
            name: "Parrot",
        },
        {
            icon: <SiKalilinux />,
            name: "Kali",
        },
        {
            icon: <SiHackthebox />,
            name: "HackTheBox",
        },
        {
            icon: <SiTryhackme />,
            name: "TryHackMe",
        },
        {
            icon: <SiBurpsuite />,
            name: "Burp Suite",
        },
        {
            icon: <SiDocker />,
            name: "Docker",
        },
        {
            icon: <SiApachenetbeanside />,
            name: "Netbeans IDE",
        },
        {
            icon: <FaPhp />,
            name: "PHP",
        },
        {
            icon: <SiJquery />,
            name: "jQuery",
        },
        {
            icon: <FaHtml5 />,
            name: "Html 5",
        },
        {
            icon: <FaCss3 />,
            name: "CSS 3",
        },
        {
            icon: <FaJs />,
            name: "Javascript",
        },
        {
            icon: <SiTailwindcss />,
            name: "Tailwind.css",
        },
        {
            icon: <SiFilezilla />,
            name: "Filezilla",
        },
        {
            icon: <SiWireshark />,
            name: "Wireshark",
        },
        {
            icon: <SiCisco />,
            name: "Cisco",
        },
        {
            icon: <FaFigma />,
            name: "Figma",
        },
        {
            icon: <SiBlender />,
            name: "Blender",
        },
    ],
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

const Resume = () => {
    return (
        <motion.div
            initial={{ opacity: 0}}
            animate={{
                opacity: 1,
                transition: { delay: 2.4, duration: 0.4, ease: "easeIn"},
            }}
            className="min-h-[80vh] items-center justify-center py-12 xl:py-0"
        >
            <div className="container mx-auto">
                <Tabs 
                    defaultValue="skills" 
                    className="flex flex-col xl:flex-row gap-[60px]"
                >
                    <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mxs-0 gap-6">
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="about">About me</TabsTrigger>
                    </TabsList>

                    {/* content */}
                    <div className="min-h-[70vh] w-full">
                            {/* skills */}
                            <TabsContent value="skills" className="w-full h-full">
                                <div className="flex flex-col gap-[30px]">
                                    <div className="flex flex-col gap-[30px] text-center xl:text-left">
                                        <h3 className="text-4xl font-bold">{skills.title}</h3>
                                        <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                                            {skills.description}
                                        </p>
                                    </div>
                                    <ScrollArea className="h-[430px]">
                                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:gap-[30px]">
                                            {skills.skillList.map((skill, index) => {
                                                return <li key={index}>
                                                    <TooltipProvider delayDuration={100}>
                                                        <Tooltip>
                                                            <TooltipTrigger className="w-full h-[150px] bg-[#232329] rounded-xl flex justify-center items-center group">
                                                                <div className="text-6xl group-hover:text-accent transition-all duration-300">{skill.icon}</div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="capitalize">{skill.name}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </li>;
                                            })}
                                        </ul>
                                    </ScrollArea>
                                </div>
                            </TabsContent>
                            {/* education */}
                            <TabsContent value="education" className="w-full">
                             <div className="flex flex-col gap-[30px] text-center xl:text-left">
                                    <h3 className="text-4xl font-bold">{education.title}</h3>
                                    <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                                        {education.description}
                                    </p>
                                    <ScrollArea className="h-[400px]">
                                        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                                            {education.items.map((item, index) => {
                                                return ( 
                                                <li key={index} className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1"
                                                >
                                                    <span className="text-accent">{item.duration}</span>
                                                    <h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">{item.degree}</h3>
                                                    <div className="flex items-center">
                                                        {/* dot */}
                                                        <span className="w-[6px] h-[6px] rounded-full bg-accent"></span>
                                                        <p className="text-white/60">{item.institution}</p>
                                                    </div>
                                                </li>
                                                )
                                            })}
                                        </ul>
                                    </ScrollArea>
                                </div>
                            </TabsContent>
                            {/* experience */}
                            <TabsContent value="experience" className="w-full">
                                <div className="flex flex-col gap-[30px] text-center xl:text-left">
                                    <h3 className="text-4xl font-bold">{experience.title}</h3>
                                    <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                                        {experience.description}
                                    </p>
                                    <ScrollArea className="h-[400px]">
                                        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                                            {experience.items.map((item, index) => {
                                                return ( 
                                                <li key={index} className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1"
                                                >
                                                    <span className="text-accent">{item.duration}</span>
                                                    <h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">{item.position}</h3>
                                                    <div className="flex items-center">
                                                        {/* dot */}
                                                        <span className="w-[6px] h-[6px] rounded-full bg-accent"></span>
                                                        <p className="text-white/60">{item.company}</p>
                                                    </div>
                                                </li>
                                                )
                                            })}
                                        </ul>
                                    </ScrollArea>
                                </div>
                            </TabsContent>
                             {/* about */}
                             <TabsContent 
                                value="about" 
                                className="w-full text-center xl:text-left"
                                >
                                    <div className="flex flex-col gap-[30px]">
                                        <h3 className="text-4xl font-bold">{about.title}</h3>
                                        <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                                        {about.description}
                                        </p>
                                        <ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0">
                                            {about.info.map((item, index) => {
                                                return (
                                                    <li key={index} className="flex items-center justify-center xl:justify-start gap-4">
                                                        <span className="text-white/60">{item.fieldName}:</span>
                                                        <span className="text-xl">{item.fieldValue}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                            </TabsContent>
                    </div>
                </Tabs>
            </div>
        </motion.div>
    );
};

export default Resume;