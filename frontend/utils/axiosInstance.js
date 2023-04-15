import axios from "axios";

export const axiosInstance = async () => {
    return axios.create({
        withCredentials: true,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'x-csrftoken',
        timeout: 5000,

    });
}

export const axiosLocalhost = async () => {
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgxNjA5MDIzLCJpYXQiOjE2ODE1MjI2MjMsImp0aSI6IjM5NzVkYzc0NzdmZTQ4ZjI4MGNiN2JmOGUyNTIzZGIzIiwidXNlcl9pZCI6MX0.A0XsNAS8_GhDz0oobM9G7_PdMzXtdlgA2b6f284uq1U"
    return axios.create(
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )
}

