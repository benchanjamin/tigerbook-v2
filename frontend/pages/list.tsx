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
import {HeaderType, List, ListUser, SetupOneGet} from "@types/types";
import {GetServerSideProps} from "next";
import {axiosInstance, axiosLocalhost} from "@utils/axiosInstance";
import {AxiosResponse} from "axios";
import React, {useEffect, useState} from "react";
import Container from "@components/list/Container";
import Heading from "@components/list/Heading";
import Card from "@components/list/Card";
import TigerBookSearchBar from "@components/headless-ui/TigerBookListBar";
import TigerBookListBar from "@components/headless-ui/TigerBookListBar";
import {useRouter} from "next/router";
import {list} from "postcss";

interface ServerSideProps {
    data: SetupOneGet
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({query, req}) => {
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

    let axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/header/`,
        {
            headers: {
                Cookie: req.headers.cookie
            }
        })
    const headerData: HeaderType = axiosResponse.data;

    // let listURL = `${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/list/`;
    // if ('q' in query) {
    //     listURL += `?q=${query.q}`;
    // }
    // axiosResponse = await axios.get(listURL,
    //     {
    //         headers: {
    //             Cookie: req.headers.cookie
    //         }
    //     })
    // const listData: List = axiosResponse.data;

    return {
        props: {
            headerData,
            // listData
        },
    }
};

interface Props {
    headerData: HeaderType
    // listData: List
}


const List: React.FC<Props> = ({headerData}) => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [listResults, setListResults] = useState<ListUser[]>([]);
    const router = useRouter();

    async function fetchUserData() {
        const axios = await axiosInstance();
        let listURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/list/?page=${page}`;
        const {query} = router;
        console.log('page', page);
        console.log('listResults', listResults);
        if ('q' in query) {
            listURL += `&q=${query.q}`;
        }
        const axiosResponse = await axios.get(listURL)
        console.log('query', query);
        console.log('listURL', listURL);
        const listData: List = axiosResponse.data;
        setListResults((prev) => [...prev, ...listData.results]);
    }

    useEffect(() => {
        fetchUserData();
    }, [page]);

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
                        <Container className="bg-gray-50 pt-4 rounded-2xl pb-10 dark:bg-gray-800">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-x-4">
                                <div className="w-full md:w-1/2 mb-4 md:mb-0 align-middle">
                                    <TigerBookListBar defaultText="Search PUID, NetID, nickname, or full name"
                                                      zIndex={100} setterFunction={setQuery}
                                                      autoComplete="off"/>
                                </div>
                                <button onClick={async () => {
                                    await router.push(`/list/?q=${encodeURIComponent(query)}`)
                                    setListResults([])
                                    fetchUserData()
                                }}
                                        className="bg-primary-400 hover:bg-primary-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-5 mt-1.50">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 dark:text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                                    </svg>
                                </button>
                            </div>
                            <div
                                className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8"
                            >
                                {listResults?.map((listUser, index) => (
                                    <Card key={index} personData={listUser}
                                          isLast={index === listResults.length - 1}
                                          newLimit={() => setPage((prev) => prev + 1)}
                                    />
                                ))}
                            </div>
                        </Container>
                    </div>

                    <div className="order-1">
                        <ActualSidebar/>
                    </div>
                    <Image src="/static/nassau.png" alt="Nassau Hall" className="absolute h-full z-0"
                           fill style={{objectFit: "cover"}}
                    />
                </main>
            </SidebarProvider>
        </>
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
