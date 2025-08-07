"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";

export default function NewLibraryPage() {
  const router = useRouter();
  const [org, setOrg] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = `/libraries/${encodeURIComponent(org)}/${encodeURIComponent(name)}`;
    router.push(url);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-neutral-100">New Policy Library</h1>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Organization (e.g., City)"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                required
              />
              <Input
                placeholder="Library name (e.g., Transport)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Textarea
              placeholder="Describe the purpose of this policy library"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit">Create Library</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


