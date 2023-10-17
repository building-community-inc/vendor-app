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
      name: 'address1',
      title: 'Address 1',
      type: 'string'
    }),
    defineField({
      name: 'address2',
      title: 'Address 2',
      type: 'string'
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string'
    }),
    defineField({
      name: 'province',
      title: 'Province',
      type: 'string'
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string'
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string'
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string'
    }),
    defineField({
      name: "businessName",
      title: "Business Name",
      type: "string"
    }),
    defineField({
      name: "instagramHandle",
      title: "Instagram Handle",
      type: "string"
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: ["admin", "vendor", "dev"]
      },
      initialValue: "vendor"
    })
  ]
})