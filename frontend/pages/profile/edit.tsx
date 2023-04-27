import Image from "next/image";
import React, {useContext, useState} from "react";
import {GetServerSideProps, NextPage} from "next";
import {
    FullProfileEditGet,
    FullProfileEditPost,
    HeaderType,
    SetupOneGet,
    SetupOnePost,
    SetupTwoPost
} from "@types/types";
import {axiosInstance} from "@utils/axiosInstance";
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
import {HiX} from "react-icons/hi";


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
        '/api-django/cities/',
        '/api-django/certificates/',
        '/api-django/pronouns/',
        '/api-django/interests/',
        '/api-django/extracurriculars/',
        '/api-django/extracurricular-positions/',
        '/api-django/housing/'
    ]

    const keys = [
        'concentrations',
        'tracks',
        'residentialColleges',
        'classYears',
        'cities',
        'certificates',
        'pronouns',
        'interests',
        'extracurriculars',
        'positions',
        'completeHousing'
    ]

    const indices = [
        'concentration',
        'track',
        'residential_college',
        'class_year',
        'complete_city',
        'certificate',
        'pronouns',
        'interest',
        'extracurricular',
        'position',
        'complete_housing'
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
            hometowns: listData['cities'],
            currentCities: listData['cities'],
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
    hometowns: string[]
    currentCities: string[]
    pronouns: string[]
    certificates: string[]
    interests: string[]
    extracurriculars: string[]
    positions: string[]
    completeHousing: string[]
}

