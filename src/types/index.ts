import { z } from "zod";

export const CHART_TYPES = [
  "vbar",
  "hbar",
  "line",
  "donut",
  "hero_stat",
  "timeline",
  "text_block",
  "list_block", // <-- Add this right here
] as const;


// Add this new constant in your types file
export const EXCLUDED_DISPLAY_CHART_TYPES: ChartType[] = [
  "text_block",
  "list_block",
  "hero_stat",
  "timeline",
];

// 2. Extract the TypeScript literal type from the array
export type ChartType = (typeof CHART_TYPES)[number];

// ============================================================================
// ─── FRONTEND & COMMON USER-FACING TYPES ────────────────────────────────────
// ============================================================================

// ─── Common API Responses ───
export interface SingleResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// ─── Common Chart & Source Types ───
export interface ChartSource {
  position?: number;
  sourceName: string;
  sourceUrl?: string;
  publication?: string;
  publicationDate?: string | Date;
}

export interface ChartData {
  _id: string;
  chartId: string;
  position: number;
  title: string;
  subHeading?: string;
  heading?: string;
  icon?: string;
  chartType: ChartType;
  data: any;
  sourceLine?: string;
  sources?: ChartSource[];
  imageUrl?: string;
  status?: string;
}

// ============================================================================
// ─── ADMIN PANEL & DATA MANAGEMENT TYPES ────────────────────────────────────
// ============================================================================

// ─── Admin User & Auth Types ───
export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

// ─── Admin API Response Types ───
export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  total?: number;
  message?: string;
}

export interface ApiSingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Admin Category Schemas & Types ───
export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  position: z.number().min(0, "Position must be 0 or greater"),
  iconUrl: z.string().optional(),
  keyphrase: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featuredImage: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export interface CategoryRow {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  position: number;
  topicCount: number;
  updatedAt?: string;
}

export interface CategoryDetails extends CategoryFormValues {
  _id: string;
  topicCount: number;
  updatedAt: string;
}

// ─── Admin Topic Schemas & Types ───
export const topicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  methodologyNote: z.string().optional(),
  aboutData: z.string().optional(),
  chartCount: z.coerce.number().optional().default(0), // ← NEW field
  sourceCount: z.coerce.number().optional().default(0),
  chartLabel: z.string().optional().default("charts"),
  metaTitle: z.string().optional(),
  keyphrase: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
  iconUrl: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

export type TopicFormValues = z.infer<typeof topicSchema>;

export interface TopicRow {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  dataPointsCount: number;
  sourceCount: number;
  categoryId: { _id: string; name: string; slug: string } | null;
  updatedAt: string;
}

// ─── Admin Dashboard & Image Queue Types ───
export interface DomainStat {
  domain: string;
  count: number;
  lastSeen: string;
  uniqueCharts: number;
}

export interface DashboardData {
  topDomains: DomainStat[];
  totalEmbeds: number;
  uniqueDomains: number;
  embedsToday: number;
}

export interface ImageJob {
  chartId: string;
  title: string;
  chartType: string;
  status: "completed" | "failed";
  queuedAt: string;
  completedAt: string | null;
}

// ─── Admin Chart Editor Specific Types ───
export interface DataRow {
  label: string;
  value: string;
  color?: string;
  eventColor?: string;
  source?: string;
  tooltip?: string;
}

export interface SourceRow {
  position: number;
  sourceName: string;
  sourceUrl: string;
  publication: string;
  publicationDate: string;
}

export interface LineSeries {
  name: string;
  color: string;
  dataPoints: { x: string; y: string; tooltip?: string }[];
  useRightAxis?: boolean;
}
