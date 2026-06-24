import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/sanity/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-cream/75 leading-relaxed mb-5">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-3xl font-semibold text-cream mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-2xl font-semibold text-cream mt-10 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-display text-xl font-semibold text-cream mt-8 mb-2">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-gold pl-5 my-6 italic text-cream/80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 mb-5 text-cream/75 marker:text-gold">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 mb-5 text-cream/75 marker:text-gold">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-cream">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-white/10 text-gold-light rounded px-1.5 py-0.5 text-[0.9em] font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gold underline underline-offset-2 hover:text-gold-light"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const url = urlForImage(value).width(1200).fit("max").url();
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={value?.alt ?? ""} className="w-full rounded-xl border border-white/10" />
          {value?.caption && (
            <figcaption className="text-center text-sm text-cream/40 mt-3">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
};

export default function PortableTextBody({ value }: { value: unknown[] }) {
  return <PortableText value={value as never} components={components} />;
}
