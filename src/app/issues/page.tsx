import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function IssuesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-neutral-100">Issues</h1>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Link key={i} href={`/issues/${i}`}>
            <Card>
              <CardContent className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-100">Issue #{i}: Improve public transit reliability</div>
                  <div className="text-xs text-neutral-400">City/Transport • opened by bob</div>
                </div>
                <Badge variant="outline">open</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}


