import React, { useState, useEffect, useRef } from 'react'
import Container from '../common/Container'
import Image from 'next/image'
import Link from 'next/link'
import { sanitizeUrl } from '@/lib/myFun'

export default function Slider({ blog_list, imagePath }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [slidesToShow, setSlidesToShow] = useState(3);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const sliderRef = useRef(null);

    // Minimum swipe distance (in px) 

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentSlide < filteredData.length - slidesToShow) {
            goToSlide(currentSlide + 1);
        }
        if (isRightSwipe && currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    };

    // Update slidesToShow based on window width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setSlidesToShow(1);  // sm: 1 slide
            } else if (window.innerWidth < 1024) {
                setSlidesToShow(2);  // md: 2 slides
            } else {
                setSlidesToShow(3);  // lg: 3 slides
            }
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Add safety check for blog_list
    const filteredData = blog_list?.slice(0, 6) || [];
    const totalDots = Math.ceil((filteredData.length || 0) / slidesToShow);

    const goToSlide = (index) => {
        if (!isAnimating) {
            setIsAnimating(true);
            setCurrentSlide(index);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [currentSlide]);

    // Update the auto slide useEffect with safety check
    useEffect(() => {
        const autoSlide = setInterval(() => {
            if (!isAnimating && filteredData.length > 0) {
                setCurrentSlide(prev => 
                    prev === filteredData.length - slidesToShow ? 0 : prev + 1
                );
            }
        }, 5000);

        return () => clearInterval(autoSlide);
    }, [filteredData.length, slidesToShow, isAnimating]);

    // Add a guard clause to prevent rendering if no data
    if (!filteredData.length) {
        return null;
    }

    return (
        <Container>
            <div className="relative py-10 max-w-[1140px] mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold font-montserrat mb-2">Featured Posts</h2>
                    <p className="text-gray-600">Discover our most popular stories</p>
                </div>

                <div className="relative overflow-hidden border-x border-gray-300">
                    <div 
                        ref={sliderRef}
                        className="flex transition-transform duration-500 ease-in-out touch-pan-y"
                        style={{
                            transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
                        }}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {filteredData?.map((item, index) => (
                            <div 
                                key={index}
                                className={`min-w-full sm:min-w-[50%] lg:min-w-[33.333%] px-4`}
                            >
                                <div className="relative group overflow-hidden aspect-[4/5]">
                                    <Image 
                                    priority
                                        src={`${imagePath}/${item?.image}`} 
                                        alt={item.title} 
                                        width={1000}
                                        height={1000}
                                        className="object-cover transition-transform duration-500 aspect-[4/5] group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="flex gap-2 text-sm text-white/90 mb-2">
                                                <span>{item?.published_at}</span>
                                                <span>•</span>
                                                <span>{item?.article_category}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                            <p className="text-white/80 text-sm mb-4 line-clamp-2">{item.description}</p>
                                            <Link href={`/${sanitizeUrl(item?.title)}`} alt={item.title} className="bg-white text-black px-7 py-4 font-semibold hover:bg-primary hover:text-white transition-colors duration-300">
                                                Read More
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Navigation */}
                <div className="flex justify-center gap-3 mt-6">
                    {[...Array(totalDots)]?.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index * slidesToShow)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                Math.floor(currentSlide / slidesToShow) === index 
                                    ? 'bg-primary scale-125' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </Container>
    )
}
