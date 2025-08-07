import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import Breadcrumbs from "../../../components/breadcrumbs";

interface Props {
  params: { id: string };
}

export default function IssuePage({ params }: Props) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return notFound();

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Countries", href: "/" }, { label: "United States", href: "/countries/united-states", prefix: "🇺🇸" }, { label: "San Francisco", href: "/cities/san-francisco" }, { label: "Policy", href: "/libraries/SF/Transport" }, { label: `Issue #${id}` }]} />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-neutral-100">Issue #{id}: Improve bike lane safety downtown</h1>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Badge variant="outline">open</Badge>
            <Link href="/libraries/SF/Transport" className="hover:underline underline-offset-4">SF/Transport</Link>
            <span>San Francisco, United States</span>
            <span>opened by alice</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Comment</Button>
          <Button>Create Proposal</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-neutral-300 space-y-2">
            <p>Several near misses reported at 5th and Main. Propose adding protected intersections and better signage.</p>
            <p>Consider coordination with bus routes and emergency access.</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Linked Proposals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-neutral-300">None yet</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


