import { DashboardLayout } from "../../components/layout/DashboardLayout";

export default function DocumentsPage() {
  return (
    <DashboardLayout title="Hujjatlar">
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Hujjatlar markazi</div>
            <div className="card-sub">Ushbu sahifa tez kunda to'liq ishga tushadi</div>
          </div>
        </div>
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
          Shablonlar va avtomatik ravishda tayyorlangan sud hujjatlari shu yerda saqlanadi.
        </div>
      </div>
    </DashboardLayout>
  );
}
