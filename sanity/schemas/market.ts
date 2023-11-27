import { defineField, defineType } from "sanity";

export const marketSchema = defineType({
  name: "market",
  title: "Market",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      // validation: Rule => Rule.min(1, "Name of the Market is required")
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      // validation: Rule => Rule.min(1, "Description of the Market is required")
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      // validation: Rule => Rule.min(1, "Price per day is required")
    }),
    defineField({
      name: "dates",
      title: "Dates",
      type: "array",
      of: [{ type: "string" }],
      // validation: Rule => Rule.min(1, "At least one day is required")
    }),
    defineField({
      name: "marketCover",
      title: "Market Cover",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "reference",
      to: [{ type: "venue" }],
    })
  ],
});