import Head from 'next/head';
import Image from 'next/image';
import {Link as ReactScrollLink} from "react-scroll";
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <Head>
                <title>Tigerbook</title>
            </Head>
            <header>
                <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                        <Link href="/" className="flex items-center">
                            <Image src="/Tigerbook.png"
                                   alt="Tigerbook Logo" width={149} height={40}/>
                        </Link>
                        <div className="flex items-center max-[435px]:justify-between max-[435px]:flex-grow lg:order-2">
                            <Link href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/login`}
                                  className="text-white bg-primary-400 hover:bg-primary-500 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Log
                                in with Princeton CAS</Link>
                            <button data-collapse-toggle="mobile-menu-2" type="button"
                                    className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                    aria-controls="mobile-menu-2" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                          clipRule="evenodd"></path>
                                </svg>
                                <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                             id="mobile-menu-2">
                            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                                {/*<li>*/}
                                {/*    <Link href="/"*/}
                                {/*          className="cursor-pointer block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-500 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"*/}
                                {/*    >Home</Link>*/}
                                {/*</li>*/}
                                <li>
                                    <ReactScrollLink to="features"
                                          spy={false}
                                          smooth={true}
                                          offset={0}
                                          duration={500}
                                          className="cursor-pointer block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-500 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Features</ReactScrollLink>
                                </li>
                                <li>
                                    <ReactScrollLink to="team"
                                          spy={false}
                                          smooth={true}
                                          offset={0}
                                          duration={500}
                                          className="cursor-pointer block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-500 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Team</ReactScrollLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <section className="bg-white dark:bg-gray-900">
                <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                    <div className="mr-auto place-self-center lg:col-span-7">
                        <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">A
                            new way to connect with Princeton undergraduate students</h1>
                        <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Search
                            for student involvement in extracurriculars, hometown affiliations, pursued concentrations &
                            certificates, and more!</p>
                        <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/login`}
                           className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-400 hover:bg-primary-500 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                            Log in with Princeton CAS
                            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                      clipRule="evenodd"></path>
                            </svg>
                        </a>
                    </div>
                    <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                        <Image src="/networking.svg"
                               alt="networking" width={411} height={297}/>
                    </div>
                </div>
            </section>
            <section className="bg-white dark:bg-gray-900" id="features">
                <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div className="max-w-screen-md mb-8 lg:mb-16">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Features</h2>
                    </div>
                    <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                        <div>
                            <div
                                className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Not Just a Student Directory</h3>
                            <p className="text-gray-500 dark:text-gray-400">Find not only other students but also
                                interests, extracurriculars,
                                and more. You can also help us continue to improve Tigerbook by suggesting more of these
                                categories in our compendium through an easy-to-fill form.</p>
                        </div>
                        <div>
                            <div
                                className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <line x1="20" y1="8" x2="20" y2="14"></line>
                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                </svg>
                                {/*<svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"*/}
                                {/*     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">*/}
                                {/*    <path fill-rule="evenodd"*/}
                                {/*          d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"*/}
                                {/*          clip-rule="evenodd"></path>*/}
                                {/*</svg>*/}
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Opt-In System</h3>
                            <p className="text-gray-500 dark:text-gray-400">We balance privacy and valuable information
                                through an opt-in system. This way, consent by the user is required before any
                                information is shared.</p>
                        </div>
                        <div>
                            <div
                                className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                {/*<svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"*/}
                                {/*     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">*/}
                                {/*    <path*/}
                                {/*        d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>*/}
                                {/*    <path fill-rule="evenodd"*/}
                                {/*          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"*/}
                                {/*          clip-rule="evenodd"></path>*/}
                                {/*</svg>*/}
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Privacy</h3>
                            <p className="text-gray-500 dark:text-gray-400">Control access to your information, whether
                                it&apos;s prohibiting all staff, all faculty,
                                or particular students from seeing certain attributes of your profile. We do not share
                                any of your information with third-parties
                                that are not affiliated with Princeton University.</p>
                        </div>
                        <div>
                            <div
                                className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <path
                                        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                </svg>
                                {/*<svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"*/}
                                {/*     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">*/}
                                {/*    <path*/}
                                {/*        d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>*/}
                                {/*</svg>*/}
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Smart Search Bar</h3>
                            <p className="text-gray-500 dark:text-gray-400">Search by PUID, email, full name, and
                                Princeton NetID with autocompleted search results.</p>
                        </div>
                        <div>
                            <div
                                className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <circle cx="12" cy="10" r="3"/>
                                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
                                </svg>
                                {/*<svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"*/}
                                {/*     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">*/}
                                {/*    <path fill-rule="evenodd"*/}
                                {/*          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"*/}
                                {/*          clip-rule="evenodd"></path>*/}
                                {/*    <path*/}
                                {/*        d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>*/}
                                {/*</svg>*/}
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Interactive Map</h3>
                            <p className="text-gray-500 dark:text-gray-400">Visualize the hometowns and current
                                locations of undergraduates around the world and find
                                those to connect to over break or after graduation.</p>
                        </div>


                        <div>
                            <div
                                className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                {/*<svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"*/}
                                {/*     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">*/}
                                {/*    <path fill-rule="evenodd"*/}
                                {/*          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"*/}
                                {/*          clip-rule="evenodd"></path>*/}
                                {/*</svg>*/}
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Reverse Search</h3>
                            <p className="text-gray-500 dark:text-gray-400">See who and how many belong in an
                                extracurricular activity, share your interest,
                                are in the same certificate program, are in the same housing building, and more!</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-white dark:bg-gray-900" id="team">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
                    <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Our
                            Team</h2>
                        {/*<p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">Explore the whole*/}
                        {/*    collection of open-source web components and elements built with the utility classes from*/}
                        {/*    Tailwind</p>*/}
                    </div>
                    {/*<div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">*/}
                    <div
                        className="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700">
                        <a href="#">
                            <Image className="w-full rounded-lg sm:rounded-none sm:rounded-l-lg"
                                   src="/ben.jpg"
                                   alt="Bonnie Avatar" width={200} height={200}/>
                        </a>
                        <div className="p-5">
                            <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                <a href="#">Ben Chan &apos;23</a>
                            </h3>
                            <span className="text-gray-500 dark:text-gray-400">Full-Stack Developer</span>
                            <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">Reimagining the flow of
                                connectivity within the Princeton University community.</p>
                            <ul className="flex space-x-4 sm:mt-0">
                                <li>
                                    <a href="https://github.com/benchanjamin" target="_blank" rel="noopener noreferrer"
                                       className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                                             aria-hidden="true">
                                            <path fillRule="evenodd"
                                                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/*</div>*/}
            </section>
        </>
    );
}