const ProfileEdit: React.FC<Props> = ({
                                          data, headerData, concentrations,
                                          tracks, residentialColleges,
                                          classYears, hometowns, pronouns, certificates,
                                          interests, extracurriculars, positions, completeHousing,
                                          currentCities,
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
    const [myCurrentCity, setMyCurrentCity] = useState(data.current_city);
    const [myCurrentHousing, setMyCurrentHousing] = useState(data.housing);
    const [myInterests, setMyInterests] = useState(data.interests);
    const [myExtracurriculars, setMyExtracurriculars] = useState(data.extracurriculars === null ? []
        : data.extracurriculars);
    // const [myExtracurriculars, setMyExtracurriculars] = useState(data.extracurriculars === null ? []
    //     : data.extracurriculars.map(extracurricular => extracurricular.extracurricular));
    // const [myExtracurricularPositions, setMyExtracurricularPositions] =
    //     useState(data.extracurriculars === null ? [] :
    //         data.extracurriculars.map((extracurricular) => extracurricular.positions));

    const [files, setFiles] = useState([]);
    const [changePhoto, setChangePhoto] = useState(false);

    const [isImageReady, setIsImageReady] = useState(false);

    const onLoadCallBack = () => {
        setIsImageReady(true)
        document.getElementById('spinner').classList.add("hidden")
        document.getElementById('height-adjustment')
            .classList.add("opacity-100", "transition-opacity", "duration-1000", "block", "h-[200px]", "w-[200px]")
    }

    console.log("extra", myExtracurriculars)

    // console.log("certs", myCertificates)

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
            extracurriculars: JSON.stringify(myExtracurriculars),
        }
        console.log(postData)

        let RESPONSE_ERROR = 0
        const axios = await axiosInstance();

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
        for (let key in postData) {
            if (postData[key] != null) {
                formData.append(key, postData[key]);
            }
        }

        // // TODO: Change this to the actual endpoint
        let axiosResponse: AxiosResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/undergraduate/profile/edit/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
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

        console.log(axiosResponse)
        if (RESPONSE_ERROR === 0) {
            await router.push('/search')
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

    function removeExtracurricular(index) {
        let newFormValues = [...myExtracurriculars];
        newFormValues.splice(index, 1);
        setMyExtracurriculars(newFormValues)
    }

    function setExtracurriculars(index, value) {
        let newFormValues = [...myExtracurriculars];
        newFormValues[index].extracurricular = value;
        setMyExtracurriculars(newFormValues)
    }

    function setExtracurricularPositions(index, value) {
        let newFormValues = [...myExtracurriculars];
        newFormValues[index].positions.push(value);
        setMyExtracurriculars(newFormValues)
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
                        {!changePhoto && <button
                            className="inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-primary-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-600"
                            onClick={() => setChangePhoto((prev) => !prev)}>
                            Change Photo
                        </button>}
                        {changePhoto && <button
                            className="inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-primary-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-600"
                            onClick={() => setChangePhoto((prev) => !prev)}>
                            Keep Photo
                        </button>}
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
                                        data={hometowns}
                                        defaultText="Select hometown"
                                        initialSelected={myHometown}
                                        zIndex={8}
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
                                        zIndex={7}
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
                                        zIndex={6}
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
                                        zIndex={5}
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
                                        zIndex={4}
                                        setterFunction={setMyCertificates}
                                        defaultText='Add prospective certificates'/>
                                </div>


                                {myExtracurriculars.map((extracurricular, index) => (
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
                                                zIndex={3}
                                                defaultOptionText={undefined}
                                                setterFunction={(value: string) => {
                                                    setExtracurriculars(index, value)
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
                                                zIndex={2}
                                                defaultOptionText={undefined}
                                                setterFunction={(value: string[]) => {
                                                    setExtracurricularPositions(index, value)
                                                }}
                                            />
                                        </div>

                                    </>))}
                                <div className="sm:col-span-2 mx-auto">
                                    <div className="flex justify-content">
                                        <button
                                            onClick={addExtracurricular}
                                            className="inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-primary-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-600"
                                        >
                                            Add Extracurricular Activity
                                        </button>
                                    </div>
                                </div>


                                {/*<div>*/}
                                {/*    <label htmlFor="housing"*/}
                                {/*           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">*/}
                                {/*        Research Title*/}
                                {/*    </label>*/}
                                {/*    <TigerBookComboBoxSingleStrictSelect*/}
                                {/*        data={cities}*/}
                                {/*        defaultText="Select extracurricular activity"*/}
                                {/*        initialSelected={myCurrentCity}*/}
                                {/*        zIndex={6}*/}
                                {/*        defaultOptionText="I am not my housing room"*/}
                                {/*        setterFunction={setMyCurrentCity}*/}
                                {/*    />*/}
                                {/*</div>*/}

                                {/*<div>*/}
                                {/*    <label htmlFor="housing"*/}
                                {/*           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">*/}
                                {/*        Research Description*/}
                                {/*    </label>*/}
                                {/*    <TigerBookComboBoxSingleStrictSelect*/}
                                {/*        data={cities}*/}
                                {/*        defaultText="Select extracurricular position"*/}
                                {/*        initialSelected={myCurrentCity}*/}
                                {/*        zIndex={6}*/}
                                {/*        defaultOptionText="I am not my housing room"*/}
                                {/*        setterFunction={setMyCurrentCity}*/}
                                {/*    />*/}
                                {/*</div>*/}

                                {/*<div>*/}
                                {/*    <label htmlFor="housing"*/}
                                {/*           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">*/}
                                {/*        Miscellaneous Title*/}
                                {/*    </label>*/}
                                {/*    <TigerBookComboBoxSingleStrictSelect*/}
                                {/*        data={cities}*/}
                                {/*        defaultText="Select extracurricular activity"*/}
                                {/*        initialSelected={myCurrentCity}*/}
                                {/*        zIndex={6}*/}
                                {/*        defaultOptionText="I am not my housing room"*/}
                                {/*        setterFunction={setMyCurrentCity}*/}
                                {/*    />*/}
                                {/*</div>*/}

                                {/*<div>*/}
                                {/*    <label htmlFor="housing"*/}
                                {/*           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">*/}
                                {/*        Miscellaneous Description*/}
                                {/*    </label>*/}
                                {/*    <TigerBookComboBoxSingleStrictSelect*/}
                                {/*        data={cities}*/}
                                {/*        defaultText="Select extracurricular position"*/}
                                {/*        initialSelected={myCurrentCity}*/}
                                {/*        zIndex={6}*/}
                                {/*        defaultOptionText="I am not my housing room"*/}
                                {/*        setterFunction={setMyCurrentCity}*/}
                                {/*    />*/}
                                {/*</div>*/}

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

export default ProfileEdit;
