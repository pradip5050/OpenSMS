"use client";

import RazorpayGateway from "@/components/dashboard/finance/RazorpayGateway";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Finance() {
  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Finance</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Total fee</CardTitle>
          </CardHeader>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Payments due</CardTitle>
          </CardHeader>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Accepted payments</CardTitle>
          </CardHeader>
        </Card>
        <div className="lg:col-span-2 place-self-center">
          <RazorpayGateway />
        </div>
      </div>
    </main>
  );
}
