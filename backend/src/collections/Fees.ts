import { CollectionConfig } from "payload/types";

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
};

export default Fees;
