import { defineField, defineType } from "sanity";


export const acceptedTermsSchema = defineType({
  name: "acceptedTerms",
  title: "Terms Accepted By",
  type: "document",
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "acceptedTerms",
      title: "Accepted Terms",
      type: "boolean",
    }),
   
  ],
  preview: {
    select: {
      title: "user.firstName",
      subtitle: "user.email",
    },
  },
})