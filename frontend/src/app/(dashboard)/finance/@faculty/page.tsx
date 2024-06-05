"use client";

import { useAuth } from "@/components/AuthProvider";
import FeeTable from "@/components/dashboard/finance/FeeTable";
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
    <main className="min-h-screen w-full p-4 pt-20 flex flex-col max-h-screen">
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-left w-full">Finance</h1>
      </div>
      <div>Faculty part</div>
    </main>
  );
}
