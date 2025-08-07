import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import Breadcrumbs from "../../../components/breadcrumbs";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default function ProposalPage({ params }: Props) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return notFound();

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Countries", href: "/" }, { label: "United States", href: "/countries/united-states", prefix: "🇺🇸" }, { label: "San Francisco", href: "/cities/san-francisco" }, { label: "Policy", href: "/libraries/SF/Transport" }, { label: `Proposal #${id}` }]} />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-neutral-100">Proposal #{id}: Night bus routes expansion</h1>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Badge>review</Badge>
            <Badge variant="success">vote open</Badge>
            <Link href="/libraries/SF/Transport" className="hover:underline underline-offset-4">SF/Transport</Link>
            <span>San Francisco, United States</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Comment</Button>
          <Button>Open Vote</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-neutral-300 space-y-2">
              <div className="rounded-md border border-neutral-800 bg-neutral-950 p-3">
                <pre className="text-xs overflow-auto">
{`diff --git a/policy.md b/policy.md
@@
- Service ends at 11:30 PM on weekdays.
+ Service ends at 1:30 AM on weekdays.
`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-300 space-y-2">
              <div>Opened by alice 2d ago</div>
              <div>2 reviewers requested changes</div>
              <div>Vote window: pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Checks</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-300 space-y-2">
              <div>Compliance check: passing</div>
              <div>Budget impact: medium</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


