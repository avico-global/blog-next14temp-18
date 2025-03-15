import Container from "@/components/common/Container";
import Navbar from "@/components/common/Navbar";
import Banner from "@/components/container/Banner";
import Image from "next/image";
import Footer from "@/components/common/Footer";
import Head from "next/head";
import Link from "next/link";
import GoogleTagManager from "@/lib/GoogleTagManager";
import {
  callBackendApi,
  getDomain,
  getImagePath,
  sanitizeUrl,
} from "@/lib/myFun";
export default function Home({
  logo,
  meta,
  domain,
  imagePath,
  favicon,
  categories,
  banner,
  project_id,
  blog_list,
  about_me,
}) {
  return (
    <div>
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
          href={`${imagePath}/${favicon}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${imagePath}/${favicon}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${imagePath}/${favicon}`}
        />
      </Head>
        <Navbar
          logo={logo}
          categories={categories}
          imagePath={imagePath}
          blog_list={blog_list}
          project_id={project_id}
        />

        <Banner
          data={banner?.value}
          image={`${imagePath}/${banner?.file_name}`}
        />

        <Container>
          <h1 className="pt-10 text-2xl md:text-5xl font-bold font-montserrat">
            Latest Articles
          </h1>
        </Container>
        <Cardtwocolumn
          data={blog_list}
          className={"sm:hidden"}
          imagePath={imagePath}
        />
        <Cardthreecolumn
          data={blog_list}
          className="hidden sm:block lg:hidden"
          imagePath={imagePath}
        />
        <Cardfourcolumn
          data={blog_list}
          className="hidden lg:block"
          imagePath={imagePath}
        />
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

function Cardtwocolumn({ data = [], className, imagePath }) {
  const datapart2 = Math.ceil(data.length / 2);

  const data1 = data.slice(0, datapart2);

  const data2 = data.slice(datapart2, data.length);

  return (
    <Container className={`my-8 ${className}`}>
      <div className="grid grid-cols-2 gap-4 md:gap-8">
        <div className="flex flex-col gap-8">
          {data1.map((item, index) => (
            <div key={index} className=" ">
              <Card1
                item={item}
                index={index}
                divider={3}
                imagePath={imagePath}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          {data2.map((item, index) => (
            <div key={index} className=" ">
              <Card1
                item={item}
                index={index}
                divider={1}
                imagePath={imagePath}
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

function Cardthreecolumn({ data = [], className, imagePath }) {
  // Fixed number of items per column (total items / 3)
  const itemsPerColumn = Math.ceil(data.length / 3); // This will be 8 for 24 items

  // Create columns with equal distribution
  const data1 = data.slice(0, itemsPerColumn); // 0 to 8
  const data2 = data.slice(itemsPerColumn, itemsPerColumn * 2); // 8 to 16
  const data3 = data.slice(itemsPerColumn * 2); // 16 to 24

  return (
    <Container className={`my-8 ${className}`}>
      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col gap-8">
          {data1.map((item, index) => (
            <div key={index}>
              <Card1
                item={item}
                index={index}
                divider={3}
                imagePath={imagePath}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          {data2.map((item, index) => (
            <div key={index}>
              <Card1
                item={item}
                index={index}
                divider={1}
                imagePath={imagePath}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          {data3.map((item, index) => (
            <div key={index}>
              <Card1
                item={item}
                index={index}
                divider={2}
                imagePath={imagePath}
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

function Cardfourcolumn({ data = [], className, imagePath }) {
  const datapart4 = Math.floor(data.length / 4); // Floor to avoid exceeding index

  const data1 = data.slice(0, datapart4);
  const data2 = data.slice(datapart4, datapart4 * 2);
  const data3 = data.slice(datapart4 * 2, datapart4 * 3);
  const data4 = data.slice(datapart4 * 3); // No need for end index, it will take remaining

  return (
    <Container className={`my-8 ${className}`}>
      <div className="grid grid-cols-4 gap-8">
        <div className="flex flex-col gap-8">
          {data1.map((item, index) => (
            <div key={index} className=" ">
              <Card1
                item={item}
                index={index}
                divider={3}
                imagePath={imagePath}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          {data2.map((item, index) => (
            <div key={index} className=" ">
              <Card1
                item={item}
                index={index}
                divider={1}
                imagePath={imagePath}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          {data3.map((item, index) => (
            <div key={index} className=" ">
              <Card1
                item={item}
                index={index}
                divider={2}
                imagePath={imagePath}
              />
            </div>
          ))}
        </div>
        <div className="flex  flex-col gap-8 ">
          {data4.map((item, index) => (
            <div key={index} className="bg-white ">
              <Card1
                item={item}
                index={index}
                divider={5}
                imagePath={imagePath}
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

function Card1({ item, index, imagePath }) {
  const hoverme = `relative text-xs md:text-base font-semibold transition-all duration-300 
    after:content-[''] after:absolute after:-bottom-[2px] after:left-0 cursor-pointer 
    after:w-0 after:h-[2px] after:bg-black 
    after:transition-all after:duration-300 
    hover:text-primary hover:after:w-full`;

  return (
    <>
      <div className="w-full h-full border-b-2 border-gray-200 pb-2">
        <div className="flex flex-col gap-[6px] items-start">
          <div className="w-full">
            <Image
              className="w-full h-full object-cover hover:opacity-85 transition-all duration-500"
              src={`${imagePath}/${item?.image}`}
              title={item?.title}
              alt={item.title}
              width={1000}
              height={1000}
            />
          </div>
          <div className="flex flex-row gap-2 pt-2 items-center w-full">
            <div className="text-gray-500 text-xs md:text-base hidden md:block">
              {item?.published_at}
            </div>
            <span className="text-gray-500 hidden md:block">/</span>
            <Link
              href={`/category/${sanitizeUrl(item?.article_category)}`}
              title={item?.article_category}
              className={hoverme}
            >
              {item?.article_category}
            </Link>
          </div>
          <h2 className="text-black text-sm md:text-lg font-semibold">
            {item.title}
          </h2>
          <p className="text-gray-500 py-1 text-sm md:text-base line-clamp-4">
            {item.description}
          </p>
          <div className="flex flex-row gap-2 items-center justify-between w-full">
            <Link
              title="Read More"
              href={`/${sanitizeUrl(item?.title)}`}
              className={hoverme}
            >
              Read More
            </Link>
            <div className="text-gray-500 text-xs md:text-base md:hidden">
              {item.published_at}
            </div>
          </div>
        </div>
      </div>
    </>
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
