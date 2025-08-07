import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function GovernancePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-neutral-100">Governance</h1>
      <Card>
        <CardHeader>
          <CardTitle>Default Rules</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-neutral-300 space-y-2">
          <div>Strategy: Single choice (Yes/No/Abstain)</div>
          <div>Quorum: 10%</div>
          <div>Threshold: Simple majority</div>
          <div>Snapshot: At vote open</div>
          <div>Secret ballots: Disabled</div>
          <div>Delegation: Enabled (1 hop)</div>
        </CardContent>
      </Card>
    </div>
  );
}


