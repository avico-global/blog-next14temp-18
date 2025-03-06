import React from "react";
import CategoryBanner from "@/components/container/CategoryBanner";
import banner from "@/public/images/catbanner.jpg";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Container from "@/components/common/Container";
import Image from "next/image";
import Slider from "@/components/container/slider";
import Link from "next/link";
import { useRouter } from "next/router";
import BreadCrumb from "@/components/container/BreadCrumb";
import Head from "next/head";
import GoogleTagManager from "@/lib/GoogleTagManager";
import {
  callBackendApi,
  getDomain,
  getImagePath,
  sanitizeUrl,
} from "@/lib/myFun";

export default function index({ logo, categories, imagePath, blog_list,project_id,meta,domain }) {
  return (
    <div>
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
      <Navbar logo={logo} categories={categories} imagePath={imagePath} blog_list={blog_list}  project_id={project_id} />
      <CategoryBanner
        data={categories}
        image={`${imagePath}/${banner?.file_name}`}
        imagePath={imagePath}
      />
      <BreadCrumb />
      <Cards blog_list={blog_list} imagePath={imagePath} />
      <div className=" mx-auto">
        <Slider blog_list={blog_list} imagePath={imagePath} />
      </div>
      <Footer
        logo={logo}
        categories={categories}
        imagePath={imagePath}
        blog_list={blog_list}
      />
    </div>
  );
}

function Cards({ blog_list, imagePath }) {
  const router = useRouter();
  const { categories } = router.query;
  const filteredData = blog_list.filter(
    (item) =>
      item.article_category.replace(/\s+/g, "-").toLowerCase() === categories
  );

  return (
    <div className="py-20 ">
      <Container>
        <div className="flex flex-col gap-4 max-w-[750px]  mx-auto ">
          {filteredData.map((item, index) => (
            <Card key={index} item={item} imagePath={imagePath} />
          ))}
        </div>
      </Container>
    </div>
  );
}

function Card({ item, imagePath }) {
  return (
    <div className="w-full h-full ">
      <div className="flex flex-col text-start md:text-center gap-2 py-8">
        <div className="text-primary underline text-base md:text-lg  font-semibold font-montserrat">
          {item?.article_category}
        </div>
        <div className="text-black font-semibold text-2xl md:text-3xl font-montserrat">
          {item?.title}
        </div>
        <div className="flex flex-row gap-2 pt-2 b md:items-center md:justify-center">
          <div className="text-black font-semibold text-xs md:text-base">
            {item?.published_at}
          </div>
          <span className="text-gray-600 font-semibold font-montserrat hidden md:block">
            /
          </span>
          <div className="text-gray-600 underline text-xs md:text-base font-semibold font-montserrat">
            {item?.author}
          </div>
        </div>
      </div>
      <div className="w-full aspect-[4/5] ">
        <Image
          src={`${imagePath}/${item?.image}`}
          alt={item.title}
          className="w-full h-full object-cover"
          width={1000}
          height={1000}
        />
      </div>
      <div className="    flex flex-col md:gap-4 gap-2 justify-center items-start py-4 ">
        <p className="text-gray-800 md:text-xl line-clamp-4">{item.tagline}</p>
        <Link
          href={`/${sanitizeUrl(
            item?.title
          )}`}
          className="text-black text-sm md:text-base bg-gray-200 font-semibold px-7 py-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-200 hover:bg-primary hover:text-white"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const domain = getDomain(req?.headers?.host);
  const logo = await callBackendApi({ domain, tag: "logo" });
  const project_id = logo?.data[0]?.project_id || null;

  let layoutPages = await callBackendApi({
    domain,
    tag: "layout",
  });

  const meta = await callBackendApi({ domain, tag: "meta_category" });
  const favicon = await callBackendApi({ domain, tag: "favicon" });
  const imagePath = await getImagePath(project_id, domain);
  const categories = await callBackendApi({ domain, tag: "categories" });
  const banner = await callBackendApi({ domain, tag: "banner" });
  const blog_list = await callBackendApi({ domain, tag: "blog_list" });

  return {
    props: {
      logo: logo?.data?.[0] || null,
      meta: meta?.data[0]?.value || null,
      domain,
      imagePath,
      project_id,
      categories: categories?.data[0]?.value || [],
      favicon: favicon?.data?.[0]?.value || null,
      banner: banner?.data[0] || null,
      blog_list: blog_list?.data[0]?.value || [],
    },
  };
}
