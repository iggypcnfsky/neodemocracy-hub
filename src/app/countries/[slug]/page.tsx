import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Users, FileText, MessageSquare, GitPullRequest, MapPin } from "lucide-react";
import { findCountry } from "../../../lib/geo-demo";
import Breadcrumbs from "../../../components/breadcrumbs";
import PresenceMap from "../../../components/presence-map";

interface Props {
  params: { slug: string };
}

export default function CountryPage({ params }: Props) {
  const country = findCountry(params.slug);
  if (!country) return notFound();

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Countries", href: "/" }, { label: country.name, prefix: country.flag }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-100">{country.flag} {country.name}</h1>
        <div className="text-xs text-neutral-400">{country.policies.length} policies</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-3">
          <CardContent>
            <div className="mt-4">
              <PresenceMap centerSlug={country.slug} zoom={4} onlySlugs={[country.slug, ...country.cities.map((c) => c.slug)]} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-neutral-300">
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-neutral-400"/> Citizens: <span className="text-neutral-100">{country.citizens}</span></div>
            <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-neutral-400"/> Policies: <span className="text-neutral-100">{country.policies.length}</span></div>
            <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-neutral-400"/> Issues: <span className="text-neutral-100">{country.issues.length}</span></div>
            <div className="flex items-center gap-2"><GitPullRequest className="h-4 w-4 text-neutral-400"/> Proposals: <span className="text-neutral-100">{country.proposals.length}</span></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-neutral-400"/> Cities: <span className="text-neutral-100">{country.cities.length}</span></div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {country.policies.map((p) => {
              const [org, repo] = p.split("/");
              return (
                <div key={p} className="flex items-center justify-between">
                  <Link href={`/libraries/${org}/${repo}`} className="underline-offset-4 hover:underline">{p}</Link>
                  <Badge>public</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {country.issues.map((i) => (
              <Link key={i.id} href={`/issues/${i.id}`} className="block underline-offset-4 hover:underline">#{i.id} {i.title}</Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Proposals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {country.proposals.map((p) => (
              <Link key={p.id} href={`/proposals/${p.id}`} className="block underline-offset-4 hover:underline">{p.title}</Link>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Cities</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 text-xs text-neutral-300">
            {country.cities.map((c) => (
              <Link key={c.slug} href={`/cities/${c.slug}`} className="rounded border border-neutral-800 bg-neutral-950/60 px-2 py-1 hover:underline underline-offset-4">
                {c.name}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


