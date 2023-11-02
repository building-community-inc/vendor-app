import { ListItemBuilder, StructureBuilder } from "sanity/desk";
import { termsSchema } from "../schemas/terms";

export default (S: StructureBuilder) => {
  const terms = S.listItem()
    .title(termsSchema.title || "Terms")
    .child(
      S.editor()
        .id(termsSchema.name)
        .schemaType(termsSchema.name)
        .documentId(termsSchema.name)
    );

  const hiddenDocTypes = (listItem: any) => {
    return ![termsSchema.name].includes(listItem.getId());
  };

  return S.list()
    .title("Content")
    .items([
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      S.divider(),
      terms
    ])
};
