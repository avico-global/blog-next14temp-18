import React, { useEffect } from "react";
import BreadCrumb from "@/components/container/BreadCrumb";
import JsonLd from "@/json/JsonLd";
import { useRouter } from "next/router";
import Container from "@/components/common/Container";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import GoogleTagManager from "@/lib/GoogleTagManager";
import MarkdownIt from "markdown-it";
import {
  callBackendApi,
  getDomain,
  getImagePath,
} from "@/lib/myFun";


import Head from "next/head";
import { Raleway } from "next/font/google";
const myFont = Raleway({
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"],
});

export default function PriavcyPolicy({
  categories,
  imagePath,
  favicon,
  policy,
  logo,
  meta,
  domain,
  about_me,
  blog_list
}) {
  const markdownIt = new MarkdownIt();
  const content = markdownIt.render(policy || "");
  const router = useRouter();
  const currentPath = router.pathname;

  useEffect(() => {
    if (currentPath.includes("%20") || currentPath.includes(" ")) {
      router.replace("/privacy-policy");
    }
  }, [currentPath, router]);

  return (
    <div
      className={`min-h-screen flex flex-col justify-between ${myFont.className}`}
    >
      <Head>
        <meta charSet="UTF-8" />
        <title>{meta?.title}</title>
        <meta name="description" content={meta?.description} />
        <link rel="author" href={`https://${domain}`} />
        <link rel="publisher" href={`https://${domain}`} />
        <link rel="canonical" href={`https://${domain}/privacy-policy`} />
        {/* <meta name="robots" content="noindex" /> */}
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

      <Navbar logo={logo} imagePath={imagePath} categories={categories} blog_list={blog_list} />

        <div className=" pt-28 " >
          <BreadCrumb />
        </div>

        <Container>
          <div
            className="prose max-w-full w-full my-12  "
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>

      <Footer
        categories={categories}
        imagePath={imagePath}
        logo={logo}
        about_me={about_me}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `https://${domain}/privacy-policy`,
              url: `https://${domain}/privacy-policy`,
              name: meta?.title,
              description: meta?.description,
              isPartOf: {
                "@id": `https://${domain}`,
              },
              inLanguage: "en-US",
            },
          ],
        }}
      />
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const domain = getDomain(req?.headers?.host);

  let layoutPages = await callBackendApi({
    domain,
    type: "layout",
  });

  const meta = await callBackendApi({ domain, type: "meta_privacy" });
  const logo = await callBackendApi({ domain, type: "logo" });
  const favicon = await callBackendApi({ domain, type: "favicon" });
  const blog_list = await callBackendApi({ domain, type: "blog_list" });
  const categories = await callBackendApi({
    domain,
    type: "categories",
  });
 
  const policy = await callBackendApi({ domain, type: "policy" });
  const about_me = await callBackendApi({
    domain,
    type: "about_me",
  });

  let page = null;
  if (Array.isArray(layoutPages?.data) && layoutPages.data.length > 0) {
    const valueData = layoutPages.data[0].value;
    page = valueData?.find((page) => page.page === "privacy policy");
  }

  if (!page?.enable) {
    return {
      notFound: true,
    };
  }

  let project_id = logo?.data[0]?.project_id || null;
  let imagePath = null;
  imagePath = await getImagePath(project_id, domain);

  return {
    props: {
      domain,
      imagePath,
      favicon: favicon?.data[0]?.file_name || null,
      logo: logo?.data[0] || null,
      blog_list: blog_list?.data[0]?.value || [],
      categories: categories?.data[0]?.value || null,
      meta: meta?.data[0]?.value || null,
      policy: policy?.data[0]?.value || "",
      about_me: about_me?.data[0] || null,
      page,
    },
  };
}
