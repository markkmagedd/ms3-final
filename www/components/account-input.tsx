"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export function AccountInput() {
  const [planId, setPlanId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const redirectToAccounts = (e: React.FormEvent) => {
    e.preventDefault();
    redirect(`/accounts/${planId}?date=${date}`);
  };
  return (
    <div className="flex w-full items-center gap-4">
      <form
        className="flex w-full items-center gap-4"
        onSubmit={redirectToAccounts}
      >
        <Input
          required
          placeholder="Plan Id"
          value={planId}
          onChange={(e) => {
            setPlanId(e.target.value);
          }}
        />
        <Input
          required
          placeholder="Date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />
        <Button type="submit">Search for Account</Button>
      </form>
    </div>
  );
}
