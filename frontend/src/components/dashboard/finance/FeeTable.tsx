import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import RazorpayGateway from "./RazorpayGateway";
import { Fee } from "@/lib/dashboard/finance";
import { Button } from "@/components/ui/button";

export interface FeeTableProps {
  hasPaymentButton: boolean;
  hasPrintButton: boolean;
  fees: Fee[];
}

export default function FeeTable({
  hasPaymentButton,
  hasPrintButton,
  fees,
}: FeeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Due Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          {hasPaymentButton && <TableHead>Payment</TableHead>}
          {hasPrintButton && <TableHead>Print</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {fees.map((fee) => {
          return (
            <TableRow key={fee.id}>
              <TableCell>{fee.dueDate}</TableCell>
              <TableCell>{fee.description}</TableCell>
              <TableCell>{fee.amount}</TableCell>
              {hasPaymentButton && (
                <TableCell>
                  {/* Amount in paise */}
                  <RazorpayGateway amount={fee.amount * 100} />
                </TableCell>
              )}
              {hasPrintButton && <Button className="my-4">Icon</Button>}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
