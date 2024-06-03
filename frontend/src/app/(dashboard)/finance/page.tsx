"use client";

import { useAuth } from "@/components/AuthProvider";
import FeeTable from "@/components/dashboard/finance/FeeTable";
import RazorpayGateway from "@/components/dashboard/finance/RazorpayGateway";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFees } from "@/lib/dashboard/finance";

export default function Finance() {
  const { user, token } = useAuth();
  const { data, error, isLoading } = useFees(token);

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Finance</h1>
      </div>
      {
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Total fee</CardTitle>
            </CardHeader>
            <CardContent>
              <FeeTable hasPaymentButton={false} hasPrintButton={false} />
            </CardContent>
          </Card>
          <Card className="">
            <CardHeader>
              <CardTitle>Payments due</CardTitle>
            </CardHeader>
            <CardContent>
              <FeeTable hasPaymentButton={true} hasPrintButton={false} />
            </CardContent>
          </Card>
          <Card className="">
            <CardHeader>
              <CardTitle>Accepted payments</CardTitle>
            </CardHeader>
            <CardContent>
              <FeeTable hasPaymentButton={false} hasPrintButton={true} />
            </CardContent>
          </Card>
          <div className="lg:col-span-2 place-self-center"></div>
        </div>
      }
    </main>
  );
}
