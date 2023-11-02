import { defineField, defineType } from "sanity";


export const termsSchema = defineType({
  name: "terms",
  title: "Terms",
  type: "document",
  fields: [
    defineField({
      name: "terms",
      title: "Terms",
      type: "array",
      of: [{ type: "block" }],
    })
  ]
})