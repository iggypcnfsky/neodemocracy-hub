import Link from "next/link";
import Breadcrumbs from "../../../../components/breadcrumbs";
import { getPolicyContext, countries, cities } from "../../../../lib/geo-demo";
import SystemicLens from "../../../../components/systemic-lens";

type FileNode = {
  name: string;
  path: string;
  isDir?: boolean;
  children?: FileNode[];
};

const demoTree: FileNode[] = [
  { name: "README.md", path: "/README.md" },
  { name: "governance.md", path: "/governance.md" },
  {
    name: "policies",
    path: "/policies",
    isDir: true,
    children: [
      { name: "transport.md", path: "/policies/transport.md" },
      { name: "housing.md", path: "/policies/housing.md" },
      { name: "climate.md", path: "/policies/climate.md" },
    ],
  },
  {
    name: "impact",
    path: "/impact",
    isDir: true,
    children: [{ name: "assessment.md", path: "/impact/assessment.md" }],
  },
  {
    name: "metrics",
    path: "/metrics",
    isDir: true,
    children: [{ name: "kpis.md", path: "/metrics/kpis.md" }],
  },
  {
    name: "drafts",
    path: "/drafts",
    isDir: true,
    children: [{ name: "night-bus-proposal.md", path: "/drafts/night-bus-proposal.md" }],
  },
  {
    name: "attachments",
    path: "/attachments",
    isDir: true,
    children: [
      { name: "map.pdf", path: "/attachments/map.pdf" },
      { name: "links.md", path: "/attachments/links.md" },
    ],
  },
];

const readmeContent = `---
title: Policy Library
description: Collaborative policy workspace for mobility and housing.
updated: 2025-01-05
---

# Overview

This library contains authoritative policy documents, draft proposals, and supporting evidence.

Contents:
- /policies — adopted policies organized by topic
- /drafts — active proposals under review
- /impact — impact assessments and budget notes
- /metrics — outcomes and KPIs
- /governance.md — decision rules and roles

See governance for voting thresholds and eligibility.`;

