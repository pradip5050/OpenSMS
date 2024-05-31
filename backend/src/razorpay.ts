import Razorpay from "razorpay";
import { Orders } from "razorpay/dist/types/orders";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createOrder({
  amount,
}: {
  amount: number;
}): Promise<Orders.RazorpayOrder> {
  const res = await instance.orders.create({
    amount: amount,
    currency: "INR",
    // receipt: "receipt#1",
  });

  return res;
}
