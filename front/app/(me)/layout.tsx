import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseJwt } from "@/lib/utils";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const token = cookies().get("zapAdminToken")?.value

    if (!token) redirect("/log-in");

    const jwt = parseJwt(token);

    if (jwt.exp < Date.now() / 1000) {
        redirect("/log-in");
    }

    return (
        <div>
            {children}
        </div>
    );
}
