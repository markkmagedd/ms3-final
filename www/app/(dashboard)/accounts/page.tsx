"use server"
import { CustomerAccount } from "@/components/customer-account";
import { AccountInput } from "@/components/account-input";

export default async function Page() {
    const res = await fetch('http://localhost:8080/account-plan');
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
        <h1 className="font-bold text-3xl">Customers Accounts</h1>
        <div className="flex flex-col gap-4 mt-4">
        <AccountInput />
       {
        data.data.map((account:any) => {
            return (
                <div key={account.mobileNo}>
                    <CustomerAccount mobileNumber={account.mobileNo} name={account.name} description={account.description} />
                </div>
            )
        })
       }
        </div>
        </main>
    )
}