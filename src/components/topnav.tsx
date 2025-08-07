"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Library, GitPullRequest, Scale, Search, Plus, LayoutGrid, ChevronDown } from "lucide-react";

const links = [
  { href: "/", label: "Policy", icon: LayoutGrid },
  { href: "/issues", label: "Issues", icon: GitPullRequest },
  { href: "/proposals", label: "Proposals", icon: Library },
  { href: "/governance", label: "Governance", icon: Scale },
];

export default function TopNav() {
  const pathname = usePathname();
  const [openCreate, setOpenCreate] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setOpenCreate(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/50">
      <div className="relative mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
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
        <div className="hidden sm:flex w-48 items-center gap-2">
          <Search className="h-4 w-4 text-neutral-500" />
          <Input placeholder="Search..." aria-label="Search" />
        </div>
        <div className="flex items-center gap-2" ref={menuRef}>
          <Button
            variant="secondary"
            size="sm"
            aria-haspopup="menu"
            aria-expanded={openCreate}
            onClick={() => setOpenCreate((v) => !v)}
          >
            <Plus className="h-4 w-4 mr-1" /> Create <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
          {openCreate && (
            <div
              role="menu"
              className="absolute right-4 top-12 w-48 rounded-md border border-neutral-800 bg-neutral-950 shadow-lg"
            >
              <Link href="/libraries/new" className="block px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900" role="menuitem">
                New Policy Library
              </Link>
              <Link href="/issues/new" className="block px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900" role="menuitem">
                New Issue
              </Link>
              <Link href="/proposals/new" className="block px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900" role="menuitem">
                New Proposal
              </Link>
            </div>
          )}
          <Button variant="ghost" size="sm" aria-label="Profile">⚙︎</Button>
        </div>
      </div>
    </header>
  );
}


