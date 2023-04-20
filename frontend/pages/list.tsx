import Head from 'next/head';
import Image from 'next/image';
import {SidebarProvider} from "../context/SidebarContext";
import {BiBuoy} from "react-icons/bi";
import {
    BsDribbble,
    BsFacebook,
    BsGithub,
    BsInstagram,
    BsTwitter,
} from "react-icons/bs";
import {
    HiAdjustments,
    HiArrowNarrowRight,
    HiArrowSmRight,
    HiChartPie,
    HiCheck,
    HiClipboardList,
    HiCloudDownload,
    HiDatabase,
    HiExclamation,
    HiEye,
    HiHome,
    HiInbox,
    HiOutlineAdjustments,
    HiShoppingBag,
    HiTable,
    HiUser,
    HiUserCircle,
    HiViewBoards,
    HiX,
} from "react-icons/hi";
import Sidebar from "@components/ui/Sidebar";
import Header from "@components/ui/Header";
import {ListData, SetupOneGet} from "@types/setup/one/types";
import {GetServerSideProps} from "next";
import {axiosLocalhost} from "../utils/axiosInstance";
import {AxiosResponse} from "axios";
import React, {useEffect, useState} from "react";
import Container from "@components/list/Container";
import Heading from "@components/list/Heading";
import Card from "@components/list/Card";
import TigerBookSearchBar from "@components/headless-ui/TigerBookListBar";
import TigerBookListBar from "@components/headless-ui/TigerBookListBar";
import {useRouter} from "next/router";

interface ServerSideProps {
    data: SetupOneGet
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({query, req}) => {

    const axios = await axiosLocalhost();
    let axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/undergraduate/profile/setup/one/`,
        {
            headers: {
                Cookie: req.headers.cookie
            }
        })
    console.log(axiosResponse.data)
    const profileData: SetupOneGet = axiosResponse.data;

    let listURL = `${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/list/`;
    if ('q' in query) {
        listURL += `?q=${query.q}`;
    }
    axiosResponse = await axios.get(listURL,
        {
            headers: {
                Cookie: req.headers.cookie
            }
        })
    const listData: ListData = axiosResponse.data;
    console.log(listData)

    return {
        props: {
            profileData,
            listData
        },
    }
};

interface Props {
    profileData: SetupOneGet
    listData: ListData
}


const List: React.FC<Props> = ({profileData, listData}) => {
    const [query, setQuery] = useState('');
    const router = useRouter();

    // useEffect(() => {
    //
    //     return () => {
    //         effect
    //     };
    // }, [query]);


    return (
        <>
            <Head>
                <title>Tigerbook</title>
            </Head>
            <SidebarProvider>
                {profileData.profile_pic != undefined ?
                    <Header disableSideBar={true} disableLinks={false} profilePicSrc={profileData.profile_pic}
                            username={profileData.username}/>
                    : (profileData.residential_college_facebook_entry !== null ?
                        <Header disableSideBar={true} disableLinks={false}
                                profilePicSrc={profileData.residential_college_facebook_entry.photo_url}
                                username={profileData.username}/>
                        : <Header disableSideBar={true} disableLinks={false}
                                  username={profileData.username}/>)
                }
                <div className="flex dark:bg-gray-900 h-full">
                    <main className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem] flex-col z-10">
                        <Container className="bg-gray-50 pt-4 rounded-2xl pb-10 dark:bg-gray-800">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-x-4">
                                <div className="w-full md:w-1/2 mb-4 md:mb-0 align-middle">
                                    <TigerBookListBar defaultText="Search by PUID, NetID, nickname, or full name"
                                                      zIndex={100} setterFunction={setQuery}
                                                      autoComplete="off"/>
                                </div>
                                <button onClick={async () => await router.push(`/list/?q=${encodeURIComponent(query)}`)}
                                        className="bg-primary-400 hover:bg-primary-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-50">
                                    List
                                </button>
                            </div>
                            <div
                                className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8"
                            >
                                {listData.results.map((item, index) => (
                                    <Card key={index} personData={item}/>
                                ))}
                            </div>
                        </Container>
                    </main>

                    <div className="order-1">
                        <ActualSidebar/>
                    </div>
                    <Image src="/static/nassau.jpg" alt="Nassau Hall" className="absolute h-full z-0"
                           fill style={{objectFit: "cover"}}
                    />
                </div>
            </SidebarProvider>
        </>
    );
}

function HomePage(): JSX.Element {
    return (
        <div className="p-6">
            <section>
                <header>
                    <h1 className="mb-6 text-5xl font-extrabold dark:text-white">
                        Welcome to <code>Flowbite</code> on <code>Next.js</code>!
                    </h1>
                </header>
            </section>
        </div>
    );
}


function ActualSidebar(): JSX.Element {
    return (
        <Sidebar>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item href="#" icon={HiChartPie}>
                        Dashboard
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiViewBoards}>
                        Kanban
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiInbox}>
                        Inbox
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiUser}>
                        Users
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiShoppingBag}>
                        Products
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiArrowSmRight}>
                        Sign In
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiTable}>
                        Sign Up
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <Sidebar.Item href="#" icon={HiChartPie}>
                        Upgrade to Pro
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiViewBoards}>
                        Documentation
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={BiBuoy}>
                        Help
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}

export default List;
