import { defineArrayMember, defineField, defineType } from "sanity";
import {StarIcon} from '@sanity/icons'

export const paymentRecordSchema = defineType({
  name: "paymentRecord",
  title: "Payment Record",
  type: "document",
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "market",
      title: "Market",
      type: "reference",
      to: [{ type: "market" }],
    }),
    defineField({
      name: "amount",
      title: "Amount",
      type: "object",
      fields: [
        defineField({
          name: "total",
          title: "Total",
          type: "number",
        }),
        defineField({
          name: "paid",
          title: "Paid",
          type: "number",
        }),
        defineField({
          name: "owed",
          title: "Owed",
          type: "number",
        }),
        defineField({
          name: "hst",
          title: "HST",
          type: "number",
        }),
      ]
    }),
    defineField({
      name: "payments",
      title: "Payments",
      type: "array",
      of: [
        defineArrayMember({
          name: "payment",
          title: "Payment",
          type: "object",
          fields: [
            defineField({
              name: "stripePaymentIntentId",
              title: "Stripe Payment Intent ID",
              type: "string",
            }),
            defineField({
              name: "paymentType",
              title: "Payment Type",
              type: "string"
            }),
            defineField({
              name: "amount",
              title: "Amount",
              type: "number",
            }),
            defineField({
              name: "paymentDate",
              title: "Payment Date",
              type: "datetime",
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      icon: StarIcon,
      of: [
        defineArrayMember({
          name: "item",
          title: "Item",
          type: "object",
          fields: [
            defineField({
              name: "price",
              title: "Price",
              type: "number",
            }),
            defineField({
              name: "name",
              title: "Name",
              type: "string",
            }),
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
          preview: {
            select: {
              title: "name",
              subtitle: "date",
            },
            prepare({ title, subtitle }) {
              return {
                title,
                subtitle,
                media: StarIcon
              };
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: "market.name",
      firstName: "user.firstName",
      lastName: "user.lastName",
      items: "items",
      media: "market.marketCover",
    },
    prepare({ title, firstName, lastName, items, media }) {
      return {
        title,
        subtitle: `${firstName} ${lastName} - ${items.length} days`,
        media,
      };
    },
  },
});
