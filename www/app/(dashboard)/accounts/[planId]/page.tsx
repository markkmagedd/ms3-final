"use server";

export default async function Page({
  params,
  searchParams,
}: {
  params: { planId: string };
  searchParams?: { date: string | undefined };
}) {
  const res = await fetch("http://localhost:8080/account-plan-date", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      planId: params.planId,
      date: searchParams?.date,
    }),
  });
  const data = await res.json();
  return <>{JSON.stringify(data)}</>;
}
