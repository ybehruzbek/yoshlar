import { DashboardLayout } from "../../components/layout/DashboardLayout";

export default function KpiPage() {
  return (
    <DashboardLayout title="KPI">
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Xodimlar samaradorligi (KPI)</div>
            <div className="card-sub">Ushbu sahifa tez kunda to'liq ishga tushadi</div>
          </div>
        </div>
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
          Ish xodimlarining natijalari va samaradorlik ko'rsatkichlari.
        </div>
      </div>
    </DashboardLayout>
  );
}
