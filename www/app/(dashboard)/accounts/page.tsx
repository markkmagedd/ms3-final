"use server";
import { ProfileComponent } from "@/components/profile-card";
import { Key } from "react";

export default async function Page() {
  const res = await fetch("http://localhost:8080/all-customer-accounts");
  const data = await res.json();
  if (data.success === false) {
    return <>Something went wrong.</>;
  }
  return (
    <main className="p-6">
      {/* {JSON.stringify(data.data[0])} */}
      <h1 className="font-bold text-3xl">Customer Accounts</h1>
      <div className="flex flex-col gap-4 mt-4">
        {data.data.map(
          (account: {
            nationalID: Key | null | undefined;
            first_name: string;
            lastName: string;
            mobileNo: string;
          }) => {
            return (
              <div key={account.nationalID}>
                <ProfileComponent
                  firstName={account.first_name}
                  lastName={account.lastName}
                  mobileNumber={account.mobileNo}
                />
              </div>
            );
          }
        )}
      </div>
    </main>
  );
}
