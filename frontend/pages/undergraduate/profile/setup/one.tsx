import Image from "next/image";
import React, {useContext, useState} from "react";
import {GetServerSideProps, NextPage} from "next";
import {SetupOneGet, SetupOnePost} from "@types/setup/one/types";
import {axiosInstance} from "@utils/axiosInstance";
import {AxiosResponse} from "axios";
import axios from "axios";
import TigerBookListBox from "@components/headless-ui/TigerBookListBox";
import TigerBookComboBoxSingleStrictSelect from "@components/headless-ui/TigerBookComboBoxSingleStrictSelect";
import TigerBookComboBoxMultipleFFASelect from "@components/headless-ui/TigerBookComboBoxMultipleFFASelect";
import Header from "@components/ui/Header";
import {SidebarProvider} from "@context/SidebarContext";
import TigerBookComboBoxMultipleStrictSelect from "@components/headless-ui/TigerBookComboBoxMultipleStrictSelect";
import {useRouter} from 'next/navigation'
import NotificationContext from "../../../../context/NotificationContext";
import {Spinner} from "flowbite-react";


interface ServerSideProps {
    data: SetupOneGet;
    concentrations: SetupOnePost['concentrations'],
    tracks: SetupOnePost['tracks'],
    residentialColleges: SetupOnePost['residential_college']
    classYears: SetupOnePost['class_year'],
    cities: SetupOnePost['hometown'],
    certificates: SetupOnePost['certificates']
    pronouns: SetupOnePost['pronouns'],
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({req}) => {
    let RESPONSE_ERROR = 0
    const axios = await axiosInstance();
    let axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/undergraduate/profile/setup/one/`,
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

    const data: SetupOneGet = axiosResponse.data;

    const apiListAPIRoutes = [
        '/api-django/concentrations/',
        '/api-django/tracks/',
        '/api-django/residential-colleges/',
        '/api-django/class-years/',
        '/api-django/cities/',
        '/api-django/certificates/',
        '/api-django/pronouns/',
    ]

    const keys = [
        'concentrations',
        'tracks',
        'residentialColleges',
        'classYears',
        'cities',
        'certificates',
        'pronouns',
    ]

    const indices = [
        'concentration',
        'track',
        'residential_college',
        'class_year',
        'complete_city',
        'certificate',
        'pronouns',
    ]

    const listData = {}

    for (const [index, apiRoute] of apiListAPIRoutes.entries()) {
        const axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}${apiRoute}`, {
            headers: {
                Cookie: req.headers.cookie
            }
        })
        listData[keys[index]] = axiosResponse.data.map((item) => item[indices[index]])
    }

    return {
        props: {
            data,
            ...listData
        },
    }
};

type Props = {
    data: SetupOneGet
    concentrations: string[]
    tracks: string[]
    residentialColleges: string[]
    classYears: string[]
    cities: string[]
    pronouns: string[]
    certificates: string[]
}

