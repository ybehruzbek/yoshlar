import { prisma } from "../prisma";
import { AuditType } from "@prisma/client";

interface AuditParams {
  userId?: number;
  amal: string;
  turi?: AuditType;
  model?: string;
  modelId?: string;
  eskiQiymat?: any;
  yangiQiymat?: any;
  ipAddress?: string;
  userAgent?: string;
  sahifa?: string;
  davomiyligi?: number;
  meta?: Record<string, any>;
}

/**
 * Log an audit event to the database.
 * Used throughout the app to track all user actions.
 */
export async function logAudit(params: AuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        amal: params.amal,
        turi: params.turi || "AMAL",
        model: params.model || null,
        modelId: params.modelId ? String(params.modelId) : null,
        eskiQiymat: params.eskiQiymat ? JSON.stringify(params.eskiQiymat) : null,
        yangiQiymat: params.yangiQiymat ? JSON.stringify(params.yangiQiymat) : null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
        sahifa: params.sahifa || null,
        davomiyligi: params.davomiyligi || null,
        meta: params.meta ? JSON.stringify(params.meta) : null,
      },
    });
  } catch (error) {
    // Don't let audit logging failures break the app
    console.error("Audit log error:", error);
  }
}

/**
 * Extract IP address from request headers.
 */
export function getIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

/**
 * Extract user agent from request headers.
 */
export function getUserAgent(request: Request): string {
  return request.headers.get("user-agent") || "unknown";
}
