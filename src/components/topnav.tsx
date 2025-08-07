"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const links = [
  { href: "/", label: "Policy Libraries" },
  { href: "/issues", label: "Issues" },
  { href: "/proposals", label: "Proposals" },
  { href: "/governance", label: "Governance" },
];

export default function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/50">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
        <Link href="/" className="text-neutral-100 font-semibold text-sm">
          NeoDemocracy
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "px-3 py-2 text-sm rounded-md",
                  active
                    ? "bg-neutral-900 text-neutral-100 border border-neutral-800"
                    : "text-neutral-300 hover:text-neutral-100",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex-1" />
        <div className="hidden sm:flex w-64">
          <Input placeholder="Search..." aria-label="Search" />
        </div>
        <div className="flex items-center gap-2">
          <Link href="/libraries/new"><Button variant="secondary" size="sm">New Library</Button></Link>
          <Link href="/issues/new"><Button variant="secondary" size="sm">New Issue</Button></Link>
          <Link href="/proposals/new"><Button size="sm">New Proposal</Button></Link>
          <Button variant="ghost" size="sm" aria-label="Profile">⚙︎</Button>
        </div>
      </div>
    </header>
  );
}


