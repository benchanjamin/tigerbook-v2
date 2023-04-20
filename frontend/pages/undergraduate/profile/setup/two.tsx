import Header from "@components/ui/Header";
import Image from "next/image";
import React, {useContext} from "react";
import {SidebarProvider} from "../../../../context/SidebarContext";
import {SetupOneGet, SetupTwoGet, SetupTwoPost} from "@types/setup/one/types";
import {axiosInstance, axiosLocalhost} from "../../../../utils/axiosInstance";
import {AxiosResponse} from "axios";
import {useState} from 'react';
import {useRouter} from "next/navigation";
import ImageUpload from "@components/file-upload/ImageUpload";
import {GetServerSideProps} from "next";
import {Spinner} from "flowbite-react";
import NotificationContext from "../../../../context/NotificationContext";

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

const Two: React.FC<Props> = ({data}) => {
    const [isImageReady, setIsImageReady] = useState(false);
    const [files, setFiles] = useState([]);
    const router = useRouter();
    const context = useContext(NotificationContext);


    const onLoadCallBack = (e) => {
        setIsImageReady(true)

        // setTimeout(() => {
        // }, 1000)
        document.getElementById('spinner').classList.add("hidden")
        document.getElementById('height-adjustment')
            .classList.add("opacity-100", "transition-opacity", "duration-1000", "block", "h-[200px]", "w-[200px]")
    }

    async function submitHandler(event) {
        event.preventDefault();

        // TODO: Add notification for no files submitted
        if (files.length == 0) {
            context.showNotification({
                description: String("No file selected to save"),
            })
            return;
        }

        let formData: SetupTwoPost = new FormData()
        formData.append('profile_pic', files[0])

        let RESPONSE_ERROR = 0
        const axios = await axiosLocalhost();
        // TODO: Change this to the actual endpoint
        let axiosResponse: AxiosResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/undergraduate/profile/setup/two/`,
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
            await router.push("/search")
        }
    }

    async function onClick() {
        const postData = {
            profile_pic: null
        }
        let RESPONSE_ERROR = 0
        const axios = await axiosLocalhost();
        let axiosResponse: AxiosResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/undergraduate/profile/setup/two/`,
            postData).then((response) => {
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
            await router.push("/search")
        }
    }

    return (
        <SidebarProvider>
            {data.profile_pic != undefined ?
                <Header disableSideBar={true} disableLinks={true} profilePicSrc={data.profile_pic}
                        username={data.username}/>
                : (data.residential_college_facebook_entry !== null ?
                    <Header disableSideBar={true} disableLinks={true} username={data.username}
                            profilePicSrc={data.residential_college_facebook_entry.photo_url}/>
                    : <Header disableSideBar={true} disableLinks={true} username={data.username}/>)
            }
            <div className="fixed -z-10 h-screen w-screen">
                <Image src="/static/nassau.jpg" alt="Nassau Hall" className="bg-repeat bg-repeat-y"
                       fill
                       style={{objectFit: "cover"}}

                />
            </div>
            <main className="flex flex-col justify-center items-center">
                <section
                    className="w-[90%] bg-white m-2 p-6 dark:bg-gray-900 z-10 lg:w-[50%] rounded-2xl relative shadow-2xl">
                    <div className="px-4 mt-2 mb-4 text-center mx-auto max-w-2xl ">
                        <h5 className="text-gray-600 dark:text-gray-200 text-medium font-medium">
                            Let&apos;s setup your profile picture!
                        </h5>
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
                    <div className="px-4 py-2 mx-auto max-w-2xl">

                        <ImageUpload data={data}
                                     files={files}
                                     setFiles={setFiles}/>
                    </div>
                    <form onSubmit={submitHandler}>
                        <div className="flex justify-center mb-2 max-2xl gap-x-16">
                            <div onClick={onClick}
                                 className="cursor-pointer inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-gray-400 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-gray-900 hover:bg-gray-500"
                            >
                                Use default image
                            </div>
                            {/*<div onClick={() => router.push("/search")}*/}
                            {/*     className="cursor-pointer inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-gray-400 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-gray-900 hover:bg-gray-500"*/}
                            {/*>*/}
                            {/*    Skip for now*/}
                            {/*</div>*/}
                            <button type="submit"
                                    className="inline-flex items-center px-5 py-2.5 mt-1 text-sm font-medium text-center text-white bg-primary-500 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-600"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </section>

            </main>
        </SidebarProvider>
    );
}

export default Two;
