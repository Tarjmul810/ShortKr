import axios from "axios";
const api = process.env.NEXT_PUBLIC_API_URL;

export const getUrl = async () => {
    console.log(api);
    return await axios.get(`${api}/urls`);
}

export const postUrl = async (url: string) => {
    return await axios.post(`${api}/url`, { url });
}