import { DashboardLayout } from "../../components/layout/DashboardLayout";

export default function ReportsPage() {
  return (
    <DashboardLayout title="Hisobotlar">
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Analitik hisobotlar</div>
            <div className="card-sub">Ushbu sahifa tez kunda to'liq ishga tushadi</div>
          </div>
        </div>
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
          Tizimning umumiy samaradorligi va tushumlar to'g'risidagi hisobotlar.
        </div>
      </div>
    </DashboardLayout>
  );
}
