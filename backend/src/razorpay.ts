import { Orders } from "razorpay/dist/types/orders";
import Razorpay from "razorpay";

export interface RazorpayResponse<T> {
  data: T;
  status: "success" | "failure";
}

export async function createOrder({
  instance,
  amount,
}: {
  instance: Razorpay;
  amount: number;
}): Promise<RazorpayResponse<Orders.RazorpayOrder>> {
  try {
    const res = await instance.orders.create({
      amount: amount,
      currency: "INR",
      // receipt: "receipt#1",
    });

    return { data: res, status: "success" };
  } catch (err) {
    return { data: err, status: "failure" };
  }
}
