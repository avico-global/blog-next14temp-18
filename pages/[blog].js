import React from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Banner from "@/components/container/Banner";
import Slider from "@/components/container/slider";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import Container from "@/components/common/Container";
import BreadCrumb from "@/components/container/BreadCrumb";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import MarkdownIt from "markdown-it";
import {
  callBackendApi,
  getDomain,
  getImagePath,
  sanitizeUrl,
} from "@/lib/myFun";
import Head from "next/head";
import GoogleTagManager from "@/lib/GoogleTagManager";

export default function blog({
  categories,
  logo,
  imagePath,
  banner,
  blog_list,
  my_blog,
  meta,
  isValidBlog,
  project_id,
  categoryExists,
  domain,
}) {
  const markdownIt = new MarkdownIt();
  const content = markdownIt.render(
    my_blog?.value?.articleContent?.replaceAll(
      `https://api.sitebuilderz.com/images/project_images/${project_id}/`,
      imagePath
    ) || ""
  );

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <title>{my_blog?.value?.meta_title}</title>
        <meta name="description" content={my_blog?.value?.meta_description} />
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

      <Navbar
        logo={logo}
        categories={categories}
        project_id={project_id}
        blog_list={blog_list}
        imagePath="imagePath"
      />
      <BreadCrumb title="Blog" />
      <SingleBlog
        content={content}
        blog_list={blog_list}
        imagePath={imagePath}
        categories={categories}
        my_blog={my_blog}
        project_id={project_id}
      />
      <div>
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

function SingleBlog({
  blog_list,
  imagePath,
  categories,
  my_blog,
  content,
  project_id,
}) {
  const latestdata = blog_list?.slice(0, 6) || [];

  return (
    <Container className="py-6">
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 justify-between max-w-[1100px] mx-auto">
        <div className="col-span-2 flex flex-col gap-6">
          <Image
            src={`${imagePath}/${my_blog?.file_name}`}
            width={1500}
            height={1500}
            alt="banner"
            priority
          />
          <h1 className="prose lg:prose-xl font-montserrat ">
            {" "}
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </h1>
        </div>
        <div className="col-span-1 relative">
          <RightSidebar
            blog_list={blog_list}
            latestdata={latestdata}
            categories={categories}
            imagePath={imagePath}
            project_id={project_id}
          />
        </div>
      </div>
    </Container>
  );
}

function RightSidebar({
  latestdata,
  categories,
  imagePath,
  blog_list,
  project_id,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredBlogs = blog_list?.filter((item) =>
    item?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const hoverme = `relative text-md font-semibold transition-all duration-300 
after:content-[''] after:absolute after:-bottom-[2px] after:left-0 cursor-pointer 
after:w-0 after:h-[2px] after:bg-black 
after:transition-all after:duration-300 
hover:text-primary hover:after:w-full`;
  return (
    <div className="sticky top-24 flex flex-col gap-6 ">
      <div className="px-4 py-3 flex items-center justify-between gap-2 border w-full border-gray-300 rounded-[4px]">
        <input
          type="text"
          placeholder="Search..."
          className="outline-none border-none bg-transparent w-full"
          onChange={handleSearch}
          value={searchQuery}
        />
        <Search className="rotate-90 w-4 h-4" onClick={handleSearch} />
        {searchQuery && (
          <div className="absolute p-3 right-0 top-9 border-t-2 border-primary bg-white shadow-2xl mt-1 z-10 w-[calc(100vw-40px)] lg:w-[650px]">
            {filteredBlogs?.map((item, index) => (
              <Link
                title={item.title || "SearchQuery"}
                key={index}
                href={
                  project_id
                    ? `/{item.key}?${project_id}kkk`
                    : `/${sanitizeUrl(item?.title)}`
                }
              >
                <div className={`${hoverme} p-2 `}>{item.title}</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-md font-montserrat font-bold">About Me</h2>
        <div className="text-gray-500 font-montserrat text-md">
          Lorem ipsum dolor sit amet, consec tetuer adipiscing elit, sed diam
          nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-md font-montserrat font-bold">Categories</h2>
        <div className="flex flex-col gap-2">
          {categories?.map((category, index) => (
            <Link
              href={`/category/${sanitizeUrl(category?.title)}`}
              key={index}
              className="text-gray-500 hover:text-black hover:scale-105 transition-all duration-300 cursor-pointer font-montserrat text-md border rounded-[4px] w-full px-4 py-3 border-gray-300 hover:border-black"
            >
              {category?.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-md font-montserrat font-bold">Latest Posts</h2>
        <div className="flex flex-col gap-8">
          {latestdata.map((item, index) => (
            <div key={index} className="flex gap-4 items-center">
              <Link
                href={`/category/${sanitizeUrl(
                  item?.article_category
                )}/${sanitizeUrl(item?.title)}`}
                className="min-w-[70px] h-[70px] aspect-square relative rounded-full overflow-hidden"
              >
                <Image
                  src={`${imagePath}/${item?.image}`}
                  alt={item.title}
                  height={1000}
                  width={1000}
                  className="object-cover aspect-square"
                />
              </Link>
              <div className="flex flex-col">
                <h2 className="text-md leading-tight font-montserrat font-semibold line-clamp-2">
                  {item.title}
                </h2>
                <p className="text-gray-500 font-montserrat text-sm mt-1">
                  {item?.published_at}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, query }) {
  const domain = getDomain(req?.headers?.host);
  const { blog } = query;

  const categories = await callBackendApi({ domain, tag: "categories" });
  const blog_list = await callBackendApi({ domain, tag: "blog_list" });

  const isValidBlog = blog_list?.data[0]?.value?.find(
    (item) => sanitizeUrl(item.title) === sanitizeUrl(blog)
  );

  if (!isValidBlog) {
    return {
      notFound: true,
    };
  }

  const my_blog = await callBackendApi({ domain, tag: isValidBlog?.key });
  const meta = await callBackendApi({ domain, tag: "meta_blog" });
  const tag_list = await callBackendApi({ domain, tag: "tag_list" });
  const logo = await callBackendApi({ domain, tag: "logo" });
  const favicon = await callBackendApi({ domain, tag: "favicon" });
  const about_me = await callBackendApi({ domain, tag: "about_me" });
  const contact_details = await callBackendApi({
    domain,
    tag: "contact_details",
  });
  const layout = await callBackendApi({ domain, tag: "layout" });
  const nav_type = await callBackendApi({ domain, tag: "nav_type" });
  const blog_type = await callBackendApi({ domain, tag: "blog_type" });
  const footer_type = await callBackendApi({ domain, tag: "footer_type" });

  let project_id = logo?.data[0]?.project_id || null;
  let imagePath = await getImagePath(project_id, domain);

  return {
    props: {
      domain,
      imagePath,
      logo: logo?.data[0] || null,
      meta: meta?.data[0]?.value || null,
      my_blog: my_blog?.data[0] || {},
      layout: layout?.data[0]?.value || null,
      blog_list: blog_list.data[0]?.value || null,
      tag_list: tag_list?.data[0]?.value || null,
      categories: categories?.data[0]?.value || [],
      about_me: about_me.data[0] || null,
      contact_details: contact_details.data[0]?.value || null,
      favicon: favicon?.data[0]?.file_name || null,
      nav_type: nav_type?.data[0]?.value || {},
      blog_type: blog_type?.data[0]?.value || {},
      footer_type: footer_type?.data[0]?.value || {},
      project_id,
    },
  };
}
