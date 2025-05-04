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
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);
    const sliderRef = useRef(null);

    const minSwipeDistance = 50;

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setDragStartX(e.touches[0].clientX);
        setDragDistance(0);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const distance = dragStartX - currentX;
        setDragDistance(distance);

        // Prevent scrolling while dragging
        e.preventDefault();
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;

        const slideWidth = 100 / slidesToShow;
        const threshold = slideWidth / 3; // 1/3 of slide width

        if (Math.abs(dragDistance) > threshold) {
            if (dragDistance > 0 && currentSlide < filteredData.length - slidesToShow) {
                goToSlide(currentSlide + 1);
            } else if (dragDistance < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        } else {
            // If drag distance is less than threshold, snap back to current slide
            goToSlide(currentSlide);
        }

        setIsDragging(false);
        setDragDistance(0);
    };

    // Mouse event handlers for desktop
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStartX(e.clientX);
        setDragDistance(0);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        const currentX = e.clientX;
        const distance = dragStartX - currentX;
        setDragDistance(distance);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;

        const slideWidth = 100 / slidesToShow;
        const threshold = slideWidth / 3;

        if (Math.abs(dragDistance) > threshold) {
            if (dragDistance > 0 && currentSlide < filteredData.length - slidesToShow) {
                goToSlide(currentSlide + 1);
            } else if (dragDistance < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        } else {
            // If drag distance is less than threshold, snap back to current slide
            goToSlide(currentSlide);
        }

        setIsDragging(false);
        setDragDistance(0);
    };

    // Update slidesToShow based on window width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setSlidesToShow(1);
            } else if (window.innerWidth < 1024) {
                setSlidesToShow(2);
            } else {
                setSlidesToShow(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    useEffect(() => {
        const autoSlide = setInterval(() => {
            if (!isAnimating && !isDragging && filteredData.length > 0) {
                if (currentSlide < filteredData.length - slidesToShow) {
                    setCurrentSlide(prev => prev + 1);
                } else {
                    // Reset to first slide when reaching the end
                    setCurrentSlide(0);
                }
            }
        }, 5000);
        return () => clearInterval(autoSlide);
    }, [filteredData.length, slidesToShow, isAnimating, isDragging, currentSlide]);

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
                        className="flex transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing"
                        style={{
                            transform: `translateX(calc(-${currentSlide * (100 / slidesToShow)}% + ${-dragDistance}px))`,
                            // Prevent dragging beyond limits
                            touchAction: 'pan-y pinch-zoom',
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        {filteredData?.map((item, index) => (
                            <div 
                                key={index}
                                className={`min-w-full sm:min-w-[50%] lg:min-w-[33.333%] px-4 select-none`}
                            >
                                <div className="relative group overflow-hidden aspect-[4/5]">
                                    <Link
                                        title={item?.title}
                                        href={`/${sanitizeUrl(item?.title)}`}
                                        className="block"
                                    >
                                        <Image 
                                            priority
                                            src={`${imagePath}/${item?.image}`} 
                                            title={item?.title}
                                            alt={item.title} 
                                            width={1000}
                                            height={1000}
                                            className="object-cover transition-transform duration-500 aspect-[4/5] group-hover:scale-110" 
                                        />
                                    </Link>

                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="flex gap-2 text-sm text-white/90 mb-2">
                                                <span>{item?.published_at}</span>
                                                <span>•</span>
                                                <span>{item?.article_category}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                            <p className="text-white/80 text-sm mb-4 line-clamp-2">{item.description}</p>
                                            <Link
                                                title="Read More"
                                                href={`/${sanitizeUrl(item?.title)}`}
                                                className="bg-white text-black px-7 py-4 font-semibold hover:bg-primary hover:text-white transition-colors duration-300"
                                            >
                                                Read More
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

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
