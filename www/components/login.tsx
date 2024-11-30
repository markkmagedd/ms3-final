"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "./ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function Login() {
    const [ username, setUsername ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ mobileNumber, setMobileNumber ] = useState<number>();
  return (
    <Tabs defaultValue="customer" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="customer">Customer</TabsTrigger>
        <TabsTrigger value="admin">Admin</TabsTrigger>
      </TabsList>
      <TabsContent value="customer">
        <Card className="">
          <CardHeader>
            <CardTitle>Customer Portal</CardTitle>
            <CardDescription>
              Login to your customer account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form autoComplete="off">
            <div className="space-y-1">
              <Label>Mobile Number</Label>
              <Input type="number" placeholder="01207451280" autoComplete="off" value={mobileNumber} onChange={((e) => {setMobileNumber(e.target.valueAsNumber)})} />
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <Input type="text" value={password} onChange={((e) => {setPassword(e.target.value)})} />
            </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Login</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="admin">
        <Card>
          <CardHeader>
            <CardTitle>Admin Portal</CardTitle>
            <CardDescription>
              Login to your admin account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Username</Label>
              <Input type="text" placeholder="John Doe" value={username} onChange={((e) => {setUsername(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">Password</Label>
              <Input type="password" value={password} onChange={((e) => {setPassword(e.target.value)})} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Login</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
