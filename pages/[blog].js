import React from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Slider from "@/components/container/slider";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import Container from "@/components/common/Container";
import BreadCrumb from "@/components/container/BreadCrumb";
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
  about_me,
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
          href={`${process.env.NEXT_PUBLIC_SITE_MANAGER}/images/${imagePath}/${logo?.file_name}`}
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
        imagePath={imagePath}
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
        about_me={about_me}
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
  
  const blogImageUrl = imagePath && my_blog?.file_name 
    ? `${imagePath}/${my_blog.file_name}`
    : '/placeholder.jpg';

  return (
    <Container className="py-6">
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 justify-between max-w-[1100px] mx-auto">
        <div className="col-span-2 flex flex-col gap-6">
          <Image
            src={blogImageUrl}
            title={my_blog?.value?.title}
            width={1500}
            height={1500}
            alt={my_blog?.value?.title || "Blog image"}
            priority
          />
          
          <div className="prose lg:prose-xl font-montserrat">
            {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
          </div>
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
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      <div ref={searchRef} className="px-4 py-3 flex items-center justify-between gap-2 border w-full border-gray-300 rounded-[4px]">
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
                href={`/${sanitizeUrl(item?.title)}`}
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
              title={category?.title}
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
                href={`/${sanitizeUrl(item?.title)}`}
                title={item?.title}
                className="min-w-[70px] h-[70px] aspect-square relative rounded-full overflow-hidden"
              >
                <Image
                  src={`${imagePath}/${item?.image}`}
                  title={item?.title}
                  alt={item.title}
                  height={1000}
                  width={1000}
                  className="object-cover aspect-square"
                />
              </Link>

              <Link
                href={`/${sanitizeUrl(item?.title)}`}
                title={item?.title}
              >
              <div className="flex flex-col">
                <h2 className="text-md leading-tight font-montserrat font-semibold line-clamp-2">
                  {item.title}
                </h2>
                <p className="text-gray-500 font-montserrat text-sm mt-1">
                  {item?.published_at}
                </p>
              </div>
              </Link>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, query }) {
  try {
    const domain = getDomain(req?.headers?.host);
    const { blog } = query;

    const blog_list = await callBackendApi({ domain, type: "blog_list" });
    
    const isValidBlog = blog_list?.data[0]?.value?.find(
      (item) => sanitizeUrl(item.title) === blog
    );

    if (!isValidBlog) {
      return { notFound: true };
    }

    const myblog = await callBackendApi({ 
      domain, 
      type: isValidBlog?.key 
    });

    const logo = await callBackendApi({ domain, type: "logo" });
    const project_id = logo?.data[0]?.project_id || null;
    
    let imagePath = '';
    try {
      imagePath = await getImagePath(project_id, domain);
    } catch (error) {
      console.error('Error getting image path:', error);
      imagePath = '/';
    }

    let layoutPages = await callBackendApi({
      domain,
      type: "layout",
    });

    const nav_type = await callBackendApi({ domain, type: "nav_type" });
    const categories = await callBackendApi({ domain, type: "categories" });
    const tag_list = await callBackendApi({ domain, type: "tag_list" });
    const favicon = await callBackendApi({ domain, type: "favicon" });
    const about_me = await callBackendApi({ domain, type: "about_me" });
    const contact_details = await callBackendApi({
      domain,
      type: "contact_details",
    });

    let page = null;
    if (Array.isArray(layoutPages?.data) && layoutPages.data.length > 0) {
      const valueData = layoutPages.data[0].value;
      page = valueData?.find((page) => page.page === "blog page");
    }

    if (!page?.enable) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        page,
        domain,
        imagePath,
        project_id,
        logo: logo?.data[0] || null,
        my_blog: myblog?.data[0] || null,
        about_me: about_me.data[0] || null,
        nav_type: nav_type?.data[0]?.value || {},
        tag_list: tag_list?.data[0]?.value || null,
        blog_list: blog_list.data[0]?.value || null,
        favicon: favicon?.data[0]?.file_name || null,
        categories: categories?.data[0]?.value || null,
        contact_details: contact_details?.data[0]?.value || null,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        error: 'Failed to load blog data',
        imagePath: '/',
        my_blog: null,
        blog_list: [],
        categories: [],
      }
    };
  }
}
