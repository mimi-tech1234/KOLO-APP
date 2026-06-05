import { Card, PageHeader } from "../components/ui";

export default function TrustPage() {
  return (
    <div>
      <PageHeader title="Trust & Share" subtitle="Protect access and share reports with trusted contacts." />
      <Card title="App Lock">
        <p className="text-muted mb-2">Biometric/PIN lock is available on mobile devices.</p>
        <p className="text-sm text-primary">Web version uses secure JWT session tokens.</p>
      </Card>
      <Card title="Share Reports">
        <p className="text-muted">Generate PDF/image summary reports and share with family members.</p>
      </Card>
    </div>
  );
}
