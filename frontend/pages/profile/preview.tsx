import React, {useEffect, useState} from 'react';
import {GetServerSideProps} from "next";
import {axiosInstance, axiosLocalhost} from "@utils/axiosInstance";
import {AxiosResponse} from "axios";
import {HeaderType, User} from "@types/types";
import Image from "next/image";
import {SidebarProvider} from "@context/SidebarContext";
import {Spinner} from "flowbite-react";
import Header from "@components/ui/Header";


export const getServerSideProps: GetServerSideProps<Props> = async ({req}) => {
    let REDIRECT_ERROR = 0
    const axios = await axiosInstance();
    const axiosRedirect: AxiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/redirect/`,
        {
            headers: {
                Cookie: req.headers.cookie
            }
        })
        .catch(function () {
            REDIRECT_ERROR = 1
        })

    if (REDIRECT_ERROR == 1) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    const redirectURL = `/${axiosRedirect.data['redirect_url'].split('/').slice(2).join('/')}`;

    if (redirectURL.includes('setup')) {
        return {
            redirect: {
                destination: redirectURL,
                permanent: false,
            },
        };
    }

    let axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/undergraduate/profile/preview/`,
        {
            headers: {
                Cookie: req.headers.cookie
            }
        })

    const userData: User = axiosResponse.data;

    axiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/header/`,
        {
            headers: {
                Cookie: req.headers.cookie
            }
        })
    const headerData: HeaderType = axiosResponse.data;

    return {
        props: {
            userData,
            headerData
        }
    }
}

function format(inputDate) {
    let date = new Date(inputDate+ 'T00:00:00');
    if (!isNaN(date.getTime())) {
        return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
    }
}

interface Props {
    userData: User
    headerData: HeaderType
}

const ProfilePreview: React.FC<Props> = ({userData, headerData}) => {
    const [isImageReady, setIsImageReady] = useState(false);
    const residentialCollegeLogoSrc = `/static/${userData.residential_college.toLowerCase().replace(/\s/g, '')}.webp`

    console.log(userData)
    return (
        <SidebarProvider>
            {headerData.profile_pic_url != undefined ?
                <Header disableSideBar={true} disableLinks={false} profilePicSrc={headerData.profile_pic_url}
                        username={headerData.username} hasProfile={headerData.has_profile}/>
                : <Header disableSideBar={true} disableLinks={false}
                          username={headerData.username} hasProfile={headerData.has_profile}/>
            }
            <div className="fixed -z-10 h-screen w-screen">
                <Image src="/static/nassau.png" alt="Nassau Hall"
                       fill
                       style={{objectFit: "cover"}}
                />
            </div>
            <main className="flex flex-col justify-center items-center">
                <section
                    className=" bg-white m-2 p-6 px-4 sm:px-20 dark:bg-gray-900 z-10 rounded-2xl relative shadow-2xl">
                    <div className="inline-grid grid-cols-1 sm:grid-cols-2 gap-x-4">

                        <div className="flex flex-col items-center sm:items-start order-2 sm:order-first">
                            <div className="relative w-[200px] h-[200px]">
                                {!isImageReady &&
                                    <Spinner
                                        id="spinner"
                                        color="warning"
                                        className="absolute m-auto left-0 right-0 top-0 bottom-0"/>}
                                <Image src={userData.profile_pic_url ?? "/static/placeholder.jpg"}
                                       fill
                                       alt={`Profile picture of ${userData.full_name}`}
                                       style={{objectFit: "cover"}}
                                       onLoad={() => {
                                           setIsImageReady(true)
                                           setIsImageReady(false)
                                       }}
                                       className=" rounded-2xl"
                                />
                            </div>
                        </div>

                        <div
                            className="flex flex-col items-center sm:items-start order-first mb-4 sm:order-0 sm:mb-0">
                            <h1 className="flex flex-1 sm:flex-0 flex-wrap text-3xl justify-center items-center font-medium tracking-wide text-center sm:text-left dark:text-white">
                                {userData.full_name}&nbsp;&lsquo;{String(userData.class_year).slice(2)}&nbsp;
                                {userData.pronouns &&
                                    <div className="text-gray-500 text-lg text-center sm:text-left">
                                        ({userData.pronouns})
                                    </div>
                                }
                            </h1>
                            <div className="text-gray-500 text-left font-medium tracking-wide mt-3">
                                {userData.aliases.map((alias, index) => {
                                    return (
                                        <span key={index} className="text-gray-300">
                                            {alias} <br/>
                                        </span>
                                    )
                                })}
                            </div>
                            <div className="mt-3">
                                <div className="flex justify-left items-center ">
                                    <div className="h-6 w-6">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                             className="w-6 h-6 inline-flex dark:text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
                                        </svg>
                                    </div>
                                    <div
                                        className="pl-2 text-black dark:text-white text-left mt-2 font-medium tracking-wide">
                                        {userData.track}&nbsp;{userData.concentration}
                                    </div>
                                </div>
                                <div className="flex justify-left items-center mt-1">
                                    <div className="h-6 w-6 relative mt-1">
                                        <Image
                                            src={residentialCollegeLogoSrc}
                                            fill
                                            style={{objectFit: 'contain'}}
                                            alt={userData.residential_college}
                                        />
                                    </div>
                                    <div
                                        className="pl-2 text-black dark:text-white text-left mt-2 font-medium tracking-wide">
                                        {userData.residential_college}&nbsp;College
                                    </div>
                                </div>
                                {userData.interoffice_mailing_address &&
                                    <div className="flex justify-left items-center mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor"
                                             className="w-6 h-6 mt-1.5 dark:text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                                        </svg>

                                        <div
                                            className="pl-2 text-black dark:text-white text-left mt-2 font-medium tracking-wide">
                                            {userData.interoffice_mailing_address}
                                        </div>
                                    </div>}
                                {userData.email_address &&
                                    <div className="flex justify-left items-center mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                             className="w-6 h-6 mt-1.5 dark:text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
                                        </svg>
                                        <div
                                            className="pl-2 text-black dark:text-white text-left mt-2 font-medium tracking-wide">
                                            {userData.email_address}
                                        </div>
                                    </div>}
                            </div>
                            <div className="flex justify-center items-center mt-4 w-full">
                                <div className="flex bg-primary-500 h-[50px] w-[200px] rounded-2xl text-center">
                                    <div className="m-auto text-white">{userData.username}</div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="flex flex-col items-center sm:items-start order-last mb-4 sm:order-4 sm:mb-0">

                            {userData.interests && userData.interests.length > 0 &&
                                (<>
                                    <h4 className="text-primary-500 text-left mt-4 sm:mt-0 sm:mt-3 font-bold tracking-wide">
                                        INTERESTS
                                    </h4>
                                    {userData.interests?.map((interest, index) => {
                                        return (
                                            <div key={index}
                                                 className="flex justify-left items-center ">
                                                <div className="h-6 w-6">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                                         className="w-6 h-6 inline-flex dark:text-white">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                                                    </svg>
                                                </div>
                                                <span
                                                    className="pl-2 text-gray-600 dark:text-white text-left mt-2 font-light tracking-tighter">
                                            {interest}
                                        </span>
                                            </div>
                                        )
                                    })}
                                </>)
                            }
                            {userData.extracurriculars && userData.extracurriculars.length > 0 &&
                                (<>
                                    <h4 className="text-primary-500 text-left mt-3 font-bold tracking-wide">
                                        EXTRACURRICULARS
                                    </h4>
                                    {userData.extracurriculars?.map((extracurricular, index) => {
                                        return (
                                            <div key={index}
                                                 className="flex justify-left items-center ">
                                                <div className="h-6 w-6">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                                         className="w-6 h-6 inline-flex dark:text-white">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
                                                    </svg>

                                                </div>
                                                <p
                                                    className="pl-2 text-gray-600 dark:text-white text-left mt-2 font-light tracking-tighter">
                                                    {extracurricular.extracurricular}
                                                    {extracurricular.positions.length !== 0 && ` (${extracurricular.positions.join(', ')})`}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </>)
                            }
                            {userData.housing && (
                                <>
                                    <h4 className="text-primary-500 text-left mt-4 font-bold tracking-wide">
                                        HOUSING
                                    </h4>
                                    <div className="flex justify-left items-center ">
                                        <div className="h-6 w-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor"
                                                 className="inline-flex w-6 h-6 dark:text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                                            </svg>
                                        </div>
                                        <span
                                            className="pl-2 text-gray-600 dark:text-white text-left mt-2 font-light tracking-tighter">
                            {userData.housing}
                                </span>
                                    </div>
                                </>
                            )
                            }
                            {userData.research && userData.research.length > 0 &&
                                (<>
                                    <h4 className="text-primary-500 text-left mt-3 font-bold tracking-wide">
                                        RESEARCH
                                    </h4>
                                    {userData.research?.map((research, index) => {
                                        return (
                                            <div key={index}
                                                 className="flex justify-left items-center ">
                                                <div className="h-6 w-6 pt-0.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         className="w-6 h-6 inline-flex dark:text-white "
                                                         fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                                         stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
                                                    </svg>

                                                </div>
                                                <p
                                                    className="pl-2 text-gray-600 dark:text-white text-left mt-2 font-bold tracking-wide">
                                                    {research.research_type}
                                                    <br/>
                                                    <span
                                                        className="font-light tracking-tight">{research.research_title}</span>
                                                </p>
                                            </div>
                                        )
                                    })}
                                </>)
                            }
                        </div>

                        <div
                            className="flex flex-col items-center sm:items-start order-4 sm:order-3 sm:mb-0">
                            {userData.certificates && userData.certificates?.length > 0 &&
                                (<>
                                    <h4 className="text-primary-500 text-left mt-4 font-bold tracking-wide">
                                        CERTIFICATES
                                    </h4>
                                    {userData.certificates.map((certificate, index) => {
                                        return (
                                            <div key={index}
                                                 className="flex justify-left items-center ">
                                                <div className="h-6 w-6">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                                         stroke="currentColor"
                                                         className="w-6 h-6 inline-flex dark:text-white">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
                                                    </svg>
                                                </div>
                                                <span
                                                    className="pl-2 text-gray-600 dark:text-white text-left mt-2 font-light tracking-tighter">
                                            {certificate}
                                        </span>
                                            </div>
                                        )
                                    })}
                                </>)
                            }
                            {userData.hometown && (
                                <>
                                    <h4 className="text-primary-500 text-left mt-4 font-bold tracking-wide">
                                        HOMETOWN
                                    </h4>
                                    <div className="flex justify-left items-center ">
                                        <div className="h-6 w-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor"
                                                 className="inline-flex w-6 h-6 dark:text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                                            </svg>
                                        </div>
                                        <span
                                            className="pl-2 text-gray-600 dark:text-white text-left mt-2 font-light tracking-tighter">
                            {userData.hometown}
                                </span>
                                    </div>
                                </>
                            )
                            }
                            {userData.current_city && (
                                <>
                                    <h4 className="text-primary-500 text-left mt-4 font-bold tracking-wide">
                                        CURRENT CITY
                                        <span className="text-xs text-gray-400">
                                            {` (last updated: ${format(userData.last_updated_current_city)})`}
                                        </span>
                                    </h4>
                                    <div className="flex justify-left items-center ">
                                        <div className="h-6 w-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor"
                                                 className="inline-flex w-6 h-6 dark:text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                                            </svg>
                                        </div>
                                        <span
                                            className="pl-2 text-gray-600 dark:text-white text-left mt-2 font-light tracking-tighter">
                            {userData.current_city}
                                </span>
                                    </div>
                                </>
                            )
                            }
                            {userData.miscellaneous && userData.miscellaneous.length > 0 &&
                                (<>
                                    <h4 className="text-primary-500 text-left mt-3 font-bold tracking-wide">
                                        MISCELLANEOUS
                                    </h4>
                                    {userData.miscellaneous?.map((miscellaneous, index) => {
                                        return (
                                            <div key={index}
                                            >
                                                <p
                                                    className="text-gray-600 dark:text-white text-center sm:text-left mt-2 px-0 sm:pr-10 sm:pl-0 font-semibold tracking-normal">
                                                    {miscellaneous.miscellaneous_title}
                                                    <br/>
                                                    <span
                                                        className="font-light tracking-tight">{miscellaneous.miscellaneous_description}</span>
                                                </p>
                                            </div>
                                        )
                                    })}
                                </>)
                            }
                        </div>

                    </div>


                </section>
            </main>

        </SidebarProvider>
    );
}

export default ProfilePreview;
