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
import {HeaderType, SetupOneGet} from "@types/setup/one/types";
import {GetServerSideProps} from "next";
import {axiosInstance} from "../utils/axiosInstance";
import {AxiosResponse} from "axios";
import React, {useState} from "react";
import TigerBookSearchBar from "@components/headless-ui/TigerBookSearchBar";
import {useRouter} from "next/router";

interface ServerSideProps {
    data: SetupOneGet
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({req}) => {
    let RESPONSE_ERROR = 0
    const axios = await axiosInstance();
    let axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/header/`,
        {
            headers: {
                Cookie: req.headers.cookie
            }
        }).catch(function () {
        RESPONSE_ERROR = 1
    })

    if (RESPONSE_ERROR == 1) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    console.log(axiosResponse.data)
    const headerData: HeaderType = axiosResponse.data;

    return {
        props: {
            headerData
        },
    }
};

interface Props {
    headerData: HeaderType
}


const Search: React.FC<Props> = ({headerData}) => {
    const [query, setQuery] = useState('');
    const router = useRouter();

    // console.log("Search", query)

    return (
        <>
            <Head>
                <title>Tigerbook</title>
            </Head>
            <SidebarProvider>
                {headerData.profile_pic_url != undefined ?
                    <Header disableSideBar={true} disableLinks={false} profilePicSrc={headerData.profile_pic_url}
                            username={headerData.username} hasProfile={headerData.has_profile}/>
                    : <Header disableSideBar={true} disableLinks={false}
                              username={headerData.username} hasProfile={headerData.has_profile}/>
                }
                <main className="flex dark:bg-gray-900 h-full">
                    <div className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem] flex-col z-10">
                        {/* Search container */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-x-4 pt-20">
                            {/* Search bar */}
                            <div className="w-full md:w-1/2 mb-4 md:mb-0 align-middle">
                                <TigerBookSearchBar defaultText="Search PUID, NetID, nickname, or full name"
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
                    </div>
                    <Image src="/static/nassau.png" alt="Nassau Hall" className="absolute h-full z-0"
                           layout={"fill"} objectFit={"cover"}
                    />
                </main>
            </SidebarProvider>
        </>
    );
}

export default Search;
