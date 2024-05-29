import payload from "payload";
import { CollectionConfig } from "payload/types";
import qs from "qs";

const Students: CollectionConfig = {
  slug: "students",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "name",
    description: "A student",
  },
  fields: [
    { name: "id", type: "number", required: true },
    { name: "name", type: "text", required: true },
    { name: "number", type: "number", max: 10, required: true },
    { name: "email", type: "email", required: true },
    { name: "dob", label: "Date Of Birth", type: "date", required: true },
    {
      name: "user",
      type: "relationship",
      relationTo: ["users"],
      hasMany: false,
      required: true,
    },
    {
      name: "course",
      type: "relationship",
      relationTo: ["courses"],
      filterOptions: async ({ data, siblingData }) => {
        if (data.branch) {
          // const query = qs.stringify(
          //   {
          //     where: {
          //       id: {
          //         equals: Number(data.branch.value),
          //       },
          //     },
          //   },
          //   { addQueryPrefix: true }
          // );
          // const response = await fetch(
          //   `http://localhost:3000/api/branches${query}`
          // );
          // const json = await response.json();
          // const courses = json["docs"][0]["courses"].map(
          //   (e) => e["value"]["id"]
          // );

          // console.log(data, siblingData, courses);

          return true;
        }

        return false;
      },
      hasMany: true,
      required: true,
    },
    {
      name: "branch",
      type: "relationship",
      relationTo: ["branches"],
      hasMany: false,
      required: true,
    },
    { name: "photo", type: "upload", relationTo: "media", required: true },
  ],
};

export default Students;
