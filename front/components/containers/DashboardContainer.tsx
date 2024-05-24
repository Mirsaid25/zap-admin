import { getData } from "@/lib/https";
import Form from "../Form";
import { cookies } from "next/headers";

const DashboardContainer = async () => {
    const token = cookies().get("zapAdminToken")?.value
    const role = cookies().get("zapAdminRole")?.value
    const operatorName = cookies().get("zapOperatorName")

    const config = await getData("/config")
    return (
        <>
            <Form
                config={config.data[0]}
                token={token}
                role={role}
                operatorName={operatorName}
            />
        </>
    );
};

export default DashboardContainer;
