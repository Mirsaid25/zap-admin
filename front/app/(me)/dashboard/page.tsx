import DashboardContainer from "@/components/containers/DashboardContainer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const Page = async () => {
    const token = cookies().get("zapAdminToken")?.value;

    if (!token) redirect("/log-in");
    
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <DashboardContainer />
        </Suspense>
    );
};

export default Page;
