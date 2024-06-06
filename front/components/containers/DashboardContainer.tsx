import { getData } from "@/lib/https";
import Form from "../Form";
import { cookies } from "next/headers";

const DashboardContainer = async () => {
    const token = cookies().get("zapAdminToken")?.value
    const role = cookies().get("zapAdminRole")?.value
    const operatorName = cookies().get("zapOperatorName")
    const createdAt = cookies().get("createdAt")?.value
    const operatorLogin = cookies().get("operatorLogin")?.value

    const config = await getData("/config")

    if (config === "Get Error") {
        return "проверьте интернет"
    }

    return (
        <>
            <Form
                config={config.data[0]}
                token={token}
                role={role}
                operatorName={operatorName}
                createdAt={createdAt}
                operatorLogin={operatorLogin}
            />
        </>
    );
};

export default DashboardContainer;
