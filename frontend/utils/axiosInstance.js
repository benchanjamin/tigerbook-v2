import axios from "axios";

export const axiosInstance = async () => {
    return axios.create({
        withCredentials: true,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
    });
}

export const axiosLocalhost = async () => {
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgzMjU1MzU3LCJpYXQiOjE2ODI4MjMzNTcsImp0aSI6IjU1MDQ0ZDI2MmNjMzQ5YmVhZGVlZjZlYzcxYWIwMDlhIiwidXNlcl9pZCI6Mzd9.QJOngCfZHacK_Tf1ZIe1CaHh3tDrGm1TKzsNiP1NDkc"
    return axios.create(
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )
}
