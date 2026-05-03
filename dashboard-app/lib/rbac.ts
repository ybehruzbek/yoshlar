import { UserRole } from "@prisma/client";

/**
 * Role-Based Access Control (RBAC) utility.
 * Defines which roles can access which pages and perform which actions.
 */

// Pages each role can access (supports glob * for dynamic segments)
const PAGE_ACCESS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ["*"], // All pages
  BUXGALTER: [
    "/",
    "/debtors",
    "/debtors/*",
    "/payments",
    "/calendar",
    "/reports",
  ],
  YURIST: [
    "/",
    "/debtors",
    "/debtors/*",
    "/documents",
    "/documents/*",
    "/court",
    "/calendar",
  ],
};

// Actions each role can perform
const ACTION_ACCESS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ["*"],
  BUXGALTER: [
    "debtor:view",
    "payment:create",
    "payment:edit",
    "payment:view",
    "loan:edit_summa",
    "calendar:view",
    "report:view",
  ],
  YURIST: [
    "debtor:view",
    "document:create",
    "document:view",
    "court:view",
    "court:edit",
    "calendar:view",
  ],
};

/**
 * Check if a role can access a given page path.
 */
export function canAccessPage(role: UserRole, path: string): boolean {
  const allowed = PAGE_ACCESS[role];
  if (!allowed) return false;
  if (allowed.includes("*")) return true;
  
  return allowed.some(pattern => {
    if (pattern === path) return true;
    // Handle glob: /debtors/* matches /debtors/123
    if (pattern.endsWith("/*")) {
      const base = pattern.slice(0, -2);
      return path.startsWith(base + "/");
    }
    return false;
  });
}

/**
 * Check if a role can perform a given action.
 */
export function canPerformAction(role: UserRole, action: string): boolean {
  const allowed = ACTION_ACCESS[role];
  if (!allowed) return false;
  if (allowed.includes("*")) return true;
  return allowed.includes(action);
}

/**
 * Get sidebar navigation items for a role.
 */
export function getSidebarItems(role: UserRole) {
  const allItems = [
    { key: "dashboard", label: "Dashboard", href: "/", roles: ["SUPER_ADMIN", "BUXGALTER", "YURIST"] },
    { key: "debtors", label: "Qarzdorlar", href: "/debtors", roles: ["SUPER_ADMIN", "BUXGALTER", "YURIST"] },
    { key: "payments", label: "To'lovlar", href: "/payments", roles: ["SUPER_ADMIN", "BUXGALTER"] },
    { key: "documents", label: "Hujjatlar", href: "/documents", roles: ["SUPER_ADMIN", "YURIST"] },
    { key: "court", label: "Sud bo'limi", href: "/court", roles: ["SUPER_ADMIN", "YURIST"] },
    { key: "calendar", label: "Kalendar", href: "/calendar", roles: ["SUPER_ADMIN", "BUXGALTER", "YURIST"] },
    { key: "reports", label: "Hisobotlar", href: "/reports", roles: ["SUPER_ADMIN", "BUXGALTER"] },
    { key: "kpi", label: "KPI", href: "/kpi", roles: ["SUPER_ADMIN"] },
  ];

  const adminItems = [
    { key: "templates", label: "Shablonlar", href: "/documents/templates", roles: ["SUPER_ADMIN"] },
    { key: "users", label: "Foydalanuvchilar", href: "/admin/users", roles: ["SUPER_ADMIN"] },
    { key: "logs", label: "Loglar", href: "/admin/logs", roles: ["SUPER_ADMIN"] },
  ];

  return {
    main: allItems.filter(item => item.roles.includes(role)),
    admin: adminItems.filter(item => item.roles.includes(role)),
  };
}

/**
 * Role labels in Uzbek
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  BUXGALTER: "Buxgalter",
  YURIST: "Yurist",
};

/**
 * All available roles for selection in admin UI
 */
export const ALL_ROLES: { value: UserRole; label: string }[] = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "BUXGALTER", label: "Buxgalter" },
  { value: "YURIST", label: "Yurist" },
];
