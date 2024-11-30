"use server"
import { StoreCard } from "@/components/store-card";

export default async function Page() {
    const data = await fetch("http://localhost:8080/physical-store-vouchers");
    const res = await data.json();
    if(res.success === false) {
        return (
            <>
            <p>{res.error}</p>
            </>
        )
    }
    return (
        <main className="p-6">
        <h1 className="font-bold text-3xl">Physical Stores</h1>
        <div className="flex flex-col gap-4">
        <div>
            {
                res.data.map((store: any) => {
                    return (
                        <div key={store.shopID} className="mt-4">
                        <StoreCard shopId={store.shopID} address={store.address} working_hours={store.working_hours} />
                        </div>
                    )
                })
            }
        </div>
        </div>
        </main>
    )
}