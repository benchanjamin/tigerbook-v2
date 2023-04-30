import Image from "next/image";
import React, {useContext, useEffect, useReducer, useState} from "react";
import {GetServerSideProps} from "next";
import {
    Extracurricular,
    FullProfileEditGet,
    FullProfileEditPost,
    HeaderType,
    Miscellaneous,
    Research,
    SetupOneGet,
    SetupTwoPost
} from "@types/types";
import {axiosLocalhost, axiosInstance} from "@utils/axiosInstance";
import {AxiosResponse} from "axios";
import TigerBookListBox from "@components/headless-ui/TigerBookListBox";
import TigerBookComboBoxSingleStrictSelect from "@components/headless-ui/TigerBookComboBoxSingleStrictSelect";
import TigerBookComboBoxMultipleFFASelect from "@components/headless-ui/TigerBookComboBoxMultipleFFASelect";
import Header from "@components/ui/Header";
import {SidebarProvider} from "@context/SidebarContext";
import TigerBookComboBoxMultipleStrictSelect from "@components/headless-ui/TigerBookComboBoxMultipleStrictSelect";
import {useRouter} from 'next/navigation'
import NotificationContext from "@context/NotificationContext";
import {Spinner} from "flowbite-react";
import ImageUploadProfileEdit from "@components/file-upload/ImageUploadProfileEdit";
import TigerBookFFABar from "@components/headless-ui/TigerBookFFABar";
import {Switch} from "@headlessui/react";


interface ServerSideProps {
    data: SetupOneGet;
    concentrations: string[]
    tracks: string[]
    residentialColleges: string[]
    classYears: string[]
    cities: string[]
    pronouns: string[]
    certificates: string[]
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({req}) => {
    let REDIRECT_ERROR = 0
    const axios = await axiosLocalhost();
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
    const data: FullProfileEditGet = axiosResponse.data;

    axiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/header/`,
        {
            headers: {
                Cookie: req.headers.cookie
            }
        })
    const headerData: HeaderType = axiosResponse.data;

    const apiListAPIRoutes = [
        '/api-django/concentrations/',
        '/api-django/tracks/',
        '/api-django/residential-colleges/',
        '/api-django/class-years/',
        // '/api-django/cities/',
        '/api-django/certificates/',
        '/api-django/pronouns/',
        '/api-django/interests/',
        '/api-django/extracurriculars/',
        '/api-django/extracurricular-positions/',
        '/api-django/housing/',
        '/api-django/research-types/'
    ]

    const keys = [
        'concentrations',
        'tracks',
        'residentialColleges',
        'classYears',
        // 'cities',
        'certificates',
        'pronouns',
        'interests',
        'extracurriculars',
        'positions',
        'completeHousing',
        'researchTypes'
    ]

    const indices = [
        'concentration',
        'track',
        'residential_college',
        'class_year',
        // 'complete_city',
        'certificate',
        'pronouns',
        'interest',
        'extracurricular',
        'position',
        'complete_housing',
        'research_type'
    ]

    const listData = {}

    for (const [index, apiRoute] of apiListAPIRoutes.entries()) {
        const axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}${apiRoute}`, {
            headers: {
                Cookie: req.headers.cookie
            }
        })
        console.log('incoming', axiosResponse.data)
        if (axiosResponse.data.length === 0) {
            continue
        }
        listData[keys[index]] = axiosResponse.data.map((item) => item[indices[index]])
    }

    return {
        props: {
            data,
            headerData,
            ...listData,
        },
    }
};

