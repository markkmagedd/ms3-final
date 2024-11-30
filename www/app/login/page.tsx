"use server"
import { Login } from "@/components/login"

export default async function Page() {
    return (
        <main className="flex items-center justify-center p-12">
        <Login />
        </main>
    )
}