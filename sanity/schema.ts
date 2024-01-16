import { type SchemaTypeDefinition } from 'sanity'
import { userSchema } from './schemas/user'
import { vendorCategorySchema } from './schemas'
import { businessSchema } from './schemas/business'
import { termsSchema } from './schemas/terms'
import { venueSchema } from './schemas/venue'
import { marketSchema } from './schemas/market'
import { paymentSchema } from './schemas/payment'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    userSchema,
    vendorCategorySchema,
    businessSchema,
    termsSchema,
    venueSchema,
    marketSchema,
    paymentSchema,
  ],
}
