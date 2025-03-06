import React from "react";
import Image from "next/image";
export default function Banner({ image, data}) {
 
  return (
    <div className="bg-black relative h-[70vh] mt-6 overflow-hidden">
      <Image
        src={image}
        alt="banner"
        width={1000}
        height={1000}
        priority
        className="object-cover w-full h-full object-right-bottom opacity-70"
      />
      <div className="absolute top-0 left-0 right-0 bottom-0 z-10 text-white flex flex-col text-start  md:items-center md:text-center justify-center px-10 md:px-4">
        <h2 className=" text-4xl md:text-7xl font-bold pb-4">
          {data?.title}
        </h2>
        <h3 className=" text-lg">
          {data?.tagline}
        </h3>
      </div>
    </div>
  );
}
