import axios from "axios";

export const axiosInstance = async () => {
    return axios.create({
        withCredentials: true,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
        // timeout: 10000,

    });
}

export const axiosLocalhost = async () => {
    // const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgyMDgwNzUyLCJpYXQiOjE2ODE2NDg3NTIsImp0aSI6IjkyOGM0OTJkZmZjYzQ1M2JiZWY2NDZiOTI3NzcxZTQ1IiwidXNlcl9pZCI6MX0.tHDfT7wqZyE19YU11pro5B0jG45UCCHfLTjt99RIr44"
    // return axios.create(
    //     {
    //         headers: {
    //             'Authorization': `Bearer ${accessToken}`
    //         }
    //     }
    // )
    return axios.create({
        withCredentials: true,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
        // timeout: 10000,
    });
}

