import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Users, FileText, MessageSquare, GitPullRequest, MapPin } from "lucide-react";
import { findCity } from "../../../lib/geo-demo";
import Breadcrumbs from "../../../components/breadcrumbs";

interface Props {
  params: { slug: string };
}

export default function CityPage({ params }: Props) {
  const city = findCity(params.slug);
  if (!city) return notFound();

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Countries", href: "/" }, { label: city.countryName, href: `/countries/${city.countrySlug}` }, { label: city.name, prefix: city.flag }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-100">{city.flag} {city.name}</h1>
        <div className="text-xs text-neutral-400">{city.countryName}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-neutral-300">
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-neutral-400"/> Citizens: <span className="text-neutral-100">{city.citizens}</span></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-neutral-400"/> Country: <Link href={`/countries/${city.countrySlug}`} className="text-neutral-100 underline-offset-4 hover:underline">{city.countryName}</Link></div>
            <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-neutral-400"/> Policies: <span className="text-neutral-100">{city.policies.length}</span></div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {city.policies.map((p) => {
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
            {city.issues.map((i) => (
              <Link key={i.id} href={`/issues/${i.id}`} className="block underline-offset-4 hover:underline">#{i.id} {i.title}</Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Proposals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {city.proposals.map((p) => (
              <Link key={p.id} href={`/proposals/${p.id}`} className="block underline-offset-4 hover:underline">{p.title}</Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


