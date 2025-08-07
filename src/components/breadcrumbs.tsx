import Link from "next/link";

export type Crumb = {
  label: string;
  href?: string;
  prefix?: string; // emoji or short text (e.g., flag)
};

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-neutral-400">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, idx) => {
          const content = (
            <span className="inline-flex items-center gap-1">
              {item.prefix ? <span>{item.prefix}</span> : null}
              <span className={item.href ? "hover:underline underline-offset-4 text-neutral-300" : "text-neutral-400"}>{item.label}</span>
            </span>
          );
          return (
            <li key={idx} className="inline-flex items-center gap-1">
              {item.href ? <Link href={item.href}>{content}</Link> : content}
              {idx < items.length - 1 ? <span className="px-1 text-neutral-600">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


