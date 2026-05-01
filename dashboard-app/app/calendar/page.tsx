import { DashboardLayout } from "../../components/layout/DashboardLayout";

export default function CalendarPage() {
  return (
    <DashboardLayout title="Kalendar">
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">To'lovlar kalendari</div>
            <div className="card-sub">Ushbu sahifa tez kunda to'liq ishga tushadi</div>
          </div>
        </div>
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
          Rejalashtirilgan to'lovlar va muhim sanalar shu kalendarda ko'rsatiladi.
        </div>
      </div>
    </DashboardLayout>
  );
}
