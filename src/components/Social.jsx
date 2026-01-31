import Link from "next/link";

import {
  FaGithub,
  FaLinkedinIn,
  FaYoutube,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

const socials = [
  { icon: <FaGithub />, path: "https://github.com/JimMono98" },
  {
    icon: <FaLinkedinIn />,
    path: "https://www.linkedin.com/in/dimitrios-monogenidis-ba62b5216/",
  },
  { icon: <FaYoutube />, path: "https://www.youtube.com/@NikolxJim" },
  { icon: <FaFacebookF />, path: "https://www.facebook.com/SuperYoLoFTW/" },
  { icon: <FaInstagram />, path: "https://www.instagram.com/jim.mono/" },
];

const Social = ({ containerStyles, iconStyles }) => {
  return (
    <div className={containerStyles}>
      {socials.map((item, index) => {
        return (
          <Link
            key={index}
            href={item.path}
            target="_blank"
            className={iconStyles}
          >
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
};

export default Social;