function renderTree(nodes: FileNode[], editorHref: string) {
  return (
    <ul className="space-y-1">
      {nodes.map((n) => (
        <li key={n.path}>
          <Link
            href={editorHref}
            className="block px-2 py-1 rounded-md text-sm text-neutral-300 hover:text-neutral-100 hover:bg-neutral-900/60"
          >
            {n.name}
          </Link>
          {n.isDir && n.children ? (
            <div className="ml-3 border-l border-neutral-800 pl-2 mt-1">
              {renderTree(n.children, editorHref)}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { FolderTree, FileText, Network, Users as UsersIcon, Coins, MessageSquare, GitPullRequest } from "lucide-react";

interface Props {
  params: { org: string; repo: string };
}

export default function LibraryPage({ params }: Props) {
  const { org, repo } = params;
  const fullName = `${decodeURIComponent(org)}/${decodeURIComponent(repo)}`;
  const ctx = getPolicyContext(decodeURIComponent(org), decodeURIComponent(repo));
  const policyPath = `${decodeURIComponent(org)}/${decodeURIComponent(repo)}`;
  const relatedCountryPolicies = ctx?.countrySlug
    ? (countries.find((c) => c.slug === ctx.countrySlug)?.policies || []).filter((p) => p !== policyPath).slice(0, 3)
    : [];
  const relatedCityPolicies = ctx?.citySlug
    ? (cities.find((c) => c.slug === ctx.citySlug)?.policies || []).filter((p) => p !== policyPath).slice(0, 3)
    : [];

  return (
    <div className="space-y-6">
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
                { label: fullName },
              ]
            : [
                { label: "Policy" },
                { label: fullName },
              ]
        }
      />
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-xs text-neutral-400">Policy Library</div>
          <h1 className="text-xl font-semibold text-neutral-100">{fullName}</h1>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Badge>public</Badge>
            <span>⭐ 42</span>
            <span>🍴 7</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/issues/new?org=${encodeURIComponent(org)}&repo=${encodeURIComponent(repo)}`}>
            <Button variant="outline">New Issue</Button>
          </Link>
          <Link href={`/proposals/new?org=${encodeURIComponent(org)}&repo=${encodeURIComponent(repo)}`}>
            <Button>New Proposal</Button>
          </Link>
          <Link href={`/libraries/${encodeURIComponent(org)}/${encodeURIComponent(repo)}/editor`}>
            <Button variant="secondary">Open Editor</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FolderTree className="h-4 w-4"/> Files</CardTitle>
          </CardHeader>
          <CardContent>
            {renderTree(demoTree, `/libraries/${encodeURIComponent(org)}/${encodeURIComponent(repo)}/editor`)}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4"/> README.md</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs text-neutral-300 whitespace-pre-wrap">{readmeContent}</pre>
          </CardContent>
        </Card>

        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Network className="h-4 w-4"/> Systemic Lens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-neutral-300">
            <div className="text-xs text-neutral-400">Relationships to other policies in the same system.</div>
            <SystemicLens centerLabel={fullName} countryPolicies={relatedCountryPolicies} cityPolicies={relatedCityPolicies} />
            <div className="text-xs text-neutral-500">Diagram is illustrative; precise dependencies are defined per policy and validated during review.</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UsersIcon className="h-4 w-4"/> Who will it impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-neutral-300">
            {[
              { label: "Transit riders (late-night)", pct: 65 },
              { label: "Night shift workers", pct: 42 },
              { label: "Small businesses (night economy)", pct: 28 },
              { label: "Logistics and deliveries", pct: 20 },
              { label: "Universities & hospitals", pct: 15 },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-200">{s.label}</span>
                  <span className="text-neutral-400 text-xs">{s.pct}%</span>
                </div>
                <div className="h-2 w-full rounded bg-neutral-900 border border-neutral-800">
                  <div
                    className="h-full rounded bg-neutral-700"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="text-xs text-neutral-500">
              Estimates based on current service patterns and census of commuters; refine in Impact Assessment.
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Coins className="h-4 w-4"/> Financial Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-neutral-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-md border border-neutral-800 bg-neutral-950/60 p-3">
                <div className="text-xs text-neutral-400">Capital (one-time)</div>
                <div className="text-lg text-neutral-100">$12.4M</div>
              </div>
              <div className="rounded-md border border-neutral-800 bg-neutral-950/60 p-3">
                <div className="text-xs text-neutral-400">Operating (annual)</div>
                <div className="text-lg text-neutral-100">$3.1M/yr</div>
              </div>
              <div className="rounded-md border border-neutral-800 bg-neutral-950/60 p-3">
                <div className="text-xs text-neutral-400">5-year projection</div>
                <div className="text-lg text-neutral-100">$27.9M</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-neutral-400 mb-2">Yearly Breakdown</div>
              <div className="space-y-2">
                {[
                  { year: "Y1", capex: 12.4, opex: 3.1 },
                  { year: "Y2", capex: 0.0, opex: 3.1 },
                  { year: "Y3", capex: 0.0, opex: 3.1 },
                  { year: "Y4", capex: 0.0, opex: 3.1 },
                  { year: "Y5", capex: 0.0, opex: 3.1 },
                ].map((row) => {
                  const max = 12.4 + 3.1; // normalize bars against Y1 total
                  const total = row.capex + row.opex;
                  const pctTotal = Math.max(10, Math.min(100, (total / max) * 100));
                  const pctCapex = total > 0 ? (row.capex / total) * 100 : 0;
                  const pctOpex = total > 0 ? (row.opex / total) * 100 : 0;
                  return (
                    <div key={row.year} className="flex items-center gap-3">
                      <div className="w-10 text-xs text-neutral-400">{row.year}</div>
                      <div className="flex-1 h-3 rounded bg-neutral-900 border border-neutral-800 overflow-hidden">
                        <div className="h-full bg-neutral-700" style={{ width: `${pctTotal}%` }}>
                          <div className="h-full flex" style={{ width: "100%" }}>
                            {pctCapex > 0 ? (
                              <div className="h-full bg-neutral-500" style={{ width: `${pctCapex}%` }} />
                            ) : null}
                            {pctOpex > 0 ? (
                              <div className="h-full bg-neutral-300/60" style={{ width: `${pctOpex}%` }} />
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="w-20 text-right text-xs text-neutral-400">${(total).toFixed(1)}M</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                <div className="inline-flex items-center gap-1"><span className="inline-block h-2 w-3 bg-neutral-500"/> CapEx</div>
                <div className="inline-flex items-center gap-1"><span className="inline-block h-2 w-3 bg-neutral-300/60"/> OpEx</div>
              </div>
            </div>

            <div className="text-xs text-neutral-500">
              Notes: One-time corridor upgrades booked in Y1; operations recur annually. Projection excludes grant contingencies.
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UsersIcon className="h-4 w-4"/> Contributors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-neutral-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: "Alice Johnson", role: "Maintainer", stats: "12 commits • 2 proposals" },
                { name: "Bob Lee", role: "Reviewer", stats: "8 reviews • 5 comments" },
                { name: "Priya Singh", role: "Analyst", stats: "impact assessment" },
                { name: "Diego Santos", role: "Contributor", stats: "docs + data" },
              ].map((u) => (
                <div key={u.name} className="flex items-center gap-3 rounded border border-neutral-800 bg-neutral-950/60 p-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-800 text-neutral-200 flex items-center justify-center text-xs">
                    {u.name.split(" ").map((p) => p[0]).slice(0,2).join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-neutral-100">{u.name}</div>
                    <div className="text-xs text-neutral-400">{u.role} • {u.stats}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Open Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[128, 24, 12].map((i) => (
              <Link key={i} href={`/issues/${i}`} className="block text-sm text-neutral-200 hover:underline">
                #{i} View issue
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GitPullRequest className="h-4 w-4"/> Open Proposals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[9001, 9002].map((i) => (
              <Link key={i} href={`/proposals/${i}`} className="block text-sm text-neutral-200 hover:underline">
                Proposal #{i}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


