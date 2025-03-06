import FullContainer from "./FullContainer";
import Container from "./Container";
import Image from "next/image";
import {sanitizeUrl} from "../../lib/myFun"
import Link from "next/link";
import Logo from "./Logo";
export default function Footer({categories,logo,imagePath,blog_list}) {

  const hoverme = `relative text-md font-semibold transition-all duration-300 
  after:content-[''] after:absolute after:-bottom-[2px] after:left-0 cursor-pointer 
  after:w-0 after:h-[2px] after:bg-white 
  after:transition-all after:duration-300 
  hover:text-primary hover:after:w-full`
  const latestdata = blog_list.filter((item)=>item.published_at).sort((a,b)=>new Date(b.published_at)-new Date(a.published_at)).slice(0,3)

 
  return (
    <FullContainer className="bg-black py-10">
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 text-start  border-white/20 pb-10 gap-6 ">
        <div className="   md:col-span-2">
          <h2 className="text-white text-start flex text-2xl md:text-4xl uppercase font-bold font-montserrat pb-4">
           <Logo logo={logo} imagePath={imagePath} />
          </h2>
          <p className="text-white text-lg font-montserrat pb-8">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </p>
       
          <h2 className="text-white text-2xl font-bold font-montserrat pb-4">
            Quick Links
          </h2>
          <ul className="text-white text-lg flex flex-col gap-2 w-fit  font-montserrat">
            <Link href="/" className={hoverme}>Home</Link>
            <Link href="/about" className={hoverme}>About</Link>
            <Link href="/contact" className={hoverme}>Contact</Link>
          </ul>
        </div>
        <div className=" ">
          <h2 className="text-white text-2xl font-bold font-montserrat pb-4">
            Categories
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              {categories.map((category, index) => (
                <Link
                href={`/category/${sanitizeUrl(category?.title)}`}
                  key={index}
                  className="text-gray-500 hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer font-montserrat text-md border rounded-[4px] w-full px-4 py-3 border-gray-300 hover:border-white"
                >
                  {category?.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className=" ">
          <h2 className="text-white text-2xl font-bold font-montserrat pb-4">
            Most Popular Articles
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-8">
              {latestdata.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <Link href={`/${sanitizeUrl(item?.title)}`} className="min-w-[70px] h-[70px] aspect-square relative rounded-full overflow-hidden">
                    <Image
                      src={`${imagePath}/${item?.image}`}
                      alt={item.title}
                      width={1000}
                      height={1000}
                      className="object-cover aspect-square"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <h2 className="text-md text-gray-200 leading-tight font-montserrat font-semibold line-clamp-2">
                      {item?.tagline}
                    </h2>
                    <p className="text-gray-300 font-montserrat text-sm mt-1">
                      {item?.published_at}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div></div>
        </div>
      </Container>
    </FullContainer>
  );
}
