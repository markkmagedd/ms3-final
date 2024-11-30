"use server"

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
        <>
        {JSON.stringify(res)}
        </>
    )
}