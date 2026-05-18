import Image from "next/image";
import Link from "next/link";

const AboutA1: React.FC = () => {
    return (
        <div id="about" className="relative bg-white dark:bg-gray-900 overflow-hidden my-16">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">

                    {/* SVG Shape */}
                    <svg
                        className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white dark:text-gray-900 transform translate-x-1/2"
                        fill="currentColor"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <polygon points="50,0 100,0 50,100 0,100"></polygon>
                    </svg>

                    <div className="pt-1" />

                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">

                            <h2 className="my-6 text-2xl tracking-tight font-source text-gray-900 dark:text-white sm:text-3xl md:text-6xl">
                                Experience lightning-fast{" "}
                                <span className="text-red-600 dark:text-red-700">fiber optic internet</span>
                            </h2>

                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xl">
                                A1 Communication delivers reliable, high-speed internet connectivity across Bangladesh. 
                                Enjoy seamless streaming, gaming, and work-from-home solutions with 99.9% uptime and 24/7 customer support.
                            </p>

                            {/* Button with new design */}
                            <div className="mt-6">
                                <Link href={'/about'}>
                                <button className="relative overflow-hidden bg-red-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg group text-lg">
                                    <span className="relative z-10">Learn More About A1 Communication</span>
                                    <span className="absolute inset-0 bg-red-700 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
                                </button>
                                </Link>
                            </div>

                        </div>
                    </main>
                </div>
            </div>

            {/* Image Section - Fixed for mobile */}
            <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 mt-8 lg:mt-0">
                {/* Added fixed height container for mobile */}
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-full w-full">
                    <Image
                        src="https://images.unsplash.com/photo-1640011655323-a14d80feac25?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Fiber optic internet connection"
                        fill
                        style={{ objectFit: "cover" }}
                        loading="eager"
                        className="object-cover"
                        sizes="(max-width: 1023px) 100vw, 50vw"
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutA1;