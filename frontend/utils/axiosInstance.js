import axios from "axios";

export const axiosInstance = async () => {
    return axios.create({
        withCredentials: true,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
    });
}

export const axiosLocalhost = async () => {
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgzMDAxMDMwLCJpYXQiOjE2ODI1NjkwMzAsImp0aSI6IjJlMTVhMzkyYmExNTQzODM4NjI0MGZlMjhmMTkxNmY3IiwidXNlcl9pZCI6MTl9.bAlnwvOnIs5xEa9Tj96zsN3ufhw9hx51xBIE2M6zsq0"
    return axios.create(
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )
}
