import { defineField, defineType } from "sanity";

export const userSchema = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string'
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string'
    }),
    defineField({
      name: 'email',
      title: 'email',
      type: 'string'
    }),
    defineField({
      name: 'hasImage',
      title: 'Has Image',
      type: 'boolean'
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'string'
    }),
    
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: ["admin", "vendor", "dev"]
      },
      initialValue: "vendor"
    }),
    defineField({
      name: "business",
      title: "Business",
      type: "reference",
      to: [{ type: "business" }]
    }),
    defineField({
      name: "acceptedTerms",
      title: "Accepted Terms",
      type: "object",
      fields: [
        defineField({
          name: "dateAccepted",
          title: "Date Accepted",
          type: "datetime",
        }),
        defineField({
          name: "accepted",
          title: "Accepted",
          type: "boolean",
          initialValue: false
        }),
      ]
    })
  ]
})