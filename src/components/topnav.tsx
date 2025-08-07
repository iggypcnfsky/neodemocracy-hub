"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Library, GitPullRequest, Scale, Search, Plus, LayoutGrid } from "lucide-react";

const links = [
  { href: "/", label: "Policy", icon: LayoutGrid },
  { href: "/issues", label: "Issues", icon: GitPullRequest },
  { href: "/proposals", label: "Proposals", icon: Library },
  { href: "/governance", label: "Governance", icon: Scale },
];

export default function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/50">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 text-neutral-100 font-semibold text-sm">
          <LayoutGrid className="h-4 w-4" />
          NeoDemocracy
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {links.map((l) => {
            const active = pathname === l.href;
            const Icon = l.icon;
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
                <span className="inline-flex items-center gap-2">
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  {l.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="flex-1" />
        <div className="hidden sm:flex w-64 items-center gap-2">
          <Search className="h-4 w-4 text-neutral-500" />
          <Input placeholder="Search..." aria-label="Search" />
        </div>
        <div className="flex items-center gap-2">
          <Link href="/libraries/new"><Button variant="secondary" size="sm"><Plus className="h-4 w-4 mr-1" /> New Library</Button></Link>
          <Link href="/issues/new"><Button variant="secondary" size="sm"><Plus className="h-4 w-4 mr-1" /> New Issue</Button></Link>
          <Link href="/proposals/new"><Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Proposal</Button></Link>
          <Button variant="ghost" size="sm" aria-label="Profile">⚙︎</Button>
        </div>
      </div>
    </header>
  );
}


