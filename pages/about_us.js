import React from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Image from "next/image";
import banner from "@/public/images/about.png";
import Container from "@/components/common/Container";
import Head from "next/head";
import GoogleTagManager from "@/lib/GoogleTagManager";
import MarkdownIt from "markdown-it";
import { getDomain, getImagePath, callBackendApi } from "@/lib/myFun";
export default function about({
  logo,
  categories,
  imagePath,
  blog_list,
  about_me,
  project_id,
  meta,
  domain,
}) {
  const markdownIt = new MarkdownIt();
  const content = markdownIt?.render(about_me.value || "");
 

  return (
    <div className="\">
      <Head>
        <meta charSet="UTF-8" />
        <title>{meta?.title}</title>
        <meta name="description" content={meta?.description} />
        <link rel="author" href={`http://${domain}`} />
        <link rel="publisher" href={`http://${domain}`} />
        <link rel="canonical" href={`http://${domain}`} />
        <meta name="robots" content="noindex" />
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
          href={`${process.env.NEXT_PUBLIC_SITE_MANAGER}/images/${imagePath}/${logo.file_name}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${process.env.NEXT_PUBLIC_SITE_MANAGER}/images/${imagePath}/${logo.file_name}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${process.env.NEXT_PUBLIC_SITE_MANAGER}/images/${imagePath}/${logo.file_name}`}
        />
      </Head>
      <Navbar logo={logo} categories={categories} imagePath={imagePath}  blog_list={blog_list} project_id={project_id} />
      <Container className="flex flex-col py-24 pt-40 items-center justify-center ">
        <h2 className="text-6xl  text-center sm:text-9xl font-bold font-montserrat uppercase ">
          Clean & Simple
        </h2>
        <p className=" text-5xl font-montserrat text-center font-semibold py-12">
          About me and my blog
        </p>
        <div className="relative px-6 sm:px-0 w-full sm:w-[500px] sm:h-[500px] pt-12 rounded-full overfolw-hidden ">
          <Image
            src={`${imagePath}/${about_me?.file_name}`}
            alt="banner"
            width={10000}
            height={10000}
            priority
            className="rounded-full "
          />
        </div>

        <div className="text-4xl font-bold pt-20 font-montserrat uppercase">
          <div className="flex flex-col gap-6 max-w-[1100px] mx-auto ">
            <div className="prose lg:prose-xl text-start md:text-center ">
            <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        </div>
      </Container>
      <Footer
        logo={logo}
        categories={categories}
        imagePath={imagePath}
        blog_list={blog_list}
      />
    </div>
  );
}

export async function getServerSideProps({ req, query }) {
  const domain = getDomain(req?.headers?.host);
  const logo = await callBackendApi({ domain, tag: "logo" });
  const project_id = logo?.data[0]?.project_id || null;

  let layoutPages = await callBackendApi({
    domain,
    tag: "layout",
  });

  const meta = await callBackendApi({ domain, tag: "meta_about" });
  const favicon = await callBackendApi({ domain, tag: "favicon" });
  const imagePath = await getImagePath(project_id, domain);
  const categories = await callBackendApi({ domain, tag: "categories" });
  const banner = await callBackendApi({ domain, tag: "banner" });
  const blog_list = await callBackendApi({ domain, tag: "blog_list" });
  const about_me = await callBackendApi({ domain, query, tag: "about_me" });
  return {
    props: {
      logo: logo?.data?.[0] || null,
      project_id,
      meta: meta?.data[0]?.value || null,
      domain,
      imagePath,
      about_me: about_me?.data[0] || null,
      categories: categories?.data[0]?.value || [],
      favicon: favicon?.data?.[0]?.value || null,
      banner: banner?.data[0] || null,
      blog_list: blog_list?.data[0]?.value || [],
      meta: meta?.data[0]?.value || null,
      domain,
    },
  };
}
