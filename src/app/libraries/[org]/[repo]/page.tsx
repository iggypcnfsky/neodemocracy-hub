import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";

interface Props {
  params: { org: string; repo: string };
}

export default function LibraryPage({ params }: Props) {
  const { org, repo } = params;
  const fullName = `${decodeURIComponent(org)}/${decodeURIComponent(repo)}`;

  return (
    <div className="space-y-6">
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>README.md</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert text-sm">
            <p>This policy library contains drafts and approved policies for {fullName}.</p>
            <p>Use Issues to discuss, and Proposals to merge changes into <code>main</code>.</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Open Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[1, 2].map((i) => (
                <Link key={i} href={`/issues/${i}`} className="block text-sm text-neutral-200 hover:underline">
                  #{i} Improve bike lane safety downtown
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open Proposals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[1, 2].map((i) => (
                <Link key={i} href={`/proposals/${i}`} className="block text-sm text-neutral-200 hover:underline">
                  Proposal #{i}: Night bus routes expansion
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


