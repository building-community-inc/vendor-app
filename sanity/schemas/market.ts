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
    // defineField({
    //   name: "description",
    //   title: "Description",
    //   type: "string",
    //   // validation: Rule => Rule.min(1, "Description of the Market is required")
    // }),

    defineField({
      name: "dates",
      title: "Dates",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
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
      name: "vendorInstructions",
      title: "Vendor Instructions",
      type: "text",
    }),
    defineField({
      name: "daysWithTables",
      title: "Days With Tables",
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
              name: "tables",
              title: "Tables",
              type: "array",
              of: [
                defineArrayMember({
                  name: "table",
                  title: "Table",
                  type: "object",
                  fields: [
                    defineField({
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
                    defineField({
                      name: "booked",
                      title: "Booked",
                      type: "reference",
                      to: [{ type: "user" }],
                    }),
                  ],
                  preview: {
                    select: {
                      tableId: "table.id",
                      businessName: "booked.business.businessName",
                      firstName: "booked.firstName",
                      lastName: "booked.lastName",
                      media: "booked.business.logo",
                    },
                    prepare({tableId, firstName, lastName, media, businessName}) {
                      if (!businessName) return {
                        title: `table # ${tableId} available`,
                        // media: 
                      }
                      return {
                        title: businessName,
                        subtitle: `${firstName} ${lastName}`,
                        media,
                      };
                    }
                  },
                }),
              ],
            }),
          ],
        }),
      ],
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
              name: "datesBooked",
              title: "Dates Booked",
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
                      name: "tableId",
                      title: "Table Id",
                      type: "string",
                    }),
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
          preview: {
            select: {
              businessName: "vendor.business.businessName",
              firstName: "vendor.firstName",
              lastName: "vendor.lastName",
              media: "vendor.business.logo",
            },
            prepare({firstName, lastName, media, businessName}) {
              return {
                title: businessName,
                subtitle: `${firstName} ${lastName}`,
                media,
              };
            }
          },
        }),
      ],
    }),
    defineField({
      name: "cancelled",
      title: "Cancelled",
      type: "boolean",
      initialValue: false
    })
  ],
});
