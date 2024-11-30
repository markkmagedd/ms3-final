"use client"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"

export function ProfileComponent({ firstName, lastName, mobileNumber } : { firstName: string, lastName: string, mobileNumber: string}) {
    return (
        <>
        <div 
      className="w-full flex border border-foreground/20 hover:border-foreground/30 rounded-lg items-center duration-300 pt-3 pb-3">
      <div className="mx-5 my-3 flex flex-col items-start text-left">
        <p className='sm:text-lg text-md font-bold text-left text-black dark:text-white'>
         {firstName} {lastName}     
        </p>
        <div className="mt-1 flex">
        <p className="text-sm text-muted-foreground">{mobileNumber}</p>
        </div>
        </div>
        <div className="ml-auto mr-5">
          <Button size={"icon"} variant={"outline"} className="rounded-lg bg-inherit border border-foreground/20">
            <ArrowRight className="size-4" />
          </Button>
        </div>
        </div>
        </>
    )
}