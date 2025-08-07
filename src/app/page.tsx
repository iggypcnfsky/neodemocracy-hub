"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export default function Home() {
  const [tab, setTab] = useState("repos");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-100">Explore</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">New Organization</Button>
          <Link href="/libraries/new"><Button size="sm">New Library</Button></Link>
        </div>
      </div>
      <Tabs
        tabs={[
          { key: "repos", label: "Policy Libraries", count: 3 },
          { key: "issues", label: "Issues", count: 12 },
          { key: "pulls", label: "Proposals", count: 5 },
          { key: "governance", label: "Governance" },
        ]}
        current={tab}
        onChange={setTab}
      />

      {tab === "repos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["City/Transport", "City/Housing", "University/Sustainability"].map((name) => (
            <Link key={name} href={`/libraries/${encodeURIComponent(name.split("/")[0])}/${encodeURIComponent(name.split("/")[1])}`}>
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-neutral-100">{name}</span>
                  <Badge>public</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-neutral-300">
                Policy repository. Drafts and proposals welcome.
                <div className="mt-3 flex items-center gap-3 text-neutral-400 text-xs">
                  <span>⭐ 42</span>
                  <span>🍴 7</span>
                  <span>Updated 1d ago</span>
                </div>
              </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {tab === "issues" && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-100">Improve bike lane safety downtown</div>
                  <div className="text-xs text-neutral-400">City/Transport • opened by alice</div>
                </div>
                <Badge variant="outline">open</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "pulls" && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-100">Proposal: Night bus routes expansion</div>
                  <div className="text-xs text-neutral-400">merge draft/night-bus → main</div>
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

      {tab === "governance" && (
        <Card>
          <CardHeader>
            <CardTitle>Governance Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-neutral-300 space-y-2">
            <div>Strategy: Single choice (Yes/No/Abstain)</div>
            <div>Quorum: 10% of snapshot electorate</div>
            <div>Secret ballots: Disabled</div>
            <div>Delegation: Enabled (1 hop)</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
