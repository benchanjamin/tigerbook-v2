import Head from 'next/head';
import Image from 'next/image';
import {SidebarProvider} from "@context/SidebarContext";
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
import Card from "@components/list/Card";
import TigerBookListBar from "@components/headless-ui/TigerBookListBar";
import {useRouter} from "next/router";
import {Spinner} from "flowbite-react";
import TigerBookListBox from "@components/headless-ui/TigerBookListBox";
import TigerBookComboBoxSingleStrictSelect from "@components/headless-ui/TigerBookComboBoxSingleStrictSelect";
import TigerBookComboBoxMultipleStrictSelect from "@components/headless-ui/TigerBookComboBoxMultipleStrictSelect";

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

interface ListData {
    concentrations: string[]
    tracks: string[]
    residentialColleges: string[]
    classYears: string[]
    pronouns: string[]
    certificates: string[]
    interests: string[]
    extracurriculars: string[]
    positions: string[]
    completeHousing: string[],
    researchTypes: string[]
}

const List: React.FC<Props> = ({headerData}) => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [listResults, setListResults] = useState<ListUser[]>([]);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isExplicitSearching, setIsExplicitSearching] = useState(false);
    const [count, setCount] = useState(0);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // search queries
    const [concentrationQuery, setConcentrationQuery] = useState(null);
    const [tracksQuery, setTracksQuery] = useState(null);
    const [resCollegeQuery, setResCollegeQuery] = useState(null);
    const [classYearsQuery, setClassYearsQuery] = useState(null);

    // search list
    const [concentrationsList, setConcentrationsList] = useState([]);
    const [tracksList, setTracksList] = useState([]);
    const [resCollegesList, setResCollegesList] = useState([]);
    const [classYearsList, setClassYearsList] = useState([]);
    const [certificatesList, setCertificatesList] = useState([]);
    const [pronounsList, setPronounsList] = useState([]);

    console.log('res', resCollegesList)


    async function fetch() {

        const axios = await axiosInstance();

        const apiListAPIRoutes = [
            '/api-django/concentrations/',
            '/api-django/tracks/',
            '/api-django/class-years/',
            '/api-django/residential-colleges/',
            '/api-django/certificates/',
            '/api-django/pronouns/',
            '/api-django/interests/',
            '/api-django/extracurriculars/',
            '/api-django/extracurricular-positions/',
            '/api-django/housing/',
            '/api-django/research-types/'
            // '/api-django/cities/',
        ]

        const keys = [
            'concentrations',
            'tracks',
            'classYears',
            'residentialColleges',
            'certificates',
            'pronouns',
            'interests',
            'extracurriculars',
            'positions',
            'completeHousing',
            'researchTypes',
            // 'cities',
        ]

        const indices = [
            'concentration',
            'track',
            'class_year',
            'residential_college',
            'certificate',
            'pronouns',
            'interest',
            'extracurricular',
            'position',
            'complete_housing',
            'research_type',
            // 'complete_city',
        ]

        const listData: ListData = {}

        for (const [index, apiRoute] of apiListAPIRoutes.entries()) {
            const axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiRoute}`)
            console.log('incoming', axiosResponse.data)
            if (axiosResponse.data.length === 0) {
                continue
            }
            listData[keys[index]] = axiosResponse.data.map((item) => item[indices[index]])
            if (index === 0) {
                setConcentrationsList(listData.concentrations)
            }
            if (index === 1) {
                setTracksList(listData.tracks)
            }
            if (index === 2) {
                setClassYearsList(listData.classYears)
            }
            if (index === 3) {
                setResCollegesList(listData.residentialColleges)
            }
        }
    }

    useEffect(() => {
        fetch()
    }, []);


    async function onEnter() {
        setIsExplicitSearching(true)
        setIsLoading(true)
        setListResults([])
        await router.push(`/list?q=${encodeURIComponent(query)}`)
        setPage(1)
        await fetchUserData(encodeURIComponent(query))
        setIsExplicitSearching(false)
    }

    async function fetchUserData(explicitQuery) {
        const axios = await axiosInstance();
        let listURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/list/`;
        const {query} = router;
        if (explicitQuery !== undefined) {
            listURL += `?page=1&q=${explicitQuery}`;
        } else if ('q' in query) {
            listURL += `?page=${page}&q=${query.q}`;
        } else {
            listURL += `?page=${page}`;
        }
        console.log('listURL', listURL)
        const axiosResponse = await axios.get(listURL)
        const listData: List = axiosResponse.data;
        setIsLoading(false)
        setListResults((prev) => [...prev, ...listData.results]);
        setCount(listData.count)
        setHasNextPage(listData.next !== null);
    }

    useEffect(() => {
        if (isExplicitSearching) return;
        fetchUserData();
    }, [page]);

    return (
        <>
            <Head>
                <title>Tigerbook</title>
            </Head>
            <div className="fixed -z-10 h-screen w-screen">
                <Image src="/static/nassau.png" alt="Nassau Hall"
                       fill
                       style={{objectFit: "cover"}}
                />
            </div>
            <SidebarProvider>
                {headerData.profile_pic_url != undefined ?
                    <Header disableSideBar={false} disableLinks={false} profilePicSrc={headerData.profile_pic_url}
                            username={headerData.username} hasProfile={headerData.has_profile}/>
                    : <Header disableSideBar={false} disableLinks={false}
                              username={headerData.username} hasProfile={headerData.has_profile}/>
                }
                <main className="flex h-full">

                    <div className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem] flex-col z-10">
                        <Container className="bg-gray-50 pt-4 rounded-2xl pb-10 dark:bg-gray-800">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-x-4">
                                <div className="w-full md:w-1/2 mb-4 md:mb-0 align-middle">
                                    <TigerBookListBar defaultText="Search PUID, NetID, nickname, or full name"
                                                      zIndex={100} setterFunction={setQuery}
                                                      autoComplete="off"
                                                      onEnterFunction={async () => {
                                                          await onEnter()
                                                      }}/>
                                </div>
                                <button onClick={async () => {
                                    await onEnter()
                                }}
                                        className="bg-primary-400 hover:bg-primary-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-5 mt-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 dark:text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                                    </svg>
                                </button>
                            </div>
                            {isLoading &&
                                <div className="flex justify-center mt-10">
                                    <Spinner
                                        id="spinner"
                                        color="warning"
                                        className="h-[200px] w-[200px]"/>
                                </div>
                            }
                            <div className="flex justify-end items-center dark:text-white text-sm w-full">
                                {!isLoading && !isExplicitSearching && `Showing ${count} results`}
                            </div>
                            <div
                                className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8"
                            >
                                {listResults?.map((listUser, index) => (
                                    <Card key={index} personData={listUser}
                                          isLast={index === listResults.length - 1}
                                          newLimit={hasNextPage ? () => setPage((prev) => prev + 1) : () => {
                                          }}
                                    />
                                ))}
                            </div>
                        </Container>
                    </div>

                    <div className="order-1">
                        <Sidebar>
                            <Sidebar.Items>
                                <Sidebar.ItemGroup>
                                    <li>
                                        <button type="button"
                                                className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                                aria-controls="dropdown-example"
                                                data-collapse-toggle="dropdown-example">
                                            <svg aria-hidden="true"
                                                 className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                                 fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                                                      clipRule="evenodd"></path>
                                            </svg>
                                            <span
                                                className="flex-1 ml-3 text-left whitespace-nowrap">Basic Filters</span>
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                      clipRule="evenodd"></path>
                                            </svg>
                                        </button>
                                        <ul id="dropdown-example" className="hidden">
                                            <li>
                                                <label htmlFor="concentrations"
                                                       className="block my-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Concentrations</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={concentrationsList}
                                                    defaultText="Select concentrations"
                                                    initialSelected={[]}
                                                    zIndex={50}
                                                    setterFunction={setConcentrationQuery}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="tracks"
                                                       className="block my-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Tracks</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={tracksList}
                                                    defaultText="Select tracks"
                                                    initialSelected={[]}
                                                    zIndex={40}
                                                    setterFunction={setTracksQuery}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="class-years"
                                                       className="block my-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Class Years</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={classYearsList}
                                                    defaultText="Select class years"
                                                    initialSelected={[]}
                                                    zIndex={31}
                                                    setterFunction={setClassYearsQuery}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="residential-colleges"
                                                       className="block my-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Residential Colleges</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={concentrationsList}
                                                    defaultText="Select residential colleges"
                                                    initialSelected={[]}
                                                    zIndex={30}
                                                    setterFunction={setResCollegeQuery}
                                                />
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <button type="button"
                                                className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                                aria-controls="dropdown-example"
                                                data-collapse-toggle="dropdown-example">
                                            <svg aria-hidden="true"
                                                 className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                                 fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                                                      clipRule="evenodd"></path>
                                            </svg>
                                            <span
                                                className="flex-1 ml-3 text-left whitespace-nowrap">Advanced Filters</span>
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                      clipRule="evenodd"></path>
                                            </svg>
                                        </button>
                                        <ul id="dropdown-example" className="hidden">
                                            <li>
                                                <label htmlFor="concentrations"
                                                       className="block my-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Concentrations</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={concentrationsList}
                                                    defaultText="Select concentrations"
                                                    initialSelected={[]}
                                                    zIndex={50}
                                                    setterFunction={setConcentrationQuery}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="tracks"
                                                       className="block my-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Tracks</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={tracksList}
                                                    defaultText="Select tracks"
                                                    initialSelected={[]}
                                                    zIndex={40}
                                                    setterFunction={setTracksQuery}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="class-years"
                                                       className="block my-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Class Years</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={classYearsList}
                                                    defaultText="Select class years"
                                                    initialSelected={[]}
                                                    zIndex={31}
                                                    setterFunction={setClassYearsQuery}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="residential-colleges"
                                                       className="block my-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Residential Colleges</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={resCollegesList}
                                                    defaultText="Select residential colleges"
                                                    initialSelected={[]}
                                                    zIndex={30}
                                                    setterFunction={setResCollegeQuery}
                                                />
                                            </li>
                                        </ul>
                                    </li>
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
                    </div>
                </main>
            </SidebarProvider>
        </>
    );
}

export default List;
