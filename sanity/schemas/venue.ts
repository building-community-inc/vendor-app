import { defineArrayMember, defineField, defineType } from "sanity";

export const venueSchema = defineType({
  name: "venue",
  title: "Venue",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "hours",
      title: "Hours",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "securityPhone",
      title: "Security Phone",
      type: "string",
    }),
    defineField({
      name: "loadInInstructions",
      title: "Load In Instructions",
      type: "text",
    }),
    defineField({
      name: "venueMap",
      title: "Venue Map",
      type: "image",
    }),
    defineField({
      name: "tables",
      title: "Tables",
      type: "array",
      of: [
        defineArrayMember({
          name: "table",
          title: "Table Number",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "TableInfo",
      title: "New Tables",
      type: "array",
      of: [
        defineArrayMember({
          name: "table",
          title: "Table",
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Id",
              type: "string",
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "number",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "venueMap",
    },
    prepare({ title, media }) {
      return {
        title,
        media,
      };
    },
  },
});
