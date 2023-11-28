import { defineArrayMember, defineField, defineType } from "sanity";

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
      options: { hotspot: true },
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "reference",
      to: [{ type: "venue" }],
    }),
    defineField({
      name: "vendors",
      title: "Vendors",
      type: "array",
      of: [
        defineArrayMember({
          name: "vendorDetails",
          title: "Vendor Details",
          type: "object",
          fields: [
            defineField({
              name: "vendor",
              title: "Vendor",
              type: "reference",
              to: [{ type: "user" }],
            }),
            defineField({
              name: "datesSelected",
              title: "Dates Selected",
              type: "array",
              of: [
                defineArrayMember({
                  name: "day",
                  title: "Day",
                  type: "object",
                  fields: [
                    defineField({
                      name: "date",
                      title: "Date",
                      type: "string",
                    }),
                    defineField({
                      name: "tableSelected",
                      title: "Table Selected",
                      type: "string",
                    }),
                    defineField({
                      name: "tableConfirmed",
                      title: "Table Confirmed",
                      type: "string",
                    }),
                    defineField({
                      name: "confirmed",
                      title: "Confirmed",
                      type: "boolean",
                    })
                  ],
                }),
              ],
            }),

            defineField({
              name: "specialRequests",
              title: "Special Requests",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
});
