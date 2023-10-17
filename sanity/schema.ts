import { type SchemaTypeDefinition } from 'sanity'
import { userSchema } from './schemas/user'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    userSchema,
  ],
}
