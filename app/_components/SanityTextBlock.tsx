import { PortableTextComponents } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "sanity";

const components: PortableTextComponents = {
  block: {
    // Ex. 1: customizing common block types
    h1: ({ children }) => <h1 className="text-2xl">{children}</h1>,
    normal: ({ children }) => <p className="w-full min-h-[16px] mt-[1rem]" style={{ whiteSpace: 'pre-line' }}>{children}</p>,
    // span: ({ children }) => {
    //   return <span className="w-full min-h-[16px]">{children}</span>},
  },
};

type Props = {
  value: PortableTextBlock[];
};
const SanityTextBlock = ({ value }: Props) => {
  return <PortableText value={value} components={components} />;
};

export default SanityTextBlock;
