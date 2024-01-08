import { defineField, defineType } from "sanity";


export const businessSchema = defineType({
  name: "business",
  title: "Business",
  type: "document",
  fields: [
    defineField({
      name: 'funny',
      title: 'funny 1',
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
      name: "industry",
      title: "Industry",
      type: "string"
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image"
    }),
    defineField({
      name: "pdf",
      title: "Pdf",
      type: "array",
      of: [{type: "file"}]
    }),
  ],
  preview: {
    select: {
      title: "businessName"
    },
    prepare({title}) {
      return {
        title
      }
    }
  },


});