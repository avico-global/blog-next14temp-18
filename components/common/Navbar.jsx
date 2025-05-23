import React, { useState, useEffect, useRef } from "react";
import Container from "./Container";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { sanitizeUrl } from "../../lib/myFun";
import Logo from "./Logo";
import { useRouter } from "next/router";

export default function Navbar({
  logo,
  categories,
  imagePath,
  blog_list,
  project_id,
}) {
  const router = useRouter();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Only handle scroll for screens larger than mobile
      if (window.innerWidth >= 768) {
        // 768px is Tailwind's 'md' breakpoint
        const currentScrollPos = window.scrollY;
        setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
        setPrevScrollPos(currentScrollPos);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [openSearch, setOpenSearch] = useState(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value) {
      setOpenSearch(true);
    }
  };

  const handleSearchToggle = () => {
    if (isOpen) {
      setSearchQuery("");
    }
  };

  const filteredBlogs = blog_list?.filter((item) =>
    item?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const hoverme = `relative text-md font-semibold transition-all duration-300 
  after:content-[''] after:absolute after:-bottom-[2px] after:left-0 cursor-pointer 
  after:w-0 after:h-[2px] after:bg-black 
  after:transition-all after:duration-300 
  hover:text-primary hover:after:w-full`;

  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setOpenSearch(false);
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle route change completion
  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setIsSidebarOpen(false);
      setOpenSearch(false);
      setSearchQuery("");
    };

    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <>
      <div
        className={`border-b border-gray-200 fixed top-0 left-0 right-0 bg-white z-40
          md:transition-transform md:duration-700 h-16 md:h-20
          ${visible ? "translate-y-0" : "md:-translate-y-full"}`}
      >
        <Container className="h-full">
          <div className="flex flex-row h-full justify-between items-center">
            <div className="text-2xl md:text-4xl text-black font-bold font-montserrat uppercase">
              <Logo logo={logo} imagePath={imagePath} />
            </div>
            <div className="flex flex-row gap-4 font-montserrat font-semibold text-md h-full items-center">
              <Link
                title="Home"
                className={`${hoverme} hidden md:block`}
                href="/"
              >
                Home
              </Link>
              <div
                onMouseEnter={toggleDropdown}
                onMouseLeave={toggleDropdown}
                className="h-full  flex items-center relative group"
              >
                <div
                  className={`relative text-md font-semibold transition-all duration-300 
                              after:content-[''] after:absolute after:-bottom-[2px] after:left-0 cursor-pointer 
                              after:w-0 after:h-[2px] after:bg-black 
                              after:transition-all after:duration-300 
                            group-hover:text-primary group-hover:after:w-full hidden md:block`}
                >
                  Category
                </div>
                <div className={`${isDropdownOpen ? "block" : "hidden"} `}>
                  <Dropdown categories={categories} />
                </div>
              </div>
              <Link
                title="About"
                className={`${hoverme} hidden md:block`}
                href="/about_us"
              >
                About
              </Link>
              <Link
                title="Contact"
                className={`${hoverme} hidden md:block`}
                href="/contact_us"
              >
                Contact
              </Link>

              <div ref={searchRef} className={`relative `}>
                <div
                  className={`absolute transition-all duration-300  right-24 top-8  whitespace-nowrap ${
                    isOpen ? "w-28 opacity-100" : "w-0 opacity-0 -z-10"
                  }`}
                >
                  <input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    type="text"
                    placeholder="Search"
                    className=" w-48 text-sm font-semibold border cursor-text  rounded-sm border-gray-300 outline-none py-0 px-2"
                  />
                </div>
                {openSearch && searchQuery && filteredBlogs?.length > 0 && (
                  <div className="absolute p-3 hidden md:block right-0 top-16 border-t-2 border-primary bg-white shadow-2xl mt-1 z-10 w-[calc(100vw-40px)] lg:w-[650px]">
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

                <button
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setSearchQuery("");
                  }}
                  className={`p-[6px] hidden md:block bg-primary rounded-full text-white hover:bg-primary/90 transition-colors ${
                    isOpen ? "-rotate-90" : ""
                  }`}
                >
                  <Search className="w-4 h-4 rotate-90" />
                </button>
              </div>

              <button
                onClick={toggleSidebar}
                className="p-[6px] bg-gray-400 hover:bg-primary rounded-full text-white transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-50 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-montserrat">Menu</h2>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            ref={searchRef}
            className="relative w-full mb-6"
          >
            <div className="flex items-center gap-2">
              <input
                value={searchQuery}
                onChange={handleSearchChange}
                type="text"
                placeholder="Search articles..."
                className="w-full text-sm font-semibold border border-gray-300 rounded-md outline-none py-2 px-3 focus:border-primary transition-colors"
              />
              <button
                onClick={handleSearchToggle}
                className="p-2 bg-primary rounded-md text-white hover:bg-primary/90 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            {openSearch && searchQuery && filteredBlogs?.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-[300px] overflow-y-auto">
                {filteredBlogs?.map((item, index) => (
                  <Link
                    title={item.title || "SearchQuery"}
                    key={index}
                    href={`/${sanitizeUrl(item?.title)}`}
                  >
                    <div className="p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                      <p className="text-sm font-medium text-gray-800">{item.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <h3 className="text-sm text-gray-400 uppercase">Navigation</h3>
              <nav className="flex flex-col gap-3">
                <Link
                  href="/"
                  title="Home"
                  className="hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about_us"
                  title="About"
                  className="hover:text-primary transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact_us"
                  title="Contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </nav>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm text-gray-400 uppercase">Categories</h3>
              <nav className="flex flex-col gap-3">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    title={category?.title}
                    href={`/category/${sanitizeUrl(category?.title)}`}
                    className="hover:text-primary transition-colors"
                  >
                    {category?.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Dropdown({ categories }) {
  const hoverme = `relative text-md font-semibold transition-all duration-300 
    after:content-[''] after:absolute after:-bottom-[2px] after:left-0 cursor-pointer 
    after:w-0 after:h-[2px] after:bg-black 
    after:transition-all after:duration-300 
    hover:text-primary hover:after:w-full`;

  return (
    <div className="absolute top-[75px] left-0 right-0  z-50">
      <div className="flex flex-col justify-between items-start gap-4 border-t-2 w-fit py-4 border-primary  px-4 bg-white">
        {categories.map((category, index) => (
          <div key={index} className={hoverme}>
            <Link
              className=" w-full"
              title={category?.title}
              href={`/category/${sanitizeUrl(category?.title)}`}
            >
              {category?.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileNavbar() {
  return (
    <div>
      <h1>MobileNavbar</h1>
    </div>
  );
}
