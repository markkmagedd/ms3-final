"use server"

export default async function Page() {
    const data = await fetch("http://localhost:8080/all-resolved-tickets");
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
        <h1 className="font-bold text-3xl">Tickets</h1>
        <div className="flex flex-col gap-4">
        {JSON.stringify(res.data)}
        </div>
        </main>
    )
}