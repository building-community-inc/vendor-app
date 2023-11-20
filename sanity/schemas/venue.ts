import { defineField, defineType } from "sanity";

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
  ],
  preview: {
    select: {
      title: "title",
      media: "venueMap",
    },
    prepare({ title, media }) {
      return {
        title,
        media
      };
    },
  },
});
