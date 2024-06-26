import payload from "payload";
import { CollectionConfig } from "payload/types";
import qs from "qs";
import { isAdminOrFaculty } from "../access/isAdmin";

const Students: CollectionConfig = {
  slug: "students",
  access: {
    create: isAdminOrFaculty,
    update: isAdminOrFaculty,
    delete: isAdminOrFaculty,
  },
  admin: {
    useAsTitle: "studentId",
    description: "A student",
  },
  fields: [
    { name: "studentId", label: "Student ID", type: "number", required: true },
    {
      name: "number",
      type: "number",
      validate: (val, {}) => {
        if (val >= 10000000000) {
          return "Enter valid mobile number";
        }

        return true;
      },
      required: true,
    },
    { name: "dob", label: "Date Of Birth", type: "date", required: true },
    {
      name: "links",
      label: "Portfolio links",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: ["users"],
      hasMany: false,
      required: true,
    },
    {
      name: "courses",
      type: "relationship",
      relationTo: ["courses"],
      // filterOptions: async ({ data, siblingData }) => {
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
      // },
      hasMany: true,
      required: true,
    },
    { name: "photo", type: "upload", relationTo: "media", required: true },
  ],
};

export default Students;
