import Header from "@components/ui/Header";
import {SidebarProvider} from "../context/SidebarContext";
import Head from 'next/head';
import Image from 'next/legacy/image';
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
import {HeaderType, SetupOneGet} from "@types/types";
import {GetServerSideProps} from "next";
import {axiosInstance} from "@utils/axiosInstance";
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

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({req}) => {
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

    let RESPONSE_ERROR = 0;
    let axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/header/`,
        {
            headers: {
                Cookie: req.headers.cookie
            }
        })
        .catch(function () {
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

const Suggest: React.FC<Props> = ({headerData}) => {
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
            </SidebarProvider>
        </>

    );
}

export default Suggest;
