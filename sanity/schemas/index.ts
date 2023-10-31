import { defineType } from "sanity";

export const vendorCategorySchema = defineType({
  name: 'vendorCategory',
  title: 'Vendor Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string'
    }
  ]
});

