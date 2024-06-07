"use server"

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export default async function action(collection: string) {
    revalidateTag(collection);
}

export async function deleteAllCookies() {
    
}