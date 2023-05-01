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
// import {useRouter} from "next/router";
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
    // const listData: Search = axiosResponse.data;

    return {
        props: {
            headerData,
            // listData
        },
    }
};

interface Props {
    headerData: HeaderType
    // listData: Search
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

const Search: React.FC<Props> = ({headerData}) => {
    const [firstQuery, setFirstQuery] = useState('');
    const [additionalQueries, setAdditionalQueries] = useState('');

    const [clearAll, setClearAll] = useState(false);
    const [page, setPage] = useState(1);
    const [listResults, setListResults] = useState<ListUser[]>([]);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isExplicitSearching, setIsExplicitSearching] = useState(false);
    const [count, setCount] = useState(0);
    // const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isEnter, setIsEnter] = useState(false);

    // search queries
    const [concentrationsQuery, setConcentrationsQuery] = useState(null);
    const [tracksQuery, setTracksQuery] = useState(null);
    const [resCollegesQuery, setResCollegesQuery] = useState(null);
    const [classYearsQuery, setClassYearsQuery] = useState(null);
    const [certificatesQuery, setCertificatesQuery] = useState(null);
    const [pronounsQuery, setPronounsQuery] = useState(null);
    const [interestsQuery, setInterestsQuery] = useState(null);
    const [extracurricularsQuery, setExtracurricularsQuery] = useState(null);
    const [extracurricularPositionsQuery, setExtracurricularPositionsQuery] = useState(null);
    const [hometownCompleteCitiesQuery, setHometownCompleteCitiesQuery] = useState([]);
    const [currentCityCompleteCitiesQuery, setCurrentCityCompleteCitiesQuery] = useState([]);

    // search list
    const [concentrationsList, setConcentrationsList] = useState([]);
    const [tracksList, setTracksList] = useState([]);
    const [resCollegesList, setResCollegesList] = useState([]);
    const [classYearsList, setClassYearsList] = useState([]);
    const [certificatesList, setCertificatesList] = useState([]);
    const [pronounsList, setPronounsList] = useState([]);
    const [interestsList, setInterestsList] = useState([]);
    const [extracurricularsList, setExtracurricularsList] = useState([]);
    const [extracurricularPositionsList, setExtracurricularPositionsList] = useState([]);
    const [hometownCompleteCitiesList, setHometownCompleteCitiesList] = useState([]);
    const [currentCityCompleteCitiesList, setCurrentCityCompleteCitiesList] = useState([]);

