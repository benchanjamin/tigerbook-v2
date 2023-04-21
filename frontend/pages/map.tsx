import Header from "@components/ui/Header";
import {SidebarProvider} from "../context/SidebarContext";
import Head from 'next/head';
import Image from 'next/image';
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
import {HeaderType, ListData, SetupOneGet} from "@types/setup/one/types";
import {GetServerSideProps} from "next";
import {axiosInstance} from "../utils/axiosInstance";
import {AxiosResponse} from "axios";
import React, {useEffect, useState} from "react";
import Container from "@components/list/Container";
import Heading from "@components/list/Heading";
import Card from "@components/list/Card";
import TigerBookSearchBar from "@components/headless-ui/TigerBookListBar";
import TigerBookListBar from "@components/headless-ui/TigerBookListBar";
import {useRouter} from "next/router";
import TigerMap from "@components/Map/TigerMap";

interface ServerSideProps {
    data: SetupOneGet
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({query, req}) => {

    const axios = await axiosInstance();
    let axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/header/`,
        {
            headers: {
                Cookie: req.headers.cookie
            }
        })

    console.log(axiosResponse.data)
    const headerData: HeaderType = axiosResponse.data;

    return {
        props: {
            headerData,
        },
    }
};

interface Props {
    headerData: HeaderType

}

const Map : React.FC<Props> = ({headerData}) => {
    return (
        <>
            <Head>
                <title>Tigerbook</title>
            </Head>
            <SidebarProvider>
                {headerData.profile_pic_url != undefined ?
                    <Header disableSideBar={true} disableLinks={false} profilePicSrc={headerData.profile_pic_url}
                            username={headerData.username}/>
                    : <Header disableSideBar={true} disableLinks={false}
                              username={headerData.username}/>
                }
                <div className="fixed -z-10 h-screen w-screen">
                    <Image src="/static/nassau.jpg" alt="Nassau Hall"
                           fill
                           style={{objectFit: "cover"}}

                    />
                </div>
                <main className="flex flex-col dark:bg-gray-900 justify-center items-center h-full">
                    {/*<div className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem] flex-col z-10">*/}
                        <Container className="bg-gray-50 pt-4 rounded-2xl pb-10 dark:bg-gray-800 w-full">
                            <h1 className="text-center text-dark dark:text-white py-6 text-2xl font-bold tracking-wide">Map</h1>
                            <TigerMap />
                        </Container>
                    {/*</div>*/}
                </main>
            </SidebarProvider>
        </>

    );
}

export default Map;
