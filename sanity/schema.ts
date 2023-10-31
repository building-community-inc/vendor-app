import { type SchemaTypeDefinition } from 'sanity'
import { userSchema } from './schemas/user'
import { vendorCategorySchema } from './schemas'
import { businessSchema } from './schemas/business'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    userSchema,
    vendorCategorySchema,
    businessSchema,
  ],
}