    console.log('hometowns', currentCityCompleteCitiesList)
    console.log('current cities', hometownCompleteCitiesList)

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
            '/api-django/research-types/',
            '/api-django/cities/',
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

        Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiListAPIRoutes[0]}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiListAPIRoutes[1]}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiListAPIRoutes[2]}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiListAPIRoutes[3]}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiListAPIRoutes[4]}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiListAPIRoutes[5]}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiListAPIRoutes[6]}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiListAPIRoutes[7]}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiListAPIRoutes[8]}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiListAPIRoutes[9]}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiListAPIRoutes[11]}`),
        ])
            .then((responses) => {
                responses.forEach((response, index) => {
                    if (response.data.length === 0) {
                        return
                    }

                    if (index == 11) {
                        setHometownCompleteCitiesList(response.data)
                        setCurrentCityCompleteCitiesList(response.data.slice())
                        return
                    }

                    listData[keys[index]] = response.data.map((item) => item[indices[index]])

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
                    if (index === 4) {
                        setCertificatesList(listData.certificates)
                    }
                    if (index === 5) {
                        setPronounsList(listData.pronouns)
                    }
                    if (index === 6) {
                        setInterestsList(listData.interests)
                    }
                    if (index === 7) {
                        setExtracurricularsList(listData.extracurriculars)
                    }
                    if (index === 8) {
                        setExtracurricularPositionsList(listData.positions)
                    }
                });

            });
    }

    useEffect(() => {
        fetch()
    }, []);


    useEffect(() => {
        let ignore = false;

        async function fetchUserData(explicitQuery) {
            const axios = await axiosInstance();
            let listURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/list/`;
            listURL += `?page=1&${explicitQuery}`;
            console.log('listURL1', listURL)
            const axiosResponse = await axios.get(listURL)
            const listData: List = axiosResponse.data;
            if (!ignore) {
                setIsLoading(false)
                setListResults((prev) => [...prev, ...listData.results]);
                setCount(listData.count)
                setHasNextPage(listData.next !== null);
            }
        }

        async function onSearchFiltering() {
            setIsExplicitSearching(true)
            setIsLoading(true)
            setListResults([])
            let firstEncodedParameterizedQuery = `q=${encodeURIComponent(firstQuery)}`
            let additionalEncodedParameterizedQueries = ''
            // if concentrationsQuery has at least one element, then we need to add it to the query
            if (concentrationsQuery?.length > 0) {
                additionalEncodedParameterizedQueries += `&concentration=`
            }
            concentrationsQuery?.forEach((concentration, index) => {
                if (index !== concentrationsQuery.length - 1) {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(concentration)},`
                } else {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(concentration)}`
                }
            })
            // likewise for tracksQuery
            if (tracksQuery?.length > 0) {
                additionalEncodedParameterizedQueries += `&track=`
            }
            tracksQuery?.forEach((track, index) => {
                if (index !== tracksQuery.length - 1) {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(track)},`
                } else {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(track)}`
                }
            })
            // likewise for classYearsQuery
            if (classYearsQuery?.length > 0) {
                additionalEncodedParameterizedQueries += `&class_year=`
            }
            classYearsQuery?.forEach((class_year, index) => {
                if (index !== classYearsQuery.length - 1) {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(class_year)},`
                } else {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(class_year)}`
                }
            })
            // likewise for resCollegesQuery
            if (resCollegesQuery?.length > 0) {
                additionalEncodedParameterizedQueries += `&residential_college=`
            }
            resCollegesQuery?.forEach((residential_college, index) => {
                if (index !== resCollegesQuery.length - 1) {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(residential_college)},`
                } else {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(residential_college)}`
                }
            })
            // likewise for resCollegesQuery
            if (certificatesQuery?.length > 0) {
                additionalEncodedParameterizedQueries += `&certificates=`
            }
            certificatesQuery?.forEach((certificates, index) => {
                if (index !== certificatesQuery.length - 1) {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(certificates)},`
                } else {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(certificates)}`
                }
            })
            if (pronounsQuery?.length > 0) {
                additionalEncodedParameterizedQueries += `&pronouns=`
            }
            pronounsQuery?.forEach((pronouns, index) => {
                if (index !== pronounsQuery.length - 1) {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(pronouns)},`
                } else {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(pronouns)}`
                }
            })
            if (interestsQuery?.length > 0) {
                additionalEncodedParameterizedQueries += `&interests=`
            }
            interestsQuery?.forEach((interest, index) => {
                if (index !== interestsQuery.length - 1) {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(interest)},`
                } else {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(interest)}`
                }
            })
            if (interestsQuery?.length > 0) {
                additionalEncodedParameterizedQueries += `&interests=`
            }
            interestsQuery?.forEach((interest, index) => {
                if (index !== interestsQuery.length - 1) {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(interest)},`
                } else {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(interest)}`
                }
            })
            if (extracurricularsQuery?.length > 0) {
                additionalEncodedParameterizedQueries += `&extracurriculars=`
            }
            extracurricularsQuery?.forEach((extracurricular, index) => {
                if (index !== extracurricularsQuery.length - 1) {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(extracurricular)},`
                } else {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(extracurricular)}`
                }
            })
            if (extracurricularPositionsQuery?.length > 0) {
                additionalEncodedParameterizedQueries += `&extracurricular_positions=`
            }
            extracurricularPositionsQuery?.forEach((extracurricularPosition, index) => {
                if (index !== extracurricularPositionsQuery.length - 1) {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(extracurricularPosition)},`
                } else {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(extracurricularPosition)}`
                }
            })
            if (hometownCompleteCitiesQuery?.length > 0) {
                additionalEncodedParameterizedQueries += `&hometown_complete_city=`
            }
            hometownCompleteCitiesQuery?.forEach((hometown, index) => {
                if (index !== hometownCompleteCitiesQuery.length - 1) {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(hometown)},`
                } else {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(hometown)}`
                }
            })
            if (currentCityCompleteCitiesQuery?.length > 0) {
                additionalEncodedParameterizedQueries += `&current_city_complete_city=`
            }
            currentCityCompleteCitiesQuery?.forEach((currentCity, index) => {
                if (index !== currentCityCompleteCitiesQuery.length - 1) {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(currentCity)},`
                } else {
                    additionalEncodedParameterizedQueries += `${encodeURIComponent(currentCity)}`
                }
            })
            // await router.push(`/list?${firstEncodedParameterizedQuery}${additionalEncodedParameterizedQueries}`)
            if (!ignore) {
                setPage(1)
                setAdditionalQueries(additionalEncodedParameterizedQueries)
                await fetchUserData(firstEncodedParameterizedQuery.concat(additionalEncodedParameterizedQueries))
                setIsExplicitSearching(false)
            }
        }

        onSearchFiltering()

        return () => {
            ignore = true;
        };
    }, [concentrationsQuery, tracksQuery, classYearsQuery, resCollegesQuery, certificatesQuery, pronounsQuery,
        interestsQuery, extracurricularsQuery, extracurricularPositionsQuery, hometownCompleteCitiesQuery,
        currentCityCompleteCitiesQuery]);

    useEffect(() => {
        let ignore = false;

        async function fetchUserData(explicitQuery) {
            const axios = await axiosInstance();
            let listURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/list/`;
            listURL += `?page=1&${explicitQuery}`;
            console.log('listURL2', listURL)
            const axiosResponse = await axios.get(listURL)
            const listData: List = axiosResponse.data;
            if (!ignore) {
                setListResults((prev) => [...prev, ...listData.results]);
                setCount(listData.count)
                setHasNextPage(listData.next !== null)
                setIsLoading(false)
            }
        }

        async function onEnter() {
            setIsExplicitSearching(true)
            setIsLoading(true)
            setListResults([])
            let firstEncodedParameterizedQuery = `q=${encodeURIComponent(firstQuery)}`
            if (!ignore) {
                setPage(1)
                await fetchUserData(firstEncodedParameterizedQuery.concat(additionalQueries))
                setIsExplicitSearching(false)
            }
        }

        onEnter()


        return () => {
            ignore = true;
        };
    }, [isEnter, firstQuery]);


    useEffect(() => {
        let ignore = false;

        async function fetchSearchData() {
            const axios = await axiosInstance();
            let listURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/list/?page=${page}`;
            listURL += `${firstQuery}${additionalQueries}`
            console.log('SearchURL', listURL)
            const axiosResponse = await axios.get(listURL)
            const listData: List = axiosResponse.data;
            setIsLoading(true)
            if (!ignore) {
                setListResults((prev) => [...prev, ...listData.results]);
                setCount(listData.count)
                setHasNextPage(listData.next !== null);
                setIsLoading(false)
            }
        }

        if (isExplicitSearching) return;
        fetchSearchData();

        return () => {
            ignore = true;
        };
    }, [page]);

    function clearAllFilters() {
        // set all queries to empty
        setTracksQuery([])
        setConcentrationsQuery([])
        setClassYearsQuery([])
        setResCollegesQuery([])
        setCertificatesQuery([])
        setPronounsQuery([])
        setInterestsQuery([])
        setExtracurricularsQuery([])
        setExtracurricularPositionsQuery([])
        setClearAll(true)
    }

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
                                                      zIndex={100} setterFunction={setFirstQuery}
                                                      autoComplete="off"
                                                      onEnterFunction={() => setIsEnter(true)}/>
                                </div>
                                <button onClick={() => setIsEnter(true)}
                                        className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-md focus:outline-none active:bg-primary-700 focus:ring focus:ring-primary-300 mt-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 dark:text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex justify-end items-center dark:text-white text-sm w-full mt-1">
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
                            {hasNextPage &&
                                <div className="flex justify-center mt-10">
                                    <Spinner
                                        id="spinner"
                                        color="warning"
                                        className="h-[200px] w-[200px]"/>
                                </div>
                            }
                        </Container>
                    </div>

                    <div className="order-1">
                        <Sidebar>
                            <Sidebar.Items>
                                <Sidebar.ItemGroup>
                                    <div
                                        className="block ml-2 text-sm text-white bg-primary-500 px-4 py-0.5 mb-2 rounded-xl hover:bg-primary-600 cursor-pointer text-center active:bg-primary-700 focus:outline-none focus:ring focus:ring-primary-300"
                                        onClick={clearAllFilters}>
                                        Clear All Filters
                                    </div>
                                    <li>
                                        <button type="button"
                                                className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                                aria-controls="dropdown-1"
                                                data-collapse-toggle="dropdown-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor"
                                                 className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"/>
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
                                        <ul id="dropdown-1" className="hidden">
                                            <li>
                                                <label htmlFor="concentrations"
                                                       className="block my-1 ml-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Concentrations</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={concentrationsList}
                                                    defaultText="Select concentrations"
                                                    initialSelected={[]}
                                                    zIndex={50}
                                                    setterFunction={setConcentrationsQuery}
                                                    className="ml-1"
                                                    clearState={clearAll}
                                                    clearStateFunction={setClearAll}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="tracks"
                                                       className="block my-1 ml-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Tracks</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={tracksList}
                                                    defaultText="Select tracks"
                                                    initialSelected={[]}
                                                    zIndex={40}
                                                    setterFunction={setTracksQuery}
                                                    className="ml-1"
                                                    clearState={clearAll}
                                                    clearStateFunction={setClearAll}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="class-years"
                                                       className="block my-1 ml-1 text-sm font-medium text-gray-900 dark:text-white pl-1">
                                                    Class
                                                    Years</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={classYearsList}
                                                    defaultText="Select class years"
                                                    initialSelected={[]}
                                                    zIndex={31}
                                                    setterFunction={setClassYearsQuery}
                                                    className="ml-1"
                                                    clearState={clearAll}
                                                    clearStateFunction={setClearAll}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="residential-colleges"
                                                       className="block my-1 ml-1 text-sm font-medium text-gray-900 dark:text-white pl-1">
                                                    Residential Colleges
                                                </label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={resCollegesList}
                                                    defaultText="Select residential colleges"
                                                    initialSelected={[]}
                                                    zIndex={30}
                                                    setterFunction={setResCollegesQuery}
                                                    className="ml-1 mb-2"
                                                    clearState={clearAll}
                                                    clearStateFunction={setClearAll}
                                                />
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <button type="button"
                                                className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                                aria-controls="dropdown-2"
                                                data-collapse-toggle="dropdown-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor"
                                                 className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"/>
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
                                        <ul id="dropdown-2" className="hidden">
                                            <li>
                                                <label htmlFor="certificates"
                                                       className="block my-1 ml-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Certificates</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={certificatesList}
                                                    defaultText="Select certificates"
                                                    initialSelected={[]}
                                                    zIndex={29}
                                                    setterFunction={setCertificatesQuery}
                                                    className="ml-1"
                                                    clearState={clearAll}
                                                    clearStateFunction={setClearAll}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="pronouns"
                                                       className="block my-1 ml-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Pronouns</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={pronounsList}
                                                    defaultText="Select pronouns"
                                                    initialSelected={[]}
                                                    zIndex={28}
                                                    setterFunction={setPronounsQuery}
                                                    className="ml-1"
                                                    clearState={clearAll}
                                                    clearStateFunction={setClearAll}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="interests"
                                                       className="block my-1 ml-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Interests</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={interestsList}
                                                    defaultText="Select interests"
                                                    initialSelected={[]}
                                                    zIndex={27}
                                                    setterFunction={setInterestsQuery}
                                                    className="ml-1"
                                                    clearState={clearAll}
                                                    clearStateFunction={setClearAll}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="extracurriculars"
                                                       className="block my-1 ml-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Extracurriculars</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={extracurricularsList}
                                                    defaultText="Select extracurriculars"
                                                    initialSelected={[]}
                                                    zIndex={26}
                                                    setterFunction={setExtracurricularsQuery}
                                                    className="ml-1"
                                                    clearState={clearAll}
                                                    clearStateFunction={setClearAll}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="extracurricular-positions"
                                                       className="block my-1 ml-1 text-sm font-medium text-gray-900 dark:text-white pl-1">Extracurricular
                                                    Positions</label>
                                                <TigerBookComboBoxMultipleStrictSelect
                                                    data={extracurricularPositionsList}
                                                    defaultText="Select extracurricular positions"
                                                    initialSelected={[]}
                                                    zIndex={25}
                                                    setterFunction={setExtracurricularPositionsQuery}
                                                    className="ml-1"
                                                    clearState={clearAll}
                                                    clearStateFunction={setClearAll}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="hometown"
                                                       className="block my-1 ml-1 text-sm font-medium text-gray-900 dark:text-white pl-1">
                                                    Hometown</label>
                                                <TigerBookComboBoxSingleStrictSelect
                                                    data={hometownCompleteCitiesList}
                                                    defaultText="Select hometown"
                                                    initialSelected={null}
                                                    zIndex={25}
                                                    setterFunction={setHometownCompleteCitiesQuery}
                                                    className="ml-1"
                                                    clearState={clearAll}
                                                    clearStateFunction={setClearAll}
                                                    defaultOptionText={undefined}
                                                />
                                            </li>
                                            <li>
                                                <label htmlFor="current-city"
                                                       className="block my-1 ml-1 text-sm font-medium text-gray-900 dark:text-white pl-1">
                                                    Current City</label>
                                                <TigerBookComboBoxSingleStrictSelect
                                                    data={currentCityCompleteCitiesList}
                                                    defaultText="Select current city"
                                                    initialSelected={null}
                                                    zIndex={25}
                                                    setterFunction={setCurrentCityCompleteCitiesQuery}
                                                    className="ml-1"
                                                    clearState={clearAll}
                                                    clearStateFunction={setClearAll}
                                                    defaultOptionText={undefined}
                                                />
                                            </li>
                                        </ul>
                                    </li>
                                </Sidebar.ItemGroup>
                            </Sidebar.Items>
                        </Sidebar>
                    </div>
                </main>
            </SidebarProvider>
        </>
    );
}

export default Search;
