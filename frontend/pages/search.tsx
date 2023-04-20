import Head from 'next/head';
import Image from 'next/legacy/image';
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
import {SetupOneGet} from "@types/setup/one/types";
import {GetServerSideProps} from "next";
import {axiosLocalhost} from "../utils/axiosInstance";
import {AxiosResponse} from "axios";
import React, {useState} from "react";
import TigerBookSearchBar from "@components/headless-ui/TigerBookSearchBar";
import {useRouter} from "next/router";

interface ServerSideProps {
    data: SetupOneGet
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({req}) => {

    const axios = await axiosLocalhost();
    let axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/undergraduate/profile/setup/one/`,
        {
            headers: {
                Cookie: req.headers.cookie
            }
        })
    console.log(axiosResponse.data)
    const data: SetupOneGet = axiosResponse.data;


    return {
        props: {
            data
        },
    }
};

interface Props {
    data: SetupOneGet
}


export default function Search({data}) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    // console.log("Search", query)

    return (
        <>
            <Head>
                <title>Tigerbook</title>
            </Head>
            <SidebarProvider>
                {data.profile_pic != undefined ?
                    <Header disableSideBar={true} disableLinks={false} profilePicSrc={data.profile_pic} username={data.username}/>
                    : (data.residential_college_facebook_entry != undefined ?
                        <Header disableSideBar={true} disableLinks={false}
                                profilePicSrc={data.residential_college_facebook_entry.photo_url}
                                username={data.username}/>
                        : <Header disableSideBar={true} disableLinks={false}
                                  username={data.username}/>)
                }
                <div className="flex dark:bg-gray-900 h-full">
                    <main className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem] flex-col z-10">
                        {/* Search container */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-x-4 pt-20">
                            {/* Search bar */}
                            <div className="w-full md:w-1/2 mb-4 md:mb-0 align-middle">
                               <TigerBookSearchBar defaultText="Search by PUID, NetID, nickname, or full name"
                                                   autoComplete="off"
                                                   zIndex={100} setterFunction={setQuery}/>
                            </div>
                            <button onClick={async () => await router.push(`/list/?q=${encodeURIComponent(query)}`)}
                                className="bg-primary-400 hover:bg-primary-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-50">
                                List
                            </button>
                        </div>
                        <div className="absolute h-full z-0">
                        </div>
                    </main>
                    {/*<div className="order-1">*/}
                    {/*    <ActualSidebar/>*/}
                    {/*</div>*/}
                    <Image src="/nassau.jpg" alt="Nassau Hall" className="absolute h-full z-0"
                           layout={"fill"} objectFit={"cover"}
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
