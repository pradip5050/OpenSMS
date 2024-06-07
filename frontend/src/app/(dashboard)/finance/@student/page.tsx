"use client";

import { useAuth } from "@/components/AuthProvider";
import FeeTable from "@/components/dashboard/finance/FeeTable";
import RazorpayGateway from "@/components/dashboard/finance/RazorpayGateway";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFees } from "@/lib/dashboard/finance";

export default function Finance() {
  const { user, token } = useAuth();
  const { data, error, isLoading } = useFees(token);

  const payments = data?.docs;
  const acceptedPayments = payments?.filter(
    (val) => val.paymentStatus === "paid"
  );
  const duePayments = payments?.filter((val) => val.paymentStatus !== "paid");

  return (
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen ">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Finance</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-screen">
          <Card className="flex flex-col gap-4 lg:col-span-2 p-5">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-full" />
          </Card>
          <Card className="flex flex-col gap-4 p-5">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-full" />
          </Card>
          <Card className="flex flex-col gap-4 p-5">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-full" />
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 overflow-y-auto">
          <Card className="2xl:col-span-2">
            <CardHeader>
              <CardTitle>Total fee</CardTitle>
            </CardHeader>
            <CardContent>
              <FeeTable
                hasPaymentButton={false}
                hasPrintButton={false}
                fees={payments!}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payments due</CardTitle>
            </CardHeader>
            <CardContent>
              <FeeTable
                hasPaymentButton={true}
                hasPrintButton={false}
                fees={duePayments!}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Accepted payments</CardTitle>
            </CardHeader>
            <CardContent>
              <FeeTable
                hasPaymentButton={false}
                hasPrintButton={true}
                fees={acceptedPayments!}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