type Props = {
    data: FullProfileEditGet
    headerData: HeaderType
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

const reducer = (prev: Permissions, next: Permissions) => {
    return {...prev, ...next};
}

const ProfileEdit: React.FC<Props> = ({
                                          data, headerData, concentrations,
                                          tracks, residentialColleges,
                                          classYears, pronouns, certificates,
                                          interests, extracurriculars, positions, completeHousing,
                                          researchTypes
                                      }) => {
    const context = useContext(NotificationContext);
    const router = useRouter()
    const [hometowns, setHometowns] = useState([]);
    const [currentCities, setCurrentCities] = useState([]);

    const [myConcentration, setMyConcentration] = useState(data.concentration);
    const [myTrack, setMyTrack] = useState(data.track);
    const [myResidentialCollege, setMyResidentialCollege] = useState(data.residential_college);
    const [myClassYear, setMyClassYear] = useState(data.class_year);
    const [myHometown, setMyHometown] = useState(data.hometown);
    const [myPronouns, setMyPronouns] = useState(data.pronouns);
    const [myCertificates, setMyCertificates] = useState<string[] | null>(data.certificates);
    const [myAliases, setMyAliases] = useState<string[] | null>(data.aliases);
    const [myCurrentCity, setMyCurrentCity] = useState(data.current_city);
    const [myCurrentHousing, setMyCurrentHousing] = useState(data.housing);
    const [myInterests, setMyInterests] = useState(data.interests);
    const [myExtracurriculars, setMyExtracurriculars] = useState<null | Extracurricular[]>(data.extracurriculars === null ? []
        : data.extracurriculars);
    const [myMiscellaneous, setMyMiscellaneous] = useState<null | Miscellaneous[]>(data.miscellaneous === null
        ? [] : data.miscellaneous);
    const [myResearch, setMyResearch] = useState<null | Research[]>(data.research === null
        ? [] : data.research);

    const [files, setFiles] = useState([]);
    const [changePhoto, setChangePhoto] = useState(false);
    const [changePermissions, setChangePermissions] = useState(false);

    const [myPermissions, updateMyPermissions]: [myPermissions: Permissions] =
        useReducer(reducer, data.permissions);

    const [isImageReady, setIsImageReady] = useState(false);

    async function fetch() {
        const axios = await axiosInstance()
        const axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/cities/`)
        console.log('completed fetch')
        setHometowns(axiosResponse.data)
        setCurrentCities(axiosResponse.data.slice())
    }

    useEffect(() => {
        fetch()
    }, []);


    const onLoadCallBack = () => {
        setIsImageReady(true)
        document.getElementById('spinner').classList.add("hidden")
        document.getElementById('height-adjustment')
            .classList.add("opacity-100", "transition-opacity", "duration-1000", "block", "h-[200px]", "w-[200px]")
    }

    console.log("data", data)

    async function submitHandler(event) {
        event.preventDefault();
        const postData: FullProfileEditPost = {
            certificates: myCertificates,
            concentration: myConcentration,
            track: myTrack,
            residential_college: myResidentialCollege,
            class_year: myClassYear,
            hometown: myHometown,
            pronouns: myPronouns,
            aliases: myAliases,
            current_city: myCurrentCity,
            extracurriculars: myExtracurriculars,
            housing: myCurrentHousing,
            interests: myInterests,
            miscellaneous: myMiscellaneous,
            research: myResearch,
        }

        if (changePermissions) {
            postData.permissions = myPermissions
        }

        console.log(postData)

        let RESPONSE_ERROR = 0
        const axios = await axiosLocalhost();

        if (files.length == 0 && changePhoto) {
            context.showNotification({
                description: String("No file selected to save"),
            })
            return;
        }

        let formData: SetupTwoPost = new FormData()
        if (changePhoto && files.length > 0) {
            formData.append('profile_pic', files[0], 'profile_pic')
        } else if (changePhoto && files.length == 0) {
            formData.append('profile_pic', null, 'profile_pic')
        }

        // // TODO: Change this to the actual endpoint
        let axiosResponse: AxiosResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/undergraduate/profile/edit/`,
            postData
        ).then((response) => {
            if (response.ok) {
                return response
            }
        })
            .catch((error) => {
                RESPONSE_ERROR = 1
                const errorObject = error.response.data
                let errorString = errorObject == undefined ? error.message : ''
                for (const property in errorObject) {
                    errorString = errorString + `${property}: ${errorObject[property]}\n`;
                }
                context.showNotification({
                    description: String(errorString),
                })
            })

        if (changePhoto) {
            axiosResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/undergraduate/profile/setup/two/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).then((response) => {
                if (response.ok) {
                    return response
                }
            })
                .catch((error) => {
                    RESPONSE_ERROR = 1
                    const errorObject = error.response.data
                    let errorString = errorObject == undefined ? error.message : ''
                    for (const property in errorObject) {
                        errorString = errorString + `${property}: ${errorObject[property]}\n`;
                    }
                    context.showNotification({
                        description: String(errorString),
                    })
                })


        }
        console.log(axiosResponse)
        if (RESPONSE_ERROR === 0) {
            await router.push('/profile/preview')
        }
    }

    function addExtracurricular() {
        setMyExtracurriculars([...myExtracurriculars,
            {
                "extracurricular": "",
                "positions": [],
            }
        ])
    }

    function addResearch() {
        setMyResearch([...myResearch,
            {
                "research_type": "",
                "research_title": "",
            }
        ])
    }


    function addMiscellaneous() {
        setMyMiscellaneous([...myMiscellaneous,
            {
                "miscellaneous_title": "",
                "miscellaneous_description": "",
            }
        ])
    }

    function removeExtracurricular(index) {
        let newFormValues = [...myExtracurriculars];
        newFormValues.splice(index, 1);
        setMyExtracurriculars(newFormValues)
    }

    function removeResearch(index) {
        let newFormValues = [...myResearch];
        newFormValues.splice(index, 1);
        setMyResearch(newFormValues)
    }

    function removeMiscellaneous(index) {
        let newFormValues = [...myMiscellaneous];
        newFormValues.splice(index, 1);
        setMyMiscellaneous(newFormValues)
    }

    function setExtracurricularActivity(index, value) {
        let newFormValues = [...myExtracurriculars];
        newFormValues[index].extracurricular = value;
        setMyExtracurriculars(newFormValues)
    }

    function setResearchType(index, value) {
        let newFormValues = [...myResearch];
        newFormValues[index].research_type = value;
        setMyResearch(newFormValues)
    }

    function setMiscellaneousTitle(index, value) {
        let newFormValues = [...myMiscellaneous];
        console.log(newFormValues, index)
        newFormValues[index].miscellaneous_title = value;
        setMyMiscellaneous(newFormValues)
    }

    function setExtracurricularPositions(index, value) {
        let newFormValues = [...myExtracurriculars];
        newFormValues[index].positions = value;
        setMyExtracurriculars(newFormValues)
    }


    function setResearchTitle(index, value) {
        let newFormValues = [...myResearch];
        newFormValues[index].research_title = value;
        setMyResearch(newFormValues)
    }

    function setMiscellaneousDescription(index, value) {
        let newFormValues = [...myMiscellaneous];
        newFormValues[index].miscellaneous_description = value;
        setMyMiscellaneous(newFormValues)
    }

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
                    className="w-[90%] bg-white m-2 p-6 dark:bg-gray-900 z-10 lg:w-[50%] rounded-2xl relative shadow-2xl">
                    <div className="px-4 py-2 text-center mx-auto max-w-2xl ">
                        <h1 className="text-2xl mb-2 font-bold dark:text-white">
                            Edit Your Profile
                        </h1>
                    </div>
                    {headerData.profile_pic_url !== null ?
                        (<div className="flex relative justify-center items-center w-full">
                            {!isImageReady &&
                                <Spinner
                                    id="spinner"
                                    color="warning"
                                    className="h-[200px] w-[200px]"/>}
                            <div id='height-adjustment' className="relative opacity-0">
                                <Image src={headerData.profile_pic_url}
                                       alt={`Photo of ${headerData.username}`}
                                       onLoad={onLoadCallBack}
                                       className="border-2 border-primary-100 dark:border-opacity-50 rounded-2xl"
                                       fill
                                       style={{objectFit: "cover"}}
                                />
                            </div>
                        </div>)
                        :
                        (<div className="flex relative justify-center items-center w-full ">
                            {!isImageReady &&
                                <Spinner
                                    id="spinner"
                                    color="warning"
                                    className="h-[200px] w-[200px]"/>}
                            <div id='height-adjustment' className="relative opacity-0">
                                <Image src="/static/placeholder.jpg"
                                       alt="placeholder"
                                       className="border-2 border-primary-100 dark:border-opacity-50 rounded-2xl"
                                       onLoad={onLoadCallBack}
                                       fill
                                       style={{objectFit: "cover"}}
                                />
                            </div>
                        </div>)
                    }
                    <div className="flex flex-col justify-center items-center mt-2">
                        {!changePhoto && <div
                            className="inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-primary-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-600 cursor-pointer"
                            onClick={() => setChangePhoto((prev) => !prev)}>
                            Change Photo
                        </div>}
                        {changePhoto && <div
                            className="inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-primary-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-600 cursor-pointer"
                            onClick={() => setChangePhoto((prev) => !prev)}>
                            Keep Photo
                        </div>}
                        {changePhoto && <div className="px-4 py-2 mx-auto max-w-2xl">
                            <ImageUploadProfileEdit data={data}
                                                    files={files}
                                                    setFiles={setFiles}/>
                        </div>}
                    </div>
                    <div className="sm:px-4 mx-auto max-w-2xl">
                        <h2 className="mb-4 mt-2 text-xl font-bold text-gray-900 dark:text-white">Biographical
                            Information</h2>
                        <form onSubmit={submitHandler}>
                            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                <div className="sm:col-span-2">
                                    <label htmlFor="name"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nickname(s)</label>
                                    <TigerBookComboBoxMultipleFFASelect
                                        setterValue={myAliases}
                                        setterFunction={setMyAliases}
                                        zIndex={50}
                                        placeholder="Add nicknames"
                                        dropdownDefaultDescription="Add nickname"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="concentration"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Concentration{' '}
                                        <abbr title="Required field">*</abbr>
                                    </label>
                                    <TigerBookListBox data={concentrations}
                                                      initialSelected={myConcentration}
                                                      zIndex={40}
                                                      setterFunction={setMyConcentration}
                                                      defaultText={"Select myConcentration"}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="track"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Track
                                        {' '}
                                        <abbr title="Required field">*</abbr>
                                    </label>
                                    <TigerBookListBox data={tracks}
                                                      initialSelected={myTrack}
                                                      zIndex={31}
                                                      setterFunction={setMyTrack}
                                                      defaultText={"Select myTrack"}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="residential college"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Residential
                                        College
                                        {' '}
                                        <abbr title="Required field">*</abbr>
                                    </label>
                                    <TigerBookListBox data={residentialColleges}
                                                      initialSelected={myResidentialCollege}
                                                      defaultText={"Select residential college"}
                                                      zIndex={30}
                                                      setterFunction={setMyResidentialCollege}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="category"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Class
                                        Year
                                        {' '}
                                        <abbr title="Required field">*</abbr>
                                    </label>
                                    <TigerBookListBox data={classYears}
                                                      defaultText="Select class year"
                                                      zIndex={29}
                                                      initialSelected={myClassYear}
                                                      setterFunction={setMyClassYear}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="category"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pronouns</label>
                                    <TigerBookComboBoxSingleStrictSelect
                                        data={pronouns}
                                        defaultText="Select pronouns"
                                        initialSelected={myPronouns}
                                        zIndex={28}
                                        setterFunction={setMyPronouns}
                                        defaultOptionText="I am not adding pronouns"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="hometown"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hometown
                                    </label>
                                    <TigerBookComboBoxSingleStrictSelect
                                        data={hometowns}
                                        defaultText="Select hometown"
                                        initialSelected={myHometown}
                                        zIndex={27}
                                        defaultOptionText="I am not adding my hometown"
                                        setterFunction={setMyHometown}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="interests"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Interests
                                    </label>
                                    <TigerBookComboBoxMultipleStrictSelect
                                        data={interests}
                                        initialSelected={myInterests}
                                        zIndex={26}
                                        setterFunction={setMyInterests}
                                        defaultText='Add interests'/>
                                </div>

                                <div>
                                    <label htmlFor="current-city"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Current City
                                    </label>
                                    <TigerBookComboBoxSingleStrictSelect
                                        data={currentCities}
                                        defaultText="Select current city"
                                        initialSelected={myCurrentCity}
                                        zIndex={25}
                                        defaultOptionText="I am not adding my current city"
                                        setterFunction={setMyCurrentCity}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="housing"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Housing Room
                                    </label>
                                    <TigerBookComboBoxSingleStrictSelect
                                        data={completeHousing}
                                        defaultText="Select housing room"
                                        initialSelected={myCurrentHousing}
                                        zIndex={24}
                                        defaultOptionText="I am not adding my housing room"
                                        setterFunction={setMyCurrentHousing}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="certificates"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Certificates
                                    </label>
                                    <TigerBookComboBoxMultipleStrictSelect
                                        data={certificates}
                                        initialSelected={myCertificates}
                                        zIndex={23}
                                        setterFunction={setMyCertificates}
                                        defaultText='Add prospective certificates'/>
                                </div>


                                {myExtracurriculars?.map((extracurricular, index) => (
                                    <>
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label htmlFor="extracurricular-activity"
                                                       className="block text-sm font-medium text-gray-900 dark:text-white">
                                                    Extracurricular Activity #{index + 1}{' '}
                                                    <abbr title="Required field">*</abbr>

                                                </label>
                                                <div
                                                    className="block ml-2 text-sm text-white bg-red-500 px-4 py-0.5 rounded-xl cursor-pointer"
                                                    onClick={() => removeExtracurricular(index)}>Remove
                                                </div>
                                            </div>
                                            <TigerBookComboBoxSingleStrictSelect
                                                data={extracurriculars}
                                                defaultText="Select extracurricular activity"
                                                initialSelected={extracurricular.extracurricular}
                                                zIndex={22}
                                                defaultOptionText={undefined}
                                                setterFunction={(value: string) => {
                                                    setExtracurricularActivity(index, value)
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="extracurricular-positions"
                                                   className="block mb-3 text-sm font-medium text-gray-900 dark:text-white">
                                                Extracurricular Position(s) #{index + 1}
                                            </label>
                                            <TigerBookComboBoxMultipleStrictSelect
                                                data={positions}
                                                defaultText="Select extracurricular position"
                                                initialSelected={extracurricular.positions}
                                                zIndex={21}
                                                defaultOptionText={undefined}
                                                setterFunction={(value: string[]) => {
                                                    setExtracurricularPositions(index, value)
                                                }}
                                            />
                                        </div>

                                    </>))}
                                <div className="sm:col-span-2 mx-auto">
                                    <div className="flex justify-content">
                                        <div
                                            onClick={addExtracurricular}
                                            className="inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-primary-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-600 cursor-pointer"
                                        >
                                            Add Extracurricular Activity
                                        </div>
                                    </div>
                                </div>

                                {myResearch?.map((research, index) => (
                                    <>
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label htmlFor="research-type"
                                                       className="block text-sm font-medium text-gray-900 dark:text-white">
                                                    Research Type #{index + 1}{' '}
                                                    <abbr title="Required field">*</abbr>

                                                </label>
                                                <div
                                                    className="block ml-2 text-sm text-white bg-red-500 px-4 py-0.5 rounded-xl cursor-pointer"
                                                    onClick={() => removeResearch(index)}>Remove
                                                </div>
                                            </div>
                                            <TigerBookComboBoxSingleStrictSelect
                                                data={researchTypes}
                                                defaultText="Select research type"
                                                initialSelected={research.research_type}
                                                zIndex={20}
                                                defaultOptionText={undefined}
                                                setterFunction={(value: string) => {
                                                    setResearchType(index, value)
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="research-title"
                                                   className="block mb-3 text-sm font-medium text-gray-900 dark:text-white">
                                                Research Title #{index + 1}{' '}
                                                <abbr title="Required field">*</abbr>
                                            </label>
                                            <TigerBookFFABar
                                                defaultText="Add research title"
                                                initialSelected={research.research_title}
                                                zIndex={19}
                                                defaultOptionText={undefined}
                                                setterFunction={(value: string[]) => {
                                                    setResearchTitle(index, value)
                                                }}
                                            />
                                        </div>

                                    </>))}
                                <div className="sm:col-span-2 mx-auto">
                                    <div className="flex justify-content">
                                        <div
                                            onClick={addResearch}
                                            className="inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-primary-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-600 cursor-pointer"
                                        >
                                            Add Research
                                        </div>
                                    </div>
                                </div>

                                {myMiscellaneous?.map((miscellaneous, index) => (
                                    <>
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label htmlFor="miscellaneous-title"
                                                       className="block text-sm font-medium text-gray-900 dark:text-white">
                                                    Miscellaneous Title #{index + 1}{' '}
                                                    <abbr title="Required field">*</abbr>
                                                </label>
                                                <div
                                                    className="block ml-2 text-sm text-white bg-red-500 px-4 py-0.5 rounded-xl cursor-pointer"
                                                    onClick={() => removeMiscellaneous(index)}>Remove
                                                </div>
                                            </div>
                                            <TigerBookFFABar
                                                zIndex={18}
                                                defaultText='Add Miscellaneous Title'
                                                initialSelected={miscellaneous.miscellaneous_title}
                                                setterFunction={(value: string) => setMiscellaneousTitle(index, value)}/>
                                        </div>

                                        <div>
                                            <label htmlFor="miscellaneous-description"
                                                   className="block mb-3 text-sm font-medium text-gray-900 dark:text-white">
                                                Miscellaneous Description #{index + 1}{' '}
                                                <abbr title="Required field">*</abbr>
                                            </label>
                                            <TigerBookFFABar
                                                initialSelected={miscellaneous.miscellaneous_description}
                                                zIndex={17}
                                                defaultText='Add Miscellaneous Description'
                                                setterFunction={(value: string) => setMiscellaneousDescription(index, value)}/>
                                        </div>
                                    </>))}

                                <div className="sm:col-span-2 mx-auto">
                                    <div className="flex justify-content">
                                        <div
                                            onClick={addMiscellaneous}
                                            className="inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-primary-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-600 cursor-pointer"
                                        >
                                            Add Miscellaneous Item
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="flex flex-col justify-center items-center mt-10">
                                {!changePermissions && <div
                                    className="inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-primary-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-600 cursor-pointer"
                                    onClick={() => setChangePermissions((prev) => !prev)}>
                                    Change Permissions
                                </div>}
                                {changePermissions && <div
                                    className="inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-primary-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-600 cursor-pointer"
                                    onClick={() => setChangePermissions((prev) => !prev)}>
                                    Keep Permissions
                                </div>}
                            </div>

                            {changePermissions &&
                                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 mt-4 justify-center items-center">
                                    <div>
                                        <span className="dark:text-white mr-2">Visible to Undergraduates</span>
                                        <Switch
                                            checked={myPermissions['is_visible_to_undergrads']}
                                            onChange={(event) => {
                                                updateMyPermissions({is_visible_to_undergrads: event})
                                            }}
                                            className={`${
                                                myPermissions['is_visible_to_undergrads'] ? 'bg-primary-500' : 'bg-gray-200'
                                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                                        >
                                            <span className="sr-only">Enable notifications</span>
                                            <span
                                                className={`${
                                                    myPermissions['is_visible_to_undergrads'] ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                            />
                                        </Switch>
                                    </div>
                                    <div>
                                        <span className="dark:text-white mr-2">Visible to Faculty</span>
                                        <Switch
                                            checked={myPermissions['is_visible_to_faculty']}
                                            onChange={(event) => {
                                                updateMyPermissions({is_visible_to_faculty: event})
                                            }}
                                            className={`${
                                                myPermissions['is_visible_to_faculty'] ? 'bg-primary-500' : 'bg-gray-200'
                                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                                        >
                                            <span className="sr-only">Enable notifications</span>
                                            <span
                                                className={`${
                                                    myPermissions['is_visible_to_faculty'] ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                            />
                                        </Switch>
                                    </div>
                                    <div>
                                        <span className="dark:text-white mr-2">Visible to Service Accounts</span>
                                        <Switch
                                            checked={myPermissions['is_visible_to_service_accounts']}
                                            onChange={(event) => {
                                                updateMyPermissions({is_visible_to_service_accounts: event})
                                            }}
                                            className={`${
                                                myPermissions['is_visible_to_service_accounts'] ? 'bg-primary-500' : 'bg-gray-200'
                                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                                        >
                                            <span className="sr-only">Enable notifications</span>
                                            <span
                                                className={`${
                                                    myPermissions['is_visible_to_service_accounts'] ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                            />
                                        </Switch>
                                    </div>
                                    <div>
                                        <span className="dark:text-white mr-2">Visible to Graduate Students</span>
                                        <Switch
                                            checked={myPermissions['is_visible_to_graduate_students']}
                                            onChange={(event) => {
                                                updateMyPermissions({is_visible_to_graduate_students: event})
                                            }}
                                            className={`${
                                                myPermissions['is_visible_to_graduate_students'] ? 'bg-primary-500' : 'bg-gray-200'
                                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                                        >
                                            <span className="sr-only">Enable notifications</span>
                                            <span
                                                className={`${
                                                    myPermissions['is_visible_to_graduate_students'] ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                            />
                                        </Switch>
                                    </div>
                                    <div>
                                        <span className="dark:text-white mr-2">Visible to Staff</span>
                                        <Switch
                                            checked={myPermissions['is_visible_to_staff']}
                                            onChange={(event) => {
                                                updateMyPermissions({is_visible_to_staff: event})
                                            }}
                                            className={`${
                                                myPermissions['is_visible_to_staff'] ? 'bg-primary-500' : 'bg-gray-200'
                                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                                        >
                                            <span className="sr-only">Enable notifications</span>
                                            <span
                                                className={`${
                                                    myPermissions['is_visible_to_staff'] ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                            />
                                        </Switch>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Profile at All</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['username_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({username_prohibited_usernames: event})
                                            }}
                                            zIndex={16}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Profile Picture</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['profile_pic_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({profile_pic_prohibited_usernames: event})
                                            }}
                                            zIndex={15}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Track</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['track_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({track_prohibited_usernames: event})
                                            }}
                                            zIndex={14}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Concentration</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['concentration_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({concentration_prohibited_usernames: event})
                                            }}
                                            zIndex={13}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Class Year</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['class_year_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({class_year_prohibited_usernames: event})
                                            }}
                                            zIndex={12}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Residential College</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['residential_college_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({residential_college_prohibited_usernames: event})
                                            }}
                                            zIndex={11}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Housing</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['housing_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({housing_prohibited_usernames: event})
                                            }}
                                            zIndex={10}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Nickname(s)</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['aliases_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({aliases_prohibited_usernames: event})
                                            }}
                                            zIndex={9}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Pronouns</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['pronouns_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({pronouns_prohibited_usernames: event})
                                            }}
                                            zIndex={8}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Certificates</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['certificates_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({certificates_prohibited_usernames: event})
                                            }}
                                            zIndex={7}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Hometown</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['hometown_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({hometown_prohibited_usernames: event})
                                            }}
                                            zIndex={6}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Current City</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['current_city_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({current_city_prohibited_usernames: event})
                                            }}
                                            zIndex={5}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Interests</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['interests_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({interests_prohibited_usernames: event})
                                            }}
                                            zIndex={4}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Extracurriculars</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['extracurriculars_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({extracurriculars_prohibited_usernames: event})
                                            }}
                                            zIndex={3}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Research</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['research_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({research_prohibited_usernames: event})
                                            }}
                                            zIndex={2}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <span className="dark:text-white mr-2">Usernames Prohibited
                                            From Seeing Your Miscellaneous</span>
                                        <TigerBookComboBoxMultipleFFASelect
                                            setterValue={myPermissions['miscellaneous_prohibited_usernames']}
                                            setterFunction={(event) => {
                                                updateMyPermissions({miscellaneous_prohibited_usernames: event})
                                            }}
                                            zIndex={1}
                                            placeholder="Add usernames"
                                            dropdownDefaultDescription="Add username"
                                        />
                                    </div>
                                </div>
                            }


                            <p className="text-xs text-red-500 text-right my-3 dark:text-red-300">Required fields are
                                marked with an
                                asterisk
                                {' '}
                                <abbr title="Required field">*</abbr>
                            </p>
                            <div className="flex justify-center">
                                <button type="submit"
                                        className="inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-primary-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </SidebarProvider>
    );
}

export default ProfileEdit;
