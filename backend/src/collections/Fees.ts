import { CollectionConfig } from "payload/types";
import { createOrder } from "../razorpay";
import Razorpay from "razorpay";
import { isAdminOrFaculty } from "../access/isAdmin";

const Fees: CollectionConfig = {
  slug: "fees",
  access: {
    create: isAdminOrFaculty,
    update: isAdminOrFaculty,
    delete: isAdminOrFaculty,
  },
  admin: {
    useAsTitle: "name",
    description: "A student fee",
  },
  fields: [
    { name: "description", type: "text", required: true },
    { name: "amount", type: "number", required: true },
    { name: "dueDate", label: "Due date", type: "date", required: true },
    {
      name: "paymentStatus",
      label: "Payment status",
      type: "select",
      options: ["paid", "unpaid", "delayed"],
      defaultValue: "unpaid",
      required: true,
    },
    {
      name: "student",
      type: "relationship",
      relationTo: ["students"],
      hasMany: false,
      required: true,
    },
  ],
  endpoints: [
    {
      // TODO: Move amount to req body
      path: "/order/create/:amount",
      method: "post",
      handler: async (req, res, next) => {
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const order = await createOrder({
          instance: razorpay,
          amount: Number(req.params.amount),
        });
        if (order.status === "success") {
          res.status(200).send(order.data);
        } else {
          res.status(400).send(order.data);
        }
      },
    },
  ],
};

export default Fees;
