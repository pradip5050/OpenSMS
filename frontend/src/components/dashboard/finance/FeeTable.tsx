import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import RazorpayGateway from "./RazorpayGateway";

export interface FeeTableProps {
  hasPaymentButton: boolean;
  hasPrintButton: boolean;
}

export default function FeeTable({
  hasPaymentButton,
  hasPrintButton,
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
        <TableRow>
          <TableCell>2-12-2023</TableCell>
          <TableCell>Course Fees</TableCell>
          <TableCell>3000</TableCell>
          {hasPaymentButton && (
            <TableCell>
              <RazorpayGateway amount={1000} />
            </TableCell>
          )}
          {hasPrintButton && <TableHead>Icon</TableHead>}
        </TableRow>
      </TableBody>
    </Table>
  );
}
