import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function ProposalsListPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-neutral-100">Proposals</h1>
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Link key={i} href={`/proposals/${i}`}>
            <Card>
              <CardContent className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-100">Proposal #{i}: Introduce congestion pricing pilot</div>
                  <div className="text-xs text-neutral-400">draft/congestion-pricing → main • City/Transport</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>review</Badge>
                  <Badge variant="success">vote open</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}


