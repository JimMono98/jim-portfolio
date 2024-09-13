"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { SiCheckmarx, SiCheckio } from "react-icons/si";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        service: "",
        message: ""
    });

    const [status, setStatus] = useState("");
    const [messageError, setMessageError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        if (e.target.name === "message") {
            const wordCount = e.target.value.split(/\s+/).filter(Boolean).length;
            if (wordCount < 20) {
                setMessageError("Your message must be at least 20 words long.");
            } else {
                setMessageError("");
            }
        }
    };

    const handleSelectChange = (value) => {
        setFormData(prevState => ({
            ...prevState,
            service: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate message length
        const wordCount = formData.message.split(/\s+/).filter(Boolean).length;
        if (wordCount < 20) {
            setMessageError("Your message must be at least 20 words long.");
            return;
        }

        setStatus("Sending...");

        try {
            const response = await fetch("/api/sendEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                // Handle HTTP errors
                const result = await response.json();
                setStatus(`Error: ${result.message || 'Failed to send message'}`);
                return;
            }

            // Handle successful response
            const result = await response.json();
            if (response.status === 200) {
                setStatus("Message sent successfully!");
                setFormData({
                    firstname: "",
                    lastname: "",
                    email: "",
                    phone: "",
                    service: "",
                    message: ""
                });
                setMessageError(""); // Clear any previous errors
            } else {
                setStatus(`Error: ${result.message}`);
            }
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    const info = [
        {
            icon: <SiCheckmarx />,
            title: "Available",
            description: "Daily from 10 AM to 8 PM",
        },
        {
            icon: <FaPhoneAlt />,
            title: "Phone",
            description: "(+30) 698 6610 660",
        },
        {
            icon: <FaEnvelope />,
            title: "Email",
            description: "Jimkaiolakala@gmail.com",
        },
        {
            icon: <FaMapMarkerAlt />,
            title: "Address",
            description: "Evosmos, Thessaloniki 56431",
        },
    ];

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
            }}
            className="py-6"
        >
            <div className="container mx-auto">
                <div className="flex flex-col xl:flex-row gap-[30px]">
                    {/* form */}
                    <div className="xl:w-[54%] order-2 xl:order-none">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl">
                            <h3 className="text-4xl text-accent">Let's work together</h3>
                            <p className="text-white/60">
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    type="text"
                                    name="firstname"
                                    placeholder="Firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                                <Input
                                    type="text"
                                    name="lastname"
                                    placeholder="Lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                                <Input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    pattern="\d{9,}" // at least 9 digits
                                    title="Phone number must be at least 9 digits long"
                                />
                            </div>
                            <Select
                                name="service"
                                value={formData.service}
                                onValueChange={handleSelectChange}
                                className="input"
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select a Service</SelectLabel>
                                        <SelectItem value="Web Development">Web Development</SelectItem>
                                        <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                                        <SelectItem value="Mobile Application">Mobile Application</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Textarea
                                name="message"
                                placeholder="Type your message here."
                                value={formData.message}
                                onChange={handleChange}
                                className="input h-[200px]"
                                required
                            />
                            {messageError && <p className="text-red-500">{messageError}</p>}
                            <Button type="submit" size="md" className="max-w-40">
                                Send message
                            </Button>
                            <p>{status}</p>
                        </form>
                    </div>
                    {/* info */}
                    <div className="flex-1 flex items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0">
                        <ul className="flex flex-col gap-10">
                            {info.map((item, index) => (
                                <li key={index} className="flex items-center gap-6">
                                    <div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-[#27272c] text-accent rounded-md flex items-center justify-center">
                                        <div className="text-[28px]">{item.icon}</div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white/60">{item.title}</p>
                                        <h3 className="text-xl">{item.description}</h3>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default Contact;
