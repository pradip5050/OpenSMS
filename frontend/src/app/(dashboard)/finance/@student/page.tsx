"use client";

import { useAuth } from "@/components/AuthProvider";
import FeeTable from "@/components/dashboard/finance/FeeTable";
import GenericError from "@/components/GenericError";
import Spinner from "@/components/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFees } from "@/lib/dashboard/finance";

export default function Finance() {
  const { user, token } = useAuth();
  const { data, error, isLoading } = useFees(token);

  const payments = data?.docs;
  const acceptedPayments = payments?.filter(
    (val) => val.paymentStatus === "paid"
  );
  const duePayments = payments?.filter((val) => val.paymentStatus !== "paid");

  if (isLoading) {
    return <Spinner variant="page" />;
  }

  if (payments!.length === 0) {
    return <GenericError variant="noData" title="No fees listed yet" />;
  }

  if (!!error) {
    return <GenericError variant="error" />;
  }

  return (
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
  );
}
