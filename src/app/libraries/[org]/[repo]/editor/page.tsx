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
    children: [
      { name: "assessment.md", path: "/impact/assessment.md" },
    ],
  },
  {
    name: "metrics",
    path: "/metrics",
    isDir: true,
    children: [
      { name: "kpis.md", path: "/metrics/kpis.md" },
    ],
  },
  {
    name: "drafts",
    path: "/drafts",
    isDir: true,
    children: [
      { name: "night-bus-proposal.md", path: "/drafts/night-bus-proposal.md" },
    ],
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

const initialFileContents: Record<string, string> = {
  "/README.md": `---
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

See governance for voting thresholds and eligibility.`,

  "/governance.md": `# Governance

Decision model: Single-choice majority (Yes/No/Abstain)
- Quorum: 10% of snapshot electorate
- Threshold: > 50% Yes among non-abstain
- Snapshot: Electorate frozen at vote open
- Eligibility: Registered residents with verified ID

Roles
- Maintainers: curate agenda, merge approved proposals
- Reviewers: comment and request changes
- Observers: read-only access`,

  "/policies/transport.md": `---
title: Urban Mobility Policy
effective: 2025-04-01
version: 1.2.0
scope: Citywide
---

## Objectives
- Improve late-night transit availability
- Increase cycling mode share to 12% by 2027
- Reduce transit travel time variability by 15%

## Measures
1. Extend bus service to 01:30 (weekdays) and 02:30 (weekends)
2. Add 20 km of protected bike lanes (Class IV)
3. Transit Signal Priority on 8 corridors

## Budget & Funding
- Capital: $12.4M (corridor upgrades)
- Opex: $3.1M/yr (service hours)
Funding sources: local, state grant, congestion fee pilot

## Compliance & Risks
- ADA access maintained during works
- Construction noise limited to 08:00–18:00
- Risk: bus operator staffing — mitigation: phased hiring

## Monitoring
- Night ridership (boardings after 23:00)
- 85th percentile bus travel time
- Bike counts on protected corridors`,

  "/policies/housing.md": `---
title: Inclusive Housing Policy
effective: 2025-07-01
version: 0.9.0
---

## Goals
- Enable 8,000 new homes near transit by 2030
- 25% below-market units in public land projects

## Zoning Changes
- Upzone transit-rich areas to allow mid-rise (6–8 floors)
- Reduce minimum parking near subway to 0.2/unit

## Tenant Protections
- Relocation support (6 months) for impacted households
- Right-to-return for in-situ redevelopment

## Funding
- Housing trust top-up $50M
- Match state housing accelerator grants`,

  "/policies/climate.md": `# Climate Adaptation Policy

Topics: heat islands, flood mitigation, green roofs.

1. 100 ha of urban tree canopy by 2030
2. Green roof requirement for public buildings > 1,000 m²
3. Floodable parks in two basins`,

  "/impact/assessment.md": `# Impact Assessment

## Summary
Projected increase in late-night ridership of 18–25% within 12 months.

## Distributional Effects
- Benefits higher in service deserts; ensure equitable coverage.

## Budget Notes
- Sensitivity: diesel price +/- 20%`,

  "/metrics/kpis.md": `# KPIs

- On-time performance (OTP): target 88%
- Late-night boardings: +20% YoY
- Killed or Seriously Injured (KSI): -10%/yr on upgraded corridors`,

  "/drafts/night-bus-proposal.md": `# Proposal: Night Bus Routes Expansion

## Motivation
Service gaps between 23:30–01:30 lead to unsafe travel and ride-hailing dependency.

## Changes
- Extend 5 routes (N1–N5) to 01:30 (weekdays) and 02:30 (weekends)
- Staff 12 additional operators; depot shift adjustments

## Impact
- Expected +22% late-night boardings
- Budget: +$1.1M/yr (opex)

## Alternatives Considered
- Limited Fri/Sat only extension (rejected: equity concerns)`,

  "/attachments/links.md": `# References

- WHO: Road safety and speed management
- Transit Cooperative Research Program (TCRP): Night service planning
- NACTO: Urban Bikeway Design Guide`
};

export default function PolicyEditorPage() {
  const params = useParams<{ org: string; repo: string }>();
  const [current, setCurrent] = useState<string>("/README.md");
  const [files, setFiles] = useState<Record<string, string>>(initialFileContents);
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
        <Textarea
          rows={18}
          value={files[current] ?? ""}
          onChange={(e) =>
            setFiles((prev) => ({ ...prev, [current]: e.target.value }))
          }
        />
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


