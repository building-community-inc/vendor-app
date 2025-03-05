import { defineArrayMember, defineField, defineType } from "sanity";
import { FaRegStar } from "react-icons/fa";

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
      ],
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
              type: "string",
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
          preview: {
            select: {
              title: "paymentType",
              subtitle: "amount",
            },
            prepare({ title, subtitle }) {
              return {
                title,
                subtitle: `$${subtitle}`,
                media: FaRegStar,
              };
            },
          }
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
      icon: FaRegStar,
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
                media: FaRegStar,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "paymentReturned",
      title: "Payment Returned",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["pending", "approved", "cancelled"]
      }
    })
  ],

  preview: {
    select: {
      title: "market.name",
      items: "items",
      media: "market.marketCover",
      business: "user.business.businessName",
    },
    prepare({ title, items, media, business }) {
      return {
        title,
        subtitle: `${business} - ${items.length} days`,
        media,
      };
    },
  },
});
