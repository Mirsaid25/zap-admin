import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseJwt } from "@/lib/utils";
import AddedOperator from "@/components/AddedOperator";
import axios from "axios";
import Operator from "@/components/Operator";

const page = async () => {
    const token = cookies().get("zapAdminToken")?.value;
    const role = cookies().get("zapAdminRole")?.value;
    if (!token) redirect("/dashboard");
    if (role !== "admin") redirect("/dashboard");

    const jwt = parseJwt(token);

    if (jwt.exp < Date.now() / 1000) {
        redirect("/log-in");
    }

    const operators = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/operators`,
        { headers: { Authorization: token } }
    );

    return (
        <div className="bg-black text-white h-screen overflow-auto px-3 py-5">
            <AddedOperator token={token} />

            <div className="mt-10 grid grid-cols-3 gap-3">
                {operators.data.data.map((operator: any) => (
                    <Operator key={operator.id} operator={operator} token={token} />
                ))}
            </div>
        </div>
    );
};

export default page;
