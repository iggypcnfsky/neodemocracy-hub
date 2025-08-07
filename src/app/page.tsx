"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { GitPullRequest, MessageSquare, Users, FileText, MapPin } from "lucide-react";

export default function Home() {
  const [tab, setTab] = useState("countries");
  const [sortMode, setSortMode] = useState<"latest" | "trending">("latest");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-100">Explore</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">New Organization</Button>
          <Link href="/libraries/new"><Button size="sm">New Library</Button></Link>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        {[{k:"Policies",v:3},{k:"Issues",v:12},{k:"Proposals",v:5},{k:"Organizations",v:2}].map(({k,v})=> (
          <div key={k} className="rounded-md border border-neutral-800 bg-neutral-950/60 p-3">
            <div className="text-xs text-neutral-400">{k}</div>
            <div className="text-lg font-semibold text-neutral-100">{v}</div>
          </div>
        ))}
      </div>
      <Tabs
        tabs={[
          { key: "countries", label: "Countries", count: 5 },
          { key: "cities", label: "Cities", count: 5 },
          { key: "repos", label: "Policy", count: 3 },
          { key: "issues", label: "Issues", count: 12 },
          { key: "pulls", label: "Proposals", count: 5 },
        ]}
        current={tab}
        onChange={setTab}
      />

      {(tab === "repos" || tab === "issues" || tab === "pulls") && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-neutral-400">Sort:</span>
          <button
            className={[
              "px-2 py-1 rounded-md text-xs border",
              sortMode === "latest"
                ? "bg-neutral-900 text-neutral-100 border-neutral-800"
                : "text-neutral-300 border-neutral-800 hover:bg-neutral-900/60",
            ].join(" ")}
            onClick={() => setSortMode("latest")}
          >
            Latest
          </button>
          <button
            className={[
              "px-2 py-1 rounded-md text-xs border",
              sortMode === "trending"
                ? "bg-neutral-900 text-neutral-100 border-neutral-800"
                : "text-neutral-300 border-neutral-800 hover:bg-neutral-900/60",
            ].join(" ")}
            onClick={() => setSortMode("trending")}
          >
            Trending
          </button>
        </div>
      )}

      {tab === "repos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            const items = [
              { name: "SF/Transport", city: "San Francisco", country: "United States", stars: 42, forks: 7, updated: "1d ago" },
              { name: "Berlin/Mobility", city: "Berlin", country: "Germany", stars: 31, forks: 5, updated: "3d ago" },
              { name: "Tokyo/Resilience", city: "Tokyo", country: "Japan", stars: 27, forks: 4, updated: "2d ago" },
            ];
            const sorted = sortMode === "trending" ? [...items].sort((a, b) => b.stars - a.stars) : items;
            return sorted;
          })().map((item) => (
            <Link key={item.name} href={`/libraries/${encodeURIComponent(item.name.split("/")[0])}/${encodeURIComponent(item.name.split("/")[1])}`}>
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span className="text-neutral-100">{item.name}</span>
                  <Badge>public</Badge>
                </CardTitle>
              </CardHeader>
                <CardContent className="text-sm text-neutral-300 space-y-3">
                  <div>Collaborative policy library. Drafts and proposals welcome.</div>
                  <div className="flex items-center gap-3 text-neutral-400 text-xs">
                    <span>⭐ {item.stars}</span>
                    <span>🍴 {item.forks}</span>
                    <span>Updated {item.updated}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-200">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    <span className="text-xs">{item.city}, {item.country}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2 text-neutral-200">
                      <MessageSquare className="h-4 w-4 text-neutral-400" />
                      <span className="text-xs">Open issues:</span>
                      <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
                        {[
                          { id: 128, title: "Protected intersections" },
                          { id: 129, title: "Bus signal priority" },
                        ].map((i) => (
                          <Link key={i.id} href={`/issues/${i.id}`} className="underline-offset-4 hover:underline">
                            #{i.id} {i.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-200">
                      <GitPullRequest className="h-4 w-4 text-neutral-400" />
                      <span className="text-xs">Recent proposals:</span>
                      <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
                        {[
                          { id: 9001, title: "Night bus expansion" },
                          { id: 9004, title: "Bike lane buffers" },
                        ].map((p) => (
                          <Link key={p.id} href={`/proposals/${p.id}`} className="underline-offset-4 hover:underline">
                            {p.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="text-xs text-neutral-400">Default branch: main</div>
                  <Button size="sm" variant="outline">Open</Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {tab === "issues" && (
        <div className="space-y-2">
          {(() => {
            const items = [
              { id: 128, title: "Improve bike lane safety downtown", policy: "SF/Transport", city: "San Francisco", country: "United States" },
              { id: 55, title: "Rail punctuality improvements", policy: "Germany/Transport", city: "Berlin", country: "Germany" },
              { id: 204, title: "Metro interchange optimization", policy: "India/Urban", city: "Mumbai", country: "India" },
            ];
            const sorted = sortMode === "trending" ? [...items].sort((a, b) => b.id - a.id) : items;
            return sorted;
          })().map((item) => (
            <Card key={item.id}>
              <CardContent className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-100">{item.title}</div>
                  <div className="text-xs text-neutral-400">{item.policy} • {item.city}, {item.country} • opened by alice</div>
                </div>
                <Badge variant="outline">open</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "pulls" && (
        <div className="space-y-2">
          {(() => {
            const items = [
              { id: 9001, title: "Night bus routes expansion", branches: "draft/night-bus → main", policy: "SF/Transport", city: "San Francisco", country: "United States" },
              { id: 9002, title: "S-Bahn priority lanes", branches: "draft/sbahn-priority → main", policy: "Germany/Transport", city: "Berlin", country: "Germany" },
              { id: 9003, title: "E-bus procurement", branches: "draft/ebus-procurement → main", policy: "India/Transport", city: "Mumbai", country: "India" },
            ];
            const sorted = sortMode === "trending" ? [...items].reverse() : items;
            return sorted;
          })().map((item) => (
            <Card key={item.id}>
              <CardContent className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-100">Proposal: {item.title}</div>
                  <div className="text-xs text-neutral-400">{item.branches} • {item.policy} • {item.city}, {item.country}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>review</Badge>
                  <Badge variant="success">vote open</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Governance tab removed; available via top navigation only */}

      {tab === "countries" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              flag: "🇺🇸",
              name: "United States",
              citizens: "333M",
              policies: ["USA/Transport", "USA/Housing", "USA/Climate"],
              issues: 24,
              proposals: 9,
              cities: ["San Francisco", "New York", "Austin"],
              highlights: {
                issues: ["#128 Protected intersections", "#134 Transit reliability"],
                proposals: ["Night bus expansion", "Building efficiency codes"],
              },
            },
            {
              flag: "🇩🇪",
              name: "Germany",
              citizens: "84M",
              policies: ["Germany/Energy", "Germany/Transport"],
              issues: 11,
              proposals: 4,
              cities: ["Berlin", "Munich"],
              highlights: {
                issues: ["#55 Rail punctuality", "#62 EV charging"],
                proposals: ["S-Bahn priority lanes"],
              },
            },
            {
              flag: "🇯🇵",
              name: "Japan",
              citizens: "124M",
              policies: ["Japan/Transport", "Japan/Disaster-Readiness"],
              issues: 13,
              proposals: 5,
              cities: ["Tokyo", "Osaka"],
              highlights: {
                issues: ["#22 Flood mitigation", "#31 Platform safety"],
                proposals: ["Shinkansen off-peak pricing"],
              },
            },
            {
              flag: "🇧🇷",
              name: "Brazil",
              citizens: "203M",
              policies: ["Brazil/Housing", "Brazil/Transport"],
              issues: 16,
              proposals: 6,
              cities: ["São Paulo", "Rio de Janeiro"],
              highlights: {
                issues: ["#77 BRT expansion", "#81 Housing subsidy"],
                proposals: ["Favela upgrading program"],
              },
            },
            {
              flag: "🇮🇳",
              name: "India",
              citizens: "1.43B",
              policies: ["India/Urban", "India/Transport"],
              issues: 28,
              proposals: 12,
              cities: ["Mumbai", "Bengaluru", "Delhi"],
              highlights: {
                issues: ["#204 Metro interchanges", "#219 Air quality"],
                proposals: ["E-bus procurement"],
              },
            },
          ].map((c) => {
            const slug = c.name.toLowerCase().replace(/\s+/g, "-");
            return (
            <Card key={c.name}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Link href={`/countries/${slug}`} className="text-neutral-100 underline-offset-4 hover:underline">
                    {c.flag} {c.name}
                  </Link>
                  <span className="text-xs text-neutral-400">{c.policies.length} policies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-neutral-300 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md border border-neutral-800 bg-neutral-950/60 p-2">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400"><Users className="h-3 w-3"/> Citizens</div>
                    <div className="text-sm text-neutral-100">{c.citizens}</div>
                  </div>
                  <div className="rounded-md border border-neutral-800 bg-neutral-950/60 p-2">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400"><MessageSquare className="h-3 w-3"/> Issues</div>
                    <div className="text-sm text-neutral-100">{c.issues}</div>
                  </div>
                  <div className="rounded-md border border-neutral-800 bg-neutral-950/60 p-2">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400"><GitPullRequest className="h-3 w-3"/> Proposals</div>
                    <div className="text-sm text-neutral-100">{c.proposals}</div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-neutral-400 mb-1"><FileText className="h-3 w-3"/> Policies</div>
                  <div className="flex flex-wrap gap-2">
                    {c.policies.map((p) => {
                      const [org, repo] = p.split("/");
                      return (
                        <Link key={p} href={`/libraries/${encodeURIComponent(org)}/${encodeURIComponent(repo)}`} className="underline-offset-4 hover:underline">
                          {p}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-neutral-400 mb-1"><MapPin className="h-3 w-3"/> Cities</div>
                  <div className="flex flex-wrap gap-2 text-xs text-neutral-300">
                    {c.cities.map((city) => (
                      <Link key={city} href={`/cities/${city.toLowerCase().replace(/\s+/g, "-")}`} className="rounded border border-neutral-800 bg-neutral-950/60 px-2 py-0.5 hover:underline underline-offset-4">{city}</Link>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-neutral-400 mb-1"><MessageSquare className="h-3 w-3"/> Recent issues</div>
                    <div className="flex flex-col gap-1 text-xs text-neutral-300">
                      {c.highlights.issues.map((i, idx) => (
                        <Link key={idx} href="/issues/1" className="underline-offset-4 hover:underline">{i}</Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-neutral-400 mb-1"><GitPullRequest className="h-3 w-3"/> Recent proposals</div>
                    <div className="flex flex-col gap-1 text-xs text-neutral-300">
                      {c.highlights.proposals.map((p, idx) => (
                        <Link key={idx} href="/proposals/1" className="underline-offset-4 hover:underline">{p}</Link>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );})}
        </div>
      )}

      {tab === "cities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              flag: "🇺🇸",
              name: "San Francisco",
              citizens: "0.81M",
              policies: ["SF/Transport", "SF/Housing"],
              issues: 9,
              proposals: 3,
              highlights: {
                issues: ["#18 Bike lane safety", "#24 Transit signal priority"],
                proposals: ["Congestion pricing pilot"],
              },
            },
            {
              flag: "🇩🇪",
              name: "Berlin",
              citizens: "3.6M",
              policies: ["Berlin/Mobility", "Berlin/Sustainability"],
              issues: 6,
              proposals: 2,
              highlights: {
                issues: ["#12 Fahrradstraße expansion"],
                proposals: ["U-Bahn accessibility upgrades"],
              },
            },
            {
              flag: "🇯🇵",
              name: "Tokyo",
              citizens: "13.9M",
              policies: ["Tokyo/Transport", "Tokyo/Resilience"],
              issues: 8,
              proposals: 3,
              highlights: {
                issues: ["#33 Platform doors coverage"],
                proposals: ["Night service adjustments"],
              },
            },
            {
              flag: "🇧🇷",
              name: "São Paulo",
              citizens: "12.3M",
              policies: ["SaoPaulo/Housing", "SaoPaulo/Transport"],
              issues: 10,
              proposals: 4,
              highlights: {
                issues: ["#71 BRT capacity"],
                proposals: ["Bicycle superhighway"],
              },
            },
            {
              flag: "🇮🇳",
              name: "Mumbai",
              citizens: "12.5M",
              policies: ["Mumbai/Urban", "Mumbai/Transport"],
              issues: 12,
              proposals: 5,
              highlights: {
                issues: ["#201 Last-mile connectivity"],
                proposals: ["Harbour line upgrade"],
              },
            },
          ].map((c) => (
            <Card key={c.name}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-neutral-100">{c.flag} {c.name}</span>
                  <span className="text-xs text-neutral-400">{c.policies.length} policies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-neutral-300 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md border border-neutral-800 bg-neutral-950/60 p-2">
                    <div className="text-[10px] text-neutral-400">Citizens</div>
                    <div className="text-sm text-neutral-100">{c.citizens}</div>
                  </div>
                  <div className="rounded-md border border-neutral-800 bg-neutral-950/60 p-2">
                    <div className="text-[10px] text-neutral-400">Issues</div>
                    <div className="text-sm text-neutral-100">{c.issues}</div>
                  </div>
                  <div className="rounded-md border border-neutral-800 bg-neutral-950/60 p-2">
                    <div className="text-[10px] text-neutral-400">Proposals</div>
                    <div className="text-sm text-neutral-100">{c.proposals}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-neutral-400 mb-1">Policies</div>
                  <div className="flex flex-wrap gap-2">
                    {c.policies.map((p) => {
                      const [org, repo] = p.split("/");
                      return (
                        <Link key={p} href={`/libraries/${encodeURIComponent(org)}/${encodeURIComponent(repo)}`} className="underline-offset-4 hover:underline">
                          {p}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-neutral-400 mb-1">Recent issues</div>
                    <ul className="text-xs text-neutral-300 list-disc ml-4">
                      {c.highlights.issues.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400 mb-1">Recent proposals</div>
                    <ul className="text-xs text-neutral-300 list-disc ml-4">
                      {c.highlights.proposals.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