const One: React.FC<Props> = ({
                                  data, concentrations, tracks, residentialColleges,
                                  classYears, cities, pronouns, certificates,
                              }) => {
    const context = useContext(NotificationContext);
    const router = useRouter()

    const [myConcentration, setMyConcentration] = useState(data.concentration);
    const [myTrack, setMyTrack] = useState(data.track);
    const [myResidentialCollege, setMyResidentialCollege] = useState(data.residential_college);
    const [myClassYear, setMyClassYear] = useState(data.class_year);
    const [myHometown, setMyHometown] = useState(data.hometown);
    const [myPronouns, setMyPronouns] = useState(data.pronouns);
    const [myCertificates, setMyCertificates] = useState(data.certificates);
    const [myAliases, setMyAliases] = useState(data.aliases);

    const [isImageReady, setIsImageReady] = useState(false);

    const onLoadCallBack = (e) => {
        setIsImageReady(true)

        // setTimeout(() => {
        // }, 1000)
        document.getElementById('spinner').classList.add("hidden")
        document.getElementById('height-adjustment')
            .classList.add("opacity-100", "transition-opacity", "duration-1000", "block", "h-[200px]", "w-[200px]")
    }

    console.log(data)

    async function submitHandler(event) {
        event.preventDefault();
        console.log(myTrack, myConcentration, myResidentialCollege, myClassYear, myHometown, myPronouns, myAliases, myCertificates)
        const postData: SetupOnePost = {
            certificates: myCertificates,
            concentration: myConcentration,
            track: myTrack,
            residential_college: myResidentialCollege,
            class_year: myClassYear,
            hometown: myHometown,
            pronouns: myPronouns,
            aliases: myAliases
        }
        console.log(postData)

        let RESPONSE_ERROR = 0
        const axios = await axiosInstance();

        // TODO: Change this to the actual endpoint
        let axiosResponse: AxiosResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/undergraduate/profile/setup/one/`,
            postData)
            .then((response) => {
                if (response.ok) {
                    return response
                }

                // return response.data.then((errorData) => {
                //     RESPONSE_ERROR = 1
                //     throw new Error(errorData.response.data ||
                //         'Something went wrong!')
                // })
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

        console.log(axiosResponse)

        if (RESPONSE_ERROR === 0) {
            await router.push('/undergraduate/profile/setup/two')
        }
    }

    return (
        <SidebarProvider>
            {data.profile_pic != undefined ?
                <Header disableSideBar={true} disableLinks={true} profilePicSrc={data.profile_pic}
                        username={data.username}/>
                : (data.residential_college_facebook_entry !== null ?
                    <Header disableSideBar={true} disableLinks={true}
                            profilePicSrc={data.residential_college_facebook_entry.photo_url}
                            username={data.username}/>
                    : <Header disableSideBar={true} disableLinks={true}
                              username={data.username}/>)
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
                        <h1 className="text-2xl font-bold dark:text-white">
                            Welcome, {data.active_directory_entry.full_name}!
                        </h1>
                        <h5 className="text-gray-400 text-sm font-medium">Let&apos;s setup your profile</h5>
                    </div>
                    {data.profile_pic != undefined ?
                        (<div className="flex relative justify-center items-center w-full">
                            {!isImageReady &&
                                <Spinner
                                    id="spinner"
                                    color="warning"
                                    className="h-[200px] w-[200px]"/>}
                            <div id='height-adjustment' className="relative opacity-0">
                                <Image src={data.profile_pic}
                                       alt={`Photo of ${data.username}`}
                                       onLoad={onLoadCallBack}
                                       className="border-2 border-primary-100 dark:border-opacity-50 rounded-2xl"
                                       fill
                                       style={{objectFit: "cover"}}
                                />
                            </div>
                        </div>)
                        :
                        (data.residential_college_facebook_entry !== null ?
                                (<div className="flex relative justify-center items-center w-full ">
                                    {!isImageReady &&
                                        <Spinner
                                            id="spinner"
                                            color="warning"
                                            className="h-[200px] w-[200px]"/>}
                                    <div id='height-adjustment' className="relative opacity-0">
                                        <Image src={data.residential_college_facebook_entry.photo_url}
                                               alt={`Photo of ${data.username}`}
                                               className="border-2 border-primary-100 dark:border-opacity-50 rounded-2xl"
                                               onLoad={onLoadCallBack}
                                               fill
                                               style={{objectFit: "cover"}}
                                        />
                                    </div>
                                </div>) :
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
                        )
                    }
                    <div className="px-4 mx-auto max-w-2xl">
                        <h2 className="mb-4 mt-2 text-xl font-bold text-gray-900 dark:text-white">Biographical
                            Information</h2>
                        <form onSubmit={submitHandler}>
                            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                <div className="sm:col-span-2">
                                    <label htmlFor="name"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nickname(s)</label>

                                    {/*<input type="text" name="name" id="name"*/}
                                    {/*       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"*/}
                                    {/*       placeholder="Type product name" required=""/>*/}

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
                                                      zIndex={30}
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
                                                      zIndex={20}
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
                                                      zIndex={10}
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
                                        zIndex={9}
                                        setterFunction={setMyPronouns}
                                        defaultOptionText="I am not adding pronouns"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="hometown"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hometown
                                    </label>
                                    <TigerBookComboBoxSingleStrictSelect
                                        data={cities}
                                        defaultText="Select hometown"
                                        initialSelected={myHometown}
                                        zIndex={8}
                                        defaultOptionText="I am not adding my hometown"
                                        setterFunction={setMyHometown}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="certificates"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Certificates
                                    </label>
                                    <TigerBookComboBoxMultipleStrictSelect
                                        data={certificates}
                                        initialSelected={myCertificates}
                                        zIndex={7}
                                        setterFunction={setMyCertificates}
                                        defaultText={'Add prospective certificates'}/>
                                </div>
                            </div>

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

export default One;
