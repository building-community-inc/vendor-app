import { defineArrayMember, defineField, defineType } from "sanity";

export const messageSchema = defineType({
  name: "message",
  title: "Message",
  type: "document",
  fields: [
    defineField({
      name: "for",
      title: "For",
      type: "array",
      of: [
        defineArrayMember(
          defineField({
            name: "forObject",
            title: "For Object",
            type: "object",
            fields: [
              defineField({
                name: "vendor",
                title: "Vendor",
                type: "reference",
                to: [{ type: "user" }],
              }),
              defineField({
                name: "read",
                title: "Read",
                type: "boolean",
                initialValue: false,
              }),
            ],
            preview: {
              select: {
                title: "vendor.business.businessName",
                email: `vendor.email`,
                name: `vendor.firstName`,
                lastName: `vendor.lastName`,
                read: "read",
              },
              prepare({ title, read, email, name, lastName }) {
                const subtitle = `${name} ${lastName} ${read ? "Read" : "Unread"}`
                return {
                  title: title || email,
                  subtitle
                };
              },
            },
          })
        ),
      ],
      // to: [{ type: "user" }],
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
  ],
});
