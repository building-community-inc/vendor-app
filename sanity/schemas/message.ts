import { defineField, defineType } from "sanity";


export const messageSchema = defineType({
  name: "message",
  title: "Message",
  type: "document",
  fields: [
    defineField({
      name: "for",
      title: "For",
      type: "reference",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "from",
      title: "From",
      type: "reference",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
    }),
    defineField({
      name: "read",
      title: "Read",
      type: "boolean",
      initialValue: false,
    }),

  ]
})