import { defineArrayMember, defineField, defineType } from "sanity";
import {StarIcon} from '@sanity/icons'

export const paymentSchema = defineType({
  name: "payment",
  title: "Payments",
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
      type: "number",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
    }),
    defineField({
      name: "stripePaymentIntendId",
      title: "Stripe Payment Intent ID",
      type: "string",
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
