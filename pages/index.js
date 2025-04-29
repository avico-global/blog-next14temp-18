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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
          {blog_list.map((item, index) => (
            <Card1
              key={index}
              item={item}
              index={index}
              imagePath={imagePath}
            />
          ))}
        </div>
      </Container>

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

function Card1({ item, index, imagePath }) {
  const hoverme = `relative text-xs md:text-base font-semibold transition-all duration-300 
    after:content-[''] after:absolute after:-bottom-[2px] after:left-0 cursor-pointer 
    after:w-0 after:h-[2px] after:bg-black 
    after:transition-all after:duration-300 
    hover:text-primary hover:after:w-full`;

  return (
    <div className="w-full h-full border-b-2 border-gray-200 pb-2">
      <div className="flex flex-col gap-[6px] items-start">

      <Link
            title="Read More"
            href={`/${sanitizeUrl(item?.title)}`}
            className={hoverme}
          >
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
        </Link>
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
