"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";

export default function NewProposalPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceBranch, setSourceBranch] = useState("draft/change");
  const [targetBranch, setTargetBranch] = useState("main");
  const org = params.get("org") ?? "";
  const repo = params.get("repo") ?? "";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = Math.floor(Math.random() * 1000) + 100;
    router.push(`/proposals/${id}`);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-neutral-100">New Proposal</h1>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Organization" value={org} readOnly aria-label="Organization" />
              <Input placeholder="Policy Library" value={repo} readOnly aria-label="Policy Library" />
            </div>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Source branch"
                value={sourceBranch}
                onChange={(e) => setSourceBranch(e.target.value)}
                required
              />
              <Input
                placeholder="Target branch"
                value={targetBranch}
                onChange={(e) => setTargetBranch(e.target.value)}
                required
              />
            </div>
            <Textarea
              placeholder="Describe the proposed changes and rationale"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit">Create Proposal</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


