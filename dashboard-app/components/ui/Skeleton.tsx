import "./skeleton.css";

export function Skeleton({ w, h, r, className }: { w?: string; h?: string; r?: string; className?: string }) {
  return (
    <div
      className={`skeleton ${className || ""}`}
      style={{ width: w || "100%", height: h || "16px", borderRadius: r || "8px" }}
    />
  );
}

export function SkeletonCard({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={`skeleton-card ${className || ""}`}>{children}</div>;
}

/* ── Dashboard skeleton ── */
export function DashboardSkeleton() {
  return (
    <div className="skel-dashboard">
      {/* 4 stat cards */}
      <div className="stats-grid">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} className="stat-card">
            <Skeleton w="60%" h="28px" />
            <Skeleton w="45%" h="12px" />
            <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid var(--border)" }}>
              <Skeleton w="70%" h="12px" />
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* 3 overview cards */}
      <div className="overview-row">
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} className="overview-card">
            <Skeleton w="50%" h="12px" />
            <Skeleton w="35%" h="22px" />
            <div style={{ marginTop: "14px" }}>
              <Skeleton w="100%" h="4px" r="2px" />
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* Charts row */}
      <div className="charts-row">
        <SkeletonCard className="card">
          <div className="skel-chart-head">
            <Skeleton w="120px" h="18px" />
            <Skeleton w="140px" h="32px" r="10px" />
          </div>
          <Skeleton w="100%" h="240px" r="12px" />
        </SkeletonCard>
        <SkeletonCard className="card">
          <Skeleton w="120px" h="18px" />
          <div className="skel-donut-wrap">
            <Skeleton w="160px" h="160px" r="50%" />
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}

/* ── Debtors (table) skeleton ── */
export function DebtorsSkeleton() {
  return (
    <div className="skel-debtors">
      {/* Header + search */}
      <div className="page-header">
        <Skeleton w="180px" h="28px" />
        <Skeleton w="240px" h="14px" />
      </div>
      <SkeletonCard className="filter-card">
        <Skeleton w="300px" h="40px" r="12px" />
        <div style={{ display: "flex", gap: "12px" }}>
          <Skeleton w="120px" h="36px" r="10px" />
          <Skeleton w="120px" h="36px" r="10px" />
        </div>
      </SkeletonCard>
      {/* Table rows */}
      <SkeletonCard className="table-container-full" style={{ padding: "0" }}>
        <div className="skel-table-head">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} w={i === 0 ? "50px" : "120px"} h="12px" />
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skel-table-row">
            <Skeleton w="38px" h="38px" r="10px" />
            <div style={{ flex: 1 }}>
              <Skeleton w="160px" h="14px" />
              <Skeleton w="100px" h="11px" />
            </div>
            <Skeleton w="80px" h="24px" r="6px" />
            <Skeleton w="110px" h="14px" />
            <Skeleton w="70px" h="24px" r="20px" />
            <Skeleton w="60px" h="14px" />
          </div>
        ))}
      </SkeletonCard>
    </div>
  );
}

/* ── Generic page skeleton (placeholder pages) ── */
export function PageSkeleton() {
  return (
    <div className="skel-page">
      <div className="page-header">
        <Skeleton w="200px" h="28px" />
        <Skeleton w="280px" h="14px" />
      </div>
      <SkeletonCard className="card">
        <Skeleton w="180px" h="18px" />
        <Skeleton w="100%" h="14px" />
        <Skeleton w="70%" h="14px" />
        <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Skeleton w="200px" h="200px" r="50%" />
        </div>
      </SkeletonCard>
    </div>
  );
}
