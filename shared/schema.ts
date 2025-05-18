import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar"),
  profile: text("profile").notNull().default("aluno"), // aluno, funcionario, admin
  status: text("status").notNull().default("não cadastrado"), // cadastrado, não cadastrado
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Groups schema
export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  visibility: text("visibility").notNull().default("public"), // public, restricted
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGroupSchema = createInsertSchema(groups).omit({
  id: true,
  createdAt: true,
});

// User-Group associations
export const userGroups = pgTable("user_groups", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  groupId: integer("group_id").notNull(),
});

export const insertUserGroupSchema = createInsertSchema(userGroups).omit({
  id: true,
});

// Channels schema
export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  icon: text("icon").notNull(),
  status: text("status").notNull().default("active"), // active, inactive
  averageResponseTime: integer("average_response_time"), // in minutes
  csatScore: doublePrecision("csat_score"), // Customer satisfaction score
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertChannelSchema = createInsertSchema(channels).omit({
  id: true,
  createdAt: true,
});

// Channel-Group associations
export const channelGroups = pgTable("channel_groups", {
  id: serial("id").primaryKey(),
  channelId: integer("channel_id").notNull(),
  groupId: integer("group_id").notNull(),
});

export const insertChannelGroupSchema = createInsertSchema(channelGroups).omit({
  id: true,
});

// Channel-User associations (responsible users)
export const channelUsers = pgTable("channel_users", {
  id: serial("id").primaryKey(),
  channelId: integer("channel_id").notNull(),
  userId: integer("user_id").notNull(),
  isResponsible: boolean("is_responsible").notNull().default(false),
});

export const insertChannelUserSchema = createInsertSchema(channelUsers).omit({
  id: true,
});

// Labels/Tags schema
export const labels = pgTable("labels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  type: text("type").notNull(), // for grouping labels (e.g. priority, department)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLabelSchema = createInsertSchema(labels).omit({
  id: true,
  createdAt: true,
});

// Conversations schema
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title"),
  channelId: integer("channel_id").notNull(),
  userId: integer("user_id").notNull(), // Main participant (student/parent)
  status: text("status").notNull().default("pendente"), // pendente, finalizado, sem status
  lastMessageAt: timestamp("last_message_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  lastMessageAt: true,
  createdAt: true,
});

// Messages schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  userId: integer("user_id").notNull(), // Sender
  content: text("content").notNull(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  readAt: true,
  createdAt: true,
});

// Announcements schema
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  senderId: integer("sender_id").notNull(),
  readCount: integer("read_count").notNull().default(0),
  totalRecipients: integer("total_recipients").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  readCount: true,
  totalRecipients: true,
  createdAt: true,
});

// Announcement-Label associations
export const announcementLabels = pgTable("announcement_labels", {
  id: serial("id").primaryKey(),
  announcementId: integer("announcement_id").notNull(),
  labelId: integer("label_id").notNull(),
});

export const insertAnnouncementLabelSchema = createInsertSchema(announcementLabels).omit({
  id: true,
});

// Quick Links schema
export const quickLinks = pgTable("quick_links", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertQuickLinkSchema = createInsertSchema(quickLinks).omit({
  id: true,
  createdAt: true,
});

// Organization settings schema
export const organizationSettings = pgTable("organization_settings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subdomain: text("subdomain").notNull(),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").notNull().default("#1976d2"),
  language: text("language").notNull().default("pt_BR"),
  country: text("country").notNull().default("BR"),
  type: text("type").notNull().default("school"),
  messagesEnabled: boolean("messages_enabled").notNull().default(true),
  mediaEnabled: boolean("media_enabled").notNull().default(true),
  appointmentsEnabled: boolean("appointments_enabled").notNull().default(false),
  planType: text("plan_type").notNull().default("premium"),
  planMessagesLimit: integer("plan_messages_limit").notNull().default(1000),
  planMessagesUsed: integer("plan_messages_used").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertOrganizationSettingsSchema = createInsertSchema(organizationSettings).omit({
  id: true,
  updatedAt: true,
});

// Dashboard KPI schema - for storing aggregated metrics
export const dashboardKpis = pgTable("dashboard_kpis", {
  id: serial("id").primaryKey(),
  readRate: doublePrecision("read_rate").notNull().default(0),
  adoptionRate: doublePrecision("adoption_rate").notNull().default(0),
  adoptionTotal: integer("adoption_total").notNull().default(0),
  adoptionRegistered: integer("adoption_registered").notNull().default(0),
  csatScore: doublePrecision("csat_score").notNull().default(0),
  readRateChange: doublePrecision("read_rate_change").notNull().default(0),
  adoptionRateChange: doublePrecision("adoption_rate_change").notNull().default(0),
  csatScoreChange: doublePrecision("csat_score_change").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDashboardKpiSchema = createInsertSchema(dashboardKpis).omit({
  id: true,
  updatedAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;

export type UserGroup = typeof userGroups.$inferSelect;
export type InsertUserGroup = z.infer<typeof insertUserGroupSchema>;

export type Channel = typeof channels.$inferSelect;
export type InsertChannel = z.infer<typeof insertChannelSchema>;

export type ChannelGroup = typeof channelGroups.$inferSelect;
export type InsertChannelGroup = z.infer<typeof insertChannelGroupSchema>;

export type ChannelUser = typeof channelUsers.$inferSelect;
export type InsertChannelUser = z.infer<typeof insertChannelUserSchema>;

export type Label = typeof labels.$inferSelect;
export type InsertLabel = z.infer<typeof insertLabelSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

export type AnnouncementLabel = typeof announcementLabels.$inferSelect;
export type InsertAnnouncementLabel = z.infer<typeof insertAnnouncementLabelSchema>;

export type QuickLink = typeof quickLinks.$inferSelect;
export type InsertQuickLink = z.infer<typeof insertQuickLinkSchema>;

export type OrganizationSettings = typeof organizationSettings.$inferSelect;
export type InsertOrganizationSettings = z.infer<typeof insertOrganizationSettingsSchema>;

export type DashboardKpi = typeof dashboardKpis.$inferSelect;
export type InsertDashboardKpi = z.infer<typeof insertDashboardKpiSchema>;
