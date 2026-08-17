"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { SiCheckmarx } from "react-icons/si";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialFormData = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

export default function ContactPageClient({ content }) {
  const formId = useId();
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState("");
  const [messageError, setMessageError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    if (event.target.name === "message") {
      const wordCount = event.target.value.split(/\s+/).filter(Boolean).length;

      if (wordCount < 20) {
        setMessageError(content.messageValidationMessage);
      } else {
        setMessageError("");
      }
    }
  };

  const handleSelectChange = (value) => {
    setFormData((previousFormData) => ({
      ...previousFormData,
      service: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const wordCount = formData.message.split(/\s+/).filter(Boolean).length;

    if (wordCount < 20) {
      setMessageError(content.messageValidationMessage);
      return;
    }

    setStatus(content.sendingMessage);

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setStatus(`Error: ${content.errorMessage}`);
        return;
      }

      setStatus(content.successMessage);
      setFormData(initialFormData);
      setMessageError("");
    } catch {
      setStatus(`Error: ${content.errorMessage}`);
    }
  };

  const info = [
    {
      key: "availability",
      icon: SiCheckmarx,
      ...content.availability,
    },
    {
      key: "phone",
      icon: FaPhoneAlt,
      ...content.phone,
    },
    {
      key: "email",
      icon: FaEnvelope,
      ...content.email,
    },
    {
      key: "location",
      icon: FaMapMarkerAlt,
      ...content.location,
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
          <div className="xl:w-[54%] order-2 xl:order-none">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl"
            >
              <h3 className="text-4xl text-accent">{content.heading}</h3>
              <p className="text-white/60">{content.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label
                  htmlFor={`${formId}-firstname`}
                  className="sr-only"
                >
                  {content.firstNameField.label}
                </label>
                <Input
                  id={`${formId}-firstname`}
                  type="text"
                  name="firstname"
                  placeholder={content.firstNameField.placeholder}
                  value={formData.firstname}
                  onChange={handleChange}
                  className="input"
                  required
                />
                <label
                  htmlFor={`${formId}-lastname`}
                  className="sr-only"
                >
                  {content.lastNameField.label}
                </label>
                <Input
                  id={`${formId}-lastname`}
                  type="text"
                  name="lastname"
                  placeholder={content.lastNameField.placeholder}
                  value={formData.lastname}
                  onChange={handleChange}
                  className="input"
                  required
                />
                <label htmlFor={`${formId}-email`} className="sr-only">
                  {content.emailField.label}
                </label>
                <Input
                  id={`${formId}-email`}
                  type="email"
                  name="email"
                  placeholder={content.emailField.placeholder}
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  required
                />
                <label htmlFor={`${formId}-phone`} className="sr-only">
                  {content.phoneField.label}
                </label>
                <Input
                  id={`${formId}-phone`}
                  type="text"
                  name="phone"
                  placeholder={content.phoneField.placeholder}
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                  required
                  pattern="\d{9,}"
                  title="Phone number must be at least 9 digits long"
                />
              </div>
              <label htmlFor={`${formId}-service`} className="sr-only">
                {content.serviceSelect.label}
              </label>
              <Select
                name="service"
                value={formData.service}
                onValueChange={handleSelectChange}
                className="input"
              >
                <SelectTrigger id={`${formId}-service`} className="w-full">
                  <SelectValue placeholder={content.serviceSelect.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{content.serviceSelect.label}</SelectLabel>
                    {content.serviceSelect.options.map((option) => (
                      <SelectItem key={option._key} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <label htmlFor={`${formId}-message`} className="sr-only">
                {content.messageField.label}
              </label>
              <Textarea
                id={`${formId}-message`}
                name="message"
                placeholder={content.messageField.placeholder}
                value={formData.message}
                onChange={handleChange}
                className="input h-[200px]"
                aria-invalid={Boolean(messageError)}
                aria-describedby={`${formId}-message-error`}
                required
              />
              <p
                id={`${formId}-message-error`}
                className="h-12 text-red-500 sm:h-8"
                role="alert"
                aria-live="polite"
              >
                {messageError}
              </p>
              <Button type="submit" size="md" className="max-w-40">
                {content.submitButtonText}
              </Button>
              <p
                className="h-6"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {status}
              </p>
            </form>
          </div>
          <div className="flex-1 flex items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0">
            <ul className="flex flex-col gap-10">
              {info.map(({ key, icon: Icon, label, value }) => (
                <li key={key} className="flex items-center gap-6">
                  <div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-[#27272c] text-accent rounded-md flex items-center justify-center">
                    <Icon className="text-[28px]" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60">{label}</p>
                    <h3 className="text-xl">{value}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
