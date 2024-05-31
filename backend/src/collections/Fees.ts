import { CollectionConfig } from "payload/types";
import { createOrder } from "../razorpay";

const Fees: CollectionConfig = {
  slug: "fees",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "name",
    description: "A student fee",
  },
  fields: [
    { name: "id", type: "number", required: true },
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
      method: "get",
      handler: async (req, res, next) => {
        const order = await createOrder({ amount: Number(req.params.amount) });

        // if (tracking) {
        res.status(200).send(order);
        // } else {
        //   res.status(404).send({ error: 'not found' })
        // }
      },
    },
  ],
};

export default Fees;
