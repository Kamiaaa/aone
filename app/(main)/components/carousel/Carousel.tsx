'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Carousel.module.css';

export default function Carousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentImageCycle, setCurrentImageCycle] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isImageCycling, setIsImageCycling] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [imageTransitionState, setImageTransitionState] = useState<'idle' | 'switching'>('idle');
    const [nextImages, setNextImages] = useState<any>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const imageCycleCountRef = useRef(0);
    const slideRotationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Check for mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Different image sets for each slide - Updated for ISP services
    const slides = [
        {
            id: 1,
            title: "Lightning Fast",
            subtitle: "Fiber Optic Internet",
            buttonText: "View Plans",
            buttonLink: "/packages",
            gradient: "from-blue-600/20 to-cyan-600/20",
            pattern: "dots",
            items: [
                {
                    id: 'slide1-item1',
                    name: 'Fiber Router Installation',
                    image: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    color: 'border-blue-500',
                    category: 'Home Internet'
                },
                {
                    id: 'slide1-item2',
                    name: 'Network Cabinet Setup',
                    image: "https://images.unsplash.com/photo-1758524942401-f88d27bb949a?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    color: 'border-green-500',
                    category: 'Infrastructure'
                },
                {
                    id: 'slide1-item3',
                    name: 'ONT Device',
                    image: "https://images.unsplash.com/photo-1645725677294-ed0843b97d5c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    color: 'border-purple-500',
                    category: 'Equipment'
                }
            ]
        },
        {
            id: 2,
            title: "Bangladesh's Most",
            subtitle: "Trusted ISP Provider",
            buttonText: "Explore Packages",
            buttonLink: "/packages",
            gradient: "from-red-600/20 to-orange-600/20",
            pattern: "waves",
            items: [
                {
                    id: 'slide2-item1',
                    name: '24/7 Customer Support Center',
                    image: "https://images.unsplash.com/photo-1516044734145-07ca8eef8731?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    color: 'border-red-500',
                    category: 'Support'
                },
                {
                    id: 'slide2-item2',
                    name: 'Fiber Cable Installation',
                    image: "https://images.unsplash.com/photo-1681383064412-171e5bee5f6e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    color: 'border-yellow-500',
                    category: 'Installation'
                },
                {
                    id: 'slide2-item3',
                    name: 'Network Operations Center',
                    image: "https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    color: 'border-pink-500',
                    category: 'Monitoring'
                }
            ]
        },
        {
            id: 3,
            title: "Unlimited",
            subtitle: "High-Speed Data Plans",
            buttonText: "View Plans",
            buttonLink: "/packages",
            gradient: "from-purple-600/20 to-pink-600/20",
            pattern: "circuits",
            items: [
                {
                    id: 'slide3-item1',
                    name: 'Gaming Optimized Connection',
                    image: "https://images.unsplash.com/photo-1720411201674-a9ed01606298?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    color: 'border-indigo-500',
                    category: 'Gaming'
                },
                {
                    id: 'slide3-item2',
                    name: '4K Streaming Ready',
                    image: "https://images.unsplash.com/photo-1719241843286-74f979874f97?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    color: 'border-teal-500',
                    category: 'Entertainment'
                },
                {
                    id: 'slide3-item3',
                    name: 'Work From Home Solution',
                    image: "https://images.unsplash.com/photo-1610168388710-a8cfbafe6c30?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    color: 'border-orange-500',
                    category: 'Business'
                }
            ]
        },
        {
            id: 4,
            title: "99.9% Uptime",
            subtitle: "Reliable Connection",
            buttonText: "Get Connected",
            buttonLink: "/contact",
            gradient: "from-green-600/20 to-emerald-600/20",
            pattern: "particles",
            items: [
                {
                    id: 'slide4-item1',
                    name: 'Premium Business Package',
                    image: "https://images.unsplash.com/photo-1561474119-1b76f3a79816?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    color: 'border-cyan-500',
                    category: 'Business'
                },
                {
                    id: 'slide4-item2',
                    name: 'Fiber to the Home',
                    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    color: 'border-lime-500',
                    category: 'Residential'
                },
                {
                    id: 'slide4-item3',
                    name: 'Enterprise Solutions',
                    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    color: 'border-rose-500',
                    category: 'Enterprise'
                }
            ]
        }
    ];

    // Define clockwise rotation sequences for each position
    const getRotatedImages = (cycleIndex: number) => {
        const items = slides[currentSlide].items;
        // Clockwise rotation: Main → Small → Side → Main
        const clockwiseRotations = [
            { main: items[0], small: items[2], side: items[1] }, // Cycle 0: Item1 (main), Item3 (small), Item2 (side)
            { main: items[2], small: items[1], side: items[0] }, // Cycle 1: Item3 (main), Item2 (small), Item1 (side)
            { main: items[1], small: items[0], side: items[2] }, // Cycle 2: Item2 (main), Item1 (small), Item3 (side)
            { main: items[0], small: items[2], side: items[1] }, // Cycle 3: Item1 (main), Item3 (small), Item2 (side)
        ];
        return clockwiseRotations[cycleIndex % clockwiseRotations.length];
    };

    const rotatedImages = getRotatedImages(currentImageCycle);

    // Get next images for flying effect preview
    const getNextImages = () => {
        const nextCycle = (currentImageCycle + 1) % 4;
        return getRotatedImages(nextCycle);
    };

    // Enhanced switching effect with scale and rotation
    const switchToNextImage = () => {
        if (imageTransitionState === 'switching') return;

        setNextImages(getNextImages());
        setImageTransitionState('switching');

        // Wait for switching animation to complete, then update image
        setTimeout(() => {
            setCurrentImageCycle((prev) => {
                const nextCycle = prev + 1;
                const completedCycle = (nextCycle % 4) === 0;

                // If we've completed a full cycle (4 images), trigger slide change
                if (completedCycle && isImageCycling && !isPaused) {
                    if (slideRotationTimeoutRef.current) {
                        clearTimeout(slideRotationTimeoutRef.current);
                    }

                    slideRotationTimeoutRef.current = setTimeout(() => {
                        nextSlide();
                    }, 500);
                }

                return nextCycle % 4;
            });
            setImageTransitionState('idle');
            setNextImages(null);
        }, 700);
    };

    const nextSlide = () => {
        setCurrentImageCycle(0);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        imageCycleCountRef.current = 0;
    };

    const prevSlide = () => {
        if (slideRotationTimeoutRef.current) {
            clearTimeout(slideRotationTimeoutRef.current);
        }

        setCurrentImageCycle(0);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        imageCycleCountRef.current = 0;
    };

    const goToSlide = (index: number) => {
        if (slideRotationTimeoutRef.current) {
            clearTimeout(slideRotationTimeoutRef.current);
        }

        setCurrentImageCycle(0);
        setCurrentSlide(index);
        imageCycleCountRef.current = 0;
    };

    // Effect for clockwise image rotation within a slide
    useEffect(() => {
        if (!isImageCycling || isPaused) return;

        const imageRotationInterval = setInterval(() => {
            switchToNextImage();
        }, 3000);

        return () => clearInterval(imageRotationInterval);
    }, [isImageCycling, isPaused, imageTransitionState, currentSlide]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (slideRotationTimeoutRef.current) {
                clearTimeout(slideRotationTimeoutRef.current);
            }
        };
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isMobile) return;
        setIsPaused(true);

        if (slideRotationTimeoutRef.current) {
            clearTimeout(slideRotationTimeoutRef.current);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isMobile) return;
        setTimeout(() => setIsPaused(false), 1000);
    };

    const slide = slides[currentSlide];

    // Enhanced animation classes with multiple effects
    const getImageSwitchClass = (position: 'main' | 'small' | 'side', isNextImage: boolean = false) => {
        if (!isNextImage && imageTransitionState === 'switching') {
            if (position === 'main') return styles['animate-switch-out-main'];
            if (position === 'small') return styles['animate-switch-out-small'];
            return styles['animate-switch-out-side'];
        }
        if (isNextImage && imageTransitionState === 'switching') {
            if (position === 'main') return styles['animate-switch-in-main'];
            if (position === 'small') return styles['animate-switch-in-small'];
            return styles['animate-switch-in-side'];
        }
        return '';
    };

    return (
        <section
            ref={carouselRef}
            className={`px-4 py-8 bg-neutral-100 dark:bg-gray-900 lg:py-10 relative overflow-hidden min-h-1/2 flex flex-col justify-center ${styles['background-container']}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Animated Gradient Orbs */}
            <div className={`${styles['gradient-orb']} ${styles['orb-1']}`} />
            <div className={`${styles['gradient-orb']} ${styles['orb-2']}`} />
            <div className={`${styles['gradient-orb']} ${styles['orb-3']}`} />
            
            {/* Animated Pattern Overlay */}
            <div className={`${styles['pattern-overlay']} ${styles[slide.pattern]}`} />
            
            {/* Floating Particles */}
            <div className={styles['particles-container']}>
                {[...Array(20)].map((_, i) => (
                    <div key={i} className={`${styles['particle']} ${styles[`particle-${i % 3}`]}`} />
                ))}
            </div>
            
            {/* Signal Waves Animation */}
            <div className={styles['signal-waves']}>
                <div className={styles['wave']} />
                <div className={styles['wave']} />
                <div className={styles['wave']} />
            </div>
            
            {/* Rotating Tech Rings */}
            <div className={styles['tech-rings']}>
                <div className={styles['ring']} />
                <div className={styles['ring']} />
                <div className={styles['ring']} />
            </div>

            {/* Gradient Mesh Background */}
            <div className={`${styles['gradient-mesh']} bg-gradient-to-br ${slide.gradient}`} />

            {/* Content Container */}
            <div className="relative h-full w-full max-w-7xl mx-auto pt-20 md:pt-32 z-10">
                <div className="grid lg:grid-cols-2 items-center justify-items-center gap-8 lg:gap-12 h-full">
                    {/* Text Content with enhanced animations */}
                    <div className="order-2 lg:order-1 flex flex-col justify-center items-center text-center lg:text-left px-4 lg:px-0">
                        <p className={`text-3xl sm:text-4xl md:text-5xl font-source font-bold lg:text-7xl text-red-600 mb-2 ${styles['text-slide-in']}`}>
                            {slide.title}
                        </p>
                        <p className={`text-xl sm:text-2xl md:text-3xl font-source font-bold lg:text-5xl text-black dark:text-white mb-4 ${styles['text-slide-in-delay']}`}>
                            {slide.subtitle}
                        </p>

                        {/* Enhanced Button Link with proper routing */}
                        <Link 
                            href={slide.buttonLink}
                            className={`relative overflow-hidden bg-linear-to-r from-red-600 to-red-500 text-white font-source font-semibold py-2 sm:py-2 px-3 sm:px-4 mt-4 sm:mt-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl group text-base sm:text-lg lg:text-lg inline-block ${styles['button-pop-in']}`}
                        >
                            <span className="relative z-10">{slide.buttonText}</span>
                            <span className="absolute inset-0 bg-linear-to-r from-red-700 to-red-600 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
                        </Link>
                    </div>

                    {/* Image Layout with Enhanced Animations */}
                    <div className="order-1 lg:order-2 w-full max-w-4xl">
                        <div className="flex flex-col lg:h-[70vh] justify-center items-center">
                            <div className="relative w-full max-w-md lg:max-w-none px-4 lg:px-0">
                                {/* Mobile & Tablet Layout */}
                                <div className="lg:hidden flex flex-col items-center space-y-4 sm:space-y-6">
                                    {/* Main Image */}
                                    <div className="relative w-full h-48 xs:h-56 sm:h-64 md:h-72 overflow-hidden group rounded-xl shadow-2xl">
                                        <div className={`relative w-full h-full transition-all duration-700 ${getImageSwitchClass('main')}`}>
                                            <Image
                                                src={rotatedImages.main.image}
                                                alt={`${rotatedImages.main.name} - A1 Communication Service`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 384px"
                                                priority={currentSlide === 0}
                                                quality={isMobile ? 75 : 85}
                                            />
                                        </div>
                                        {nextImages && imageTransitionState === 'switching' && (
                                            <div className={`absolute inset-0 transition-all duration-700 ${getImageSwitchClass('main', true)}`}>
                                                <Image
                                                    src={nextImages.main.image}
                                                    alt="Next service image switching in"
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 384px"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl"></div>
                                    </div>

                                    {/* Small & Side Images Grid */}
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                                        <div className="relative w-full h-36 xs:h-40 sm:h-44 md:h-48 overflow-hidden group rounded-xl shadow-lg">
                                            <div className={`relative w-full h-full transition-all duration-700 ${getImageSwitchClass('small')}`}>
                                                <Image
                                                    src={rotatedImages.small.image}
                                                    alt={`${rotatedImages.small.name} - Service detail`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 45vw, 192px"
                                                    quality={isMobile ? 75 : 85}
                                                />
                                            </div>
                                            {nextImages && imageTransitionState === 'switching' && (
                                                <div className={`absolute inset-0 transition-all duration-700 ${getImageSwitchClass('small', true)}`}>
                                                    <Image
                                                        src={nextImages.small.image}
                                                        alt="Next service image switching in"
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 45vw, 192px"
                                                    />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl"></div>
                                        </div>

                                        <div className="relative w-full h-36 xs:h-40 sm:h-44 md:h-48 overflow-hidden group rounded-xl shadow-lg">
                                            <div className={`relative w-full h-full transition-all duration-700 ${getImageSwitchClass('side')}`}>
                                                <Image
                                                    src={rotatedImages.side.image}
                                                    alt={`${rotatedImages.side.name} - Additional view`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 45vw, 268px"
                                                    quality={isMobile ? 75 : 85}
                                                />
                                            </div>
                                            {nextImages && imageTransitionState === 'switching' && (
                                                <div className={`absolute inset-0 transition-all duration-700 ${getImageSwitchClass('side', true)}`}>
                                                    <Image
                                                        src={nextImages.side.image}
                                                        alt="Next service image switching in"
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 45vw, 268px"
                                                    />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Layout */}
                                <div className="hidden lg:block relative w-full h-[500px]">
                                    {/* Main Image - Enhanced with 3D effect */}
                                    <div className="absolute left-0 top-0 w-[307px] h-[360px] overflow-hidden group z-10 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                                        <div className={`relative w-full h-full transition-all duration-700 ${getImageSwitchClass('main')}`}>
                                            <Image
                                                src={rotatedImages.main.image}
                                                alt={`${rotatedImages.main.name} - A1 Communication Main Service`}
                                                fill
                                                className="object-cover"
                                                sizes="307px"
                                                priority={currentSlide === 0}
                                            />
                                        </div>
                                        {nextImages && imageTransitionState === 'switching' && (
                                            <div className={`absolute inset-0 transition-all duration-700 ${getImageSwitchClass('main', true)}`}>
                                                <Image
                                                    src={nextImages.main.image}
                                                    alt="Next service image switching in"
                                                    fill
                                                    className="object-cover"
                                                    sizes="307px"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                                    </div>

                                    {/* Side Image */}
                                    <div className="absolute left-[320px] top-[150px] w-[269px] h-[210px] overflow-hidden group z-20 rounded-xl shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                                        <div className={`relative w-full h-full transition-all duration-700 ${getImageSwitchClass('side')}`}>
                                            <Image
                                                src={rotatedImages.side.image}
                                                alt={`${rotatedImages.side.name} - Service side view`}
                                                fill
                                                className="object-cover"
                                                sizes="269px"
                                            />
                                        </div>
                                        {nextImages && imageTransitionState === 'switching' && (
                                            <div className={`absolute inset-0 transition-all duration-700 ${getImageSwitchClass('side', true)}`}>
                                                <Image
                                                    src={nextImages.side.image}
                                                    alt="Next service image switching in"
                                                    fill
                                                    className="object-cover"
                                                    sizes="269px"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl"></div>
                                    </div>

                                    {/* Small Image */}
                                    <div className="absolute left-[200px] top-[310px] w-[192px] h-[150px] overflow-hidden group z-30 rounded-lg shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                                        <div className={`relative w-full h-full transition-all duration-700 ${getImageSwitchClass('small')}`}>
                                            <Image
                                                src={rotatedImages.small.image}
                                                alt={`${rotatedImages.small.name} - Service detail view`}
                                                fill
                                                className="object-cover transition-all duration-500 group-hover:scale-110"
                                                sizes="192px"
                                            />
                                        </div>
                                        {nextImages && imageTransitionState === 'switching' && (
                                            <div className={`absolute inset-0 transition-all duration-700 ${getImageSwitchClass('small', true)}`}>
                                                <Image
                                                    src={nextImages.small.image}
                                                    alt="Next service image switching in"
                                                    fill
                                                    className="object-cover transition-all duration-500 group-hover:scale-110"
                                                    sizes="192px"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-2 sm:space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className="focus:outline-none transition-all duration-300 group"
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <div className="relative">
                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${currentSlide === index
                                ? 'bg-red-600 dark:bg-red-700 scale-150 shadow-lg shadow-red-500/50'
                                : 'bg-red-400 dark:bg-red-600 hover:bg-red-500 dark:hover:bg-red-500'
                                }`} />

                            {currentSlide === index && (
                                <>
                                    <div className="absolute inset-0 -m-1 border-2 border-red-600 dark:border-red-700 rounded-full animate-ping opacity-60" />
                                    <div className="absolute inset-0 -m-1.5 border border-red-400 rounded-full animate-pulse opacity-40" />
                                </>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}