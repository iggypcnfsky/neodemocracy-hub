"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import Breadcrumbs from "../../../../../components/breadcrumbs";
import { getPolicyContext } from "../../../../../lib/geo-demo";

type FileNode = {
  name: string;
  path: string;
  isDir?: boolean;
  children?: FileNode[];
};

const demoTree: FileNode[] = [
  { name: "README.md", path: "/README.md" },
  {
    name: "policies",
    path: "/policies",
    isDir: true,
    children: [
      { name: "transport.md", path: "/policies/transport.md" },
      { name: "housing.md", path: "/policies/housing.md" },
    ],
  },
  {
    name: "attachments",
    path: "/attachments",
    isDir: true,
    children: [
      { name: "map.pdf", path: "/attachments/map.pdf" },
    ],
  },
];

export default function PolicyEditorPage() {
  const params = useParams<{ org: string; repo: string }>();
  const [current, setCurrent] = useState<string>("/README.md");
  const [content, setContent] = useState<string>("# Policy draft\n\nEdit policy text here.\n");
  const [commitMsg, setCommitMsg] = useState<string>("Update policy draft");
  const ctx = getPolicyContext(String(params.org), String(params.repo));

  function renderTree(nodes: FileNode[]) {
    return (
      <ul className="space-y-1">
        {nodes.map((n) => (
          <li key={n.path}>
            <button
              className={[
                "w-full text-left px-2 py-1 rounded-md text-sm",
                current === n.path ? "bg-neutral-900 text-neutral-100" : "text-neutral-300 hover:text-neutral-100 hover:bg-neutral-900/60",
              ].join(" ")}
              onClick={() => setCurrent(n.path)}
            >
              {n.name}
            </button>
            {n.isDir && n.children ? (
              <div className="ml-3 border-l border-neutral-800 pl-2 mt-1">{renderTree(n.children)}</div>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-3">
      <Breadcrumbs
        items={
          ctx
            ? [
                { label: "Countries", href: "/" },
                { label: ctx.countryName, href: `/countries/${ctx.countrySlug}`, prefix: ctx.countryFlag },
                ...(ctx.citySlug
                  ? [{ label: ctx.cityName || "", href: `/cities/${ctx.citySlug}`, prefix: ctx.cityFlag }]
                  : []),
                { label: "Policy" },
                { label: `${params.org}/${params.repo}` },
                { label: "Editor" },
              ]
            : [
                { label: "Policy" },
                { label: `${params.org}/${params.repo}` },
                { label: "Editor" },
              ]
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="md:col-span-1">
        <CardContent className="p-3">
          <div className="text-xs text-neutral-400 mb-2">Files</div>
          {renderTree(demoTree)}
        </CardContent>
      </Card>
      <div className="md:col-span-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-400">Editing: {current}</div>
          <Link href={`/libraries/${params.org}/${params.repo}`} className="text-sm text-neutral-400 hover:underline">Back to policy</Link>
        </div>
        <Textarea rows={18} value={content} onChange={(e) => setContent(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <Input
            placeholder="Commit message"
            value={commitMsg}
            onChange={(e) => setCommitMsg(e.target.value)}
          />
          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <Button variant="outline">Discard</Button>
            <Button>Save</Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}


