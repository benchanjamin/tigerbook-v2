import React from 'react';
import {GetServerSideProps} from "next";
import {axiosInstance} from "@utils/axiosInstance";
import {AxiosResponse} from "axios";
import {HeaderType, User} from "@types/types";
import ProfilePreview from "../../profile/preview";


export const getServerSideProps: GetServerSideProps<Props> = async ({query, req}) => {
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

    let username = query.username
    if (username !== undefined) {
        username = username.slice(1)
    }
    let axiosResponse: AxiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/directory/${username}/`,
        {
            headers: {
                Cookie: req.headers.cookie
            }
        })

    const userData: User = axiosResponse.data;

    axiosResponse = await axios.get(`${process.env.NEXT_PRIVATE_API_BASE_URL}/api-django/header/`,
        {
            headers: {
                Cookie: req.headers.cookie
            }
        })
    const headerData: HeaderType = axiosResponse.data;

    return {
        props: {
            userData,
            headerData
        }
    }
}

interface Props {
    userData: User
    headerData: HeaderType
}

const Index: React.FC<Props> = ({userData, headerData}) => {
    return <ProfilePreview headerData={headerData} userData={userData}/>
}

export default Index;
