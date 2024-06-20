import { defineField, defineType } from "sanity";

export const creditTransactionSchema = defineType({
  name: "creditTransaction",
  title: "Credit Transaction",
  type: "document",
  fields: [
    defineField({
      name: "date",
      title: "Date",
      type: "string",
    }),
    defineField({
      name: "market",
      title: "Market",
      type: "reference",
      to: [{ type: "market" }],
    }),
    defineField({
      name: "vendor",
      title: "Vendor",
      type: "reference",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "amount",
      title: "Amount",
      type: "number",
    }),
    defineField({
      name: "reason",
      title: "Reason",
      type: "string",
    }),
  ]
})