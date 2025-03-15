import React from "react";
import Container from "../components/common/Container";
import Navbar from "../components/common/Navbar";
import FullContainer from "../components/common/FullContainer";
import Footer from "../components/common/Footer";
import Head from "next/head";
import GoogleTagManager from "@/lib/GoogleTagManager";

import {
  callBackendApi,
  getDomain,
  getImagePath,
  sanitizeUrl,
} from "@/lib/myFun";

export default function ContactUs({
  logo,
  categories,
  imagePath,
  blog_list,
  project_id,
  meta,
  domain,
  favicon,
  about_me,
}) {
  return (
    <FullContainer className="bg-secondarydark ">
      <Head>
        <meta charSet="UTF-8" />
        <title>{meta?.title}</title>
        <meta name="description" content={meta?.description} />
        <link rel="author" href={`https://www.${domain}`} />
        <link rel="publisher" href={`https://www.${domain}`} />
        <link rel="canonical" href={`https://www.${domain}`} />
        <meta name="theme-color" content="#008DE5" />
        <link rel="manifest" href="/manifest.json" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <GoogleTagManager />
        <meta
          name="google-site-verification"
          content="zbriSQArMtpCR3s5simGqO5aZTDqEZZi9qwinSrsRPk"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${process.env.NEXT_PUBLIC_SITE_MANAGER}/images/${imagePath}/${favicon}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${process.env.NEXT_PUBLIC_SITE_MANAGER}/images/${imagePath}/${favicon}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${process.env.NEXT_PUBLIC_SITE_MANAGER}/images/${imagePath}/${favicon}`}
        />
      </Head>
      <Navbar
        logo={logo}
        categories={categories}
        imagePath={imagePath}
        blog_list={blog_list}
        project_id={project_id}
      />
      <Container className="flex flex-col md:flex-row gap-10 text-black py-24 md:pt-36 max-w-[1200px]">
        <div className="w-full md:w-[40%] ">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-montserrat font-extrabold pb-8">
            Let’s get in touch today!
          </h1>
          <p className="text-gray-500">
            In vestibulum maximus lectus nec vestibulum. Donec porttitor, dui
            sit amet malesuada posuere, orci lectus porttitor nulla, interdum
            pellentesque nibh ex non erat.
          </p>
        </div>
        <div className="w-full md:w-[60%]  p-11 bg-primary shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded-2xl">
          <form className="flex flex-col gap-8 ">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="First Name"
                  className="w-full py-3 px-5 rounded-md  bg-secondarydark text-black focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Last Name"
                  className="w-full py-3 px-5 rounded-md bg-secondarydark text-black focus:outline-none"
                />
              </div>
            </div>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className="w-full py-3 px-5 rounded-md  bg-secondarydark text-black focus:outline-none"
              />
            </div>
            <div>
              <textarea
                id="message"
                name="message"
                placeholder="Message"
                className="w-full py-3 px-5 rounded-md bg-secondarydark text-black focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-secondarydark border text-white px-9 py-3 rounded-md w-fit"
            >
              Submit
            </button>
          </form>
        </div>
      </Container>
      <Footer
        logo={logo}
        categories={categories}
        imagePath={imagePath}
        blog_list={blog_list}
        about_me={about_me}
      />
    </FullContainer>
  );
}

export async function getServerSideProps({ req }) {
  const domain = getDomain(req?.headers?.host);

  let layoutPages = await callBackendApi({
    domain,
    type: "layout",
  });

  const meta = await callBackendApi({ domain, type: "meta_home" });
  const logo = await callBackendApi({ domain, type: "logo" });
  const favicon = await callBackendApi({ domain, type: "favicon" });
  const blog_list = await callBackendApi({ domain, type: "blog_list" });
  const categories = await callBackendApi({ domain, type: "categories" });

  const project_id = logo?.data[0]?.project_id || null;
  const about_me = await callBackendApi({ domain, type: "about_me" });
  const banner = await callBackendApi({ domain, type: "banner" });
  const imagePath = await getImagePath(project_id, domain);

  let page = null;
  if (Array.isArray(layoutPages?.data) && layoutPages.data.length > 0) {
    const valueData = layoutPages.data[0].value;
    page = valueData?.find((page) => page.page === "home");
  }

  if (!page?.enable) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      domain,
      imagePath,
      meta: meta?.data[0]?.value || null,
      favicon: favicon?.data[0]?.file_name || null,
      logo: logo?.data[0] || null,
      blog_list: blog_list?.data[0]?.value || [],
      categories: categories?.data[0]?.value || null,
      about_me: about_me?.data[0] || null,
      banner: banner?.data[0] || null,
      page,
    },
  };
}
