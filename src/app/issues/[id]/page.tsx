import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { findIssueContext } from "../../../lib/geo-demo";
import Breadcrumbs from "../../../components/breadcrumbs";

interface Props {
  params: { id: string };
}

export default function IssuePage({ params }: Props) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return notFound();
  const ctx = findIssueContext(id);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={
          ctx
            ? [
                { label: "Countries", href: "/" },
                ...(ctx.countrySlug && ctx.countryName
                  ? [{ label: ctx.countryName, href: `/countries/${ctx.countrySlug}`, prefix: ctx.countryFlag }]
                  : []),
                ...(ctx.citySlug && ctx.cityName
                  ? [{ label: ctx.cityName, href: `/cities/${ctx.citySlug}`, prefix: ctx.cityFlag }]
                  : []),
                { label: "Policy", href: ctx.policyPath ? `/libraries/${ctx.policyPath}` : undefined },
                { label: `Issue #${id}` },
              ]
            : [{ label: `Issue #${id}` }]
        }
      />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-neutral-100">Issue #{id}: Improve bike lane safety downtown</h1>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Badge variant="outline">open</Badge>
            {ctx?.policyPath ? (
              <Link href={`/libraries/${ctx.policyPath}`} className="hover:underline underline-offset-4">{ctx.policyPath}</Link>
            ) : null}
            {(ctx?.cityName || ctx?.countryName) ? (
              <span>
                {ctx?.cityName ? `${ctx.cityName}, ` : ""}
                {ctx?.countryName ?? ""}
              </span>
            ) : null}
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


