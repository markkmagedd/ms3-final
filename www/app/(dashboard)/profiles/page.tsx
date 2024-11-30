"use server"
import { ProfileComponent } from "@/components/profile-card";

export default async function Page() {
    const res = await fetch('http://localhost:8080/all-customer-accounts');
    const data = await res.json();
    if(data.success === false) {
        return (
            <>
            Something went wrong.
            </>
        )
    }
    return (
        <main className="p-6">
        <h1 className="font-bold text-3xl">Customers Profiles</h1>
        <div className="flex flex-col gap-4 mt-4">
        {data.data.map((account:any) => {
            return (
                <div key={account.nationalID}>
                <ProfileComponent firstName={account.first_name} lastName={account.lastName} mobileNumber={account.mobileNo}/>
                </div>
            )
        })}
        </div>
        </main>
    )
}