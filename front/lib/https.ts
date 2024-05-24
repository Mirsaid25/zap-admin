import axios from "axios";

export async function getData(path: string) {
    try {
        const { data } = await axios(process.env.NEXT_PUBLIC_API_URL + path, {
            method: "GET"
        });

        return data;
    } catch (e) {
        console.log("get error");

        return { e }
    }
}