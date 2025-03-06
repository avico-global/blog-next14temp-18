import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = ({ logo, imagePath, className }) => {
 
  const [hostName, setHostName] = useState("");
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostName(window.location.hostname);

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      handleResize();

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  if ((!logo || !logo.value)) {
    return null;
  }

  
  const {
    logoType,
    logoText,
    logoHeight,
    logoWidth,
    fontSize,
    isBold,
    isItalic,
  } = logo?.value;

  

  const imageSrc = `${imagePath}/${logo.file_name}`;

  const dynamicLogoHeight =
    windowWidth < 768
      ? 30
      : windowWidth < 1200
      ? Math.floor(logoHeight / 2)
      : logoHeight;

  const dynamicLogoWidth =
    windowWidth >= 1200
      ? logoWidth
      : Math.floor((logoWidth / logoHeight) * dynamicLogoHeight);

  const logoStyle = {
    height: `${dynamicLogoHeight}px`,
    width: windowWidth >= 1200 ? `${logoWidth}px` : "auto",
    maxWidth: "100%",
  };

  return (
    <Link
      title={`Logo - ${hostName}`}
      href="/"
      className={`flex items-center justify-center mr-10 ${className || ''}`}
    >
      {logoType === "image" ? (
        <Image
          height={dynamicLogoHeight}
          width={dynamicLogoWidth}
          src={imageSrc}
          title={`Logo - ${hostName}`}
          alt={`${logoText || "logo"} - ${hostName}`}
          sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 200px"
          style={logoStyle}
        />
      ) : logoType === "text" ? (
        <h2
          className="text-4xl font-extrabold py-1 whitespace-nowrap"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: isBold ? "bold" : "normal",
            fontStyle: isItalic ? "italic" : "normal",
          }}
        >
          {logoText}
        </h2>
      ) : null}
    </Link>
  );
};

export default Logo;