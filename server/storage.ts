import { 
  users, User, InsertUser,
  groups, Group, InsertGroup,
  channels, Channel, InsertChannel,
  conversations, Conversation, InsertConversation,
  messages, Message, InsertMessage,
  announcements, Announcement, InsertAnnouncement,
  labels, Label, InsertLabel,
  quickLinks, QuickLink, InsertQuickLink,
  organizationSettings, OrganizationSettings, InsertOrganizationSettings,
  dashboardKpis, DashboardKpi, InsertDashboardKpi
} from "@shared/schema";
import { eq, like, and, or, sql } from 'drizzle-orm';
import { db } from './db';

// Interface para operações de armazenamento
export interface IStorage {
  // Usuários
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(page: number, limit: number, search?: string, profile?: string, group?: string, status?: string): Promise<{ users: User[], total: number }>;

  // Grupos
  getGroups(): Promise<Group[]>;
  getGroup(id: number): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;

  // Canais
  getChannels(): Promise<Channel[]>;
  getChannel(id: number): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;

  // Conversas
  getConversations(page: number, limit: number, search?: string, status?: string, channel?: string): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;

  // Mensagens
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Anúncios
  getAnnouncements(page: number, limit: number, search?: string, label?: string): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;

  // Etiquetas
  getLabels(): Promise<Label[]>;
  getLabel(id: number): Promise<Label | undefined>;
  createLabel(label: InsertLabel): Promise<Label>;

  // Links Rápidos
  getQuickLinks(): Promise<QuickLink[]>;
  getQuickLink(id: number): Promise<QuickLink | undefined>;
  createQuickLink(quickLink: InsertQuickLink): Promise<QuickLink>;

  // Configurações da Organização
  getOrganizationSettings(): Promise<OrganizationSettings>;
  updateOrganizationSettings(settings: Partial<InsertOrganizationSettings>): Promise<OrganizationSettings>;

  // KPIs do Dashboard
  getDashboardKpis(): Promise<DashboardKpi>;
  updateDashboardKpis(kpis: Partial<InsertDashboardKpi>): Promise<DashboardKpi>;

  // Analytics
  getConversationAnalytics(): Promise<any>;
}

// Implementação com PostgreSQL
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getUsers(
    page: number,
    limit: number,
    search?: string,
    profile?: string,
    group?: string,
    status?: string
  ): Promise<{ users: User[], total: number }> {
    const offset = (page - 1) * limit;
    let conditions = [];

    if (search) {
      conditions.push(like(users.fullName, `%${search}%`));
    }

    if (profile) {
      conditions.push(eq(users.profile, profile));
    }

    if (status) {
      conditions.push(eq(users.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = whereClause 
      ? await db.select().from(users).where(whereClause).limit(limit).offset(offset)
      : await db.select().from(users).limit(limit).offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause || sql`TRUE`);

    return {
      users: result,
      total: Number(count)
    };
  }

  async getGroups(): Promise<Group[]> {
    return db.select().from(groups);
  }

  async getGroup(id: number): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, id));
    return group;
  }

  async createGroup(groupData: InsertGroup): Promise<Group> {
    const [group] = await db.insert(groups).values(groupData).returning();
    return group;
  }

  async getChannels(): Promise<Channel[]> {
    return db.select().from(channels);
  }

  async getChannel(id: number): Promise<Channel | undefined> {
    const [channel] = await db.select().from(channels).where(eq(channels.id, id));
    return channel;
  }

  async createChannel(channelData: InsertChannel): Promise<Channel> {
    const [channel] = await db.insert(channels).values(channelData).returning();
    return channel;
  }

  async getConversations(
    page: number,
    limit: number,
    search?: string,
    status?: string,
    channel?: string
  ): Promise<Conversation[]> {
    const offset = (page - 1) * limit;
    let conditions = [];

    if (search) {
      conditions.push(like(conversations.title || '', `%${search}%`));
    }

    if (status) {
      conditions.push(eq(conversations.status || '', status));
    }

    if (channel) {
      conditions.push(eq(conversations.channelId, parseInt(channel)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = whereClause 
      ? await db.select().from(conversations).where(whereClause).limit(limit).offset(offset)
      : await db.select().from(conversations).limit(limit).offset(offset);

    return result;
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async createConversation(conversationData: InsertConversation): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values(conversationData).returning();
    return conversation;
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(messageData).returning();
    return message;
  }

  async getAnnouncements(
    page: number,
    limit: number,
    search?: string,
    label?: string
  ): Promise<Announcement[]> {
    const offset = (page - 1) * limit;
    let conditions = [];

    if (search) {
      conditions.push(like(announcements.title || '', `%${search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = whereClause 
      ? await db.select().from(announcements).where(whereClause).limit(limit).offset(offset)
      : await db.select().from(announcements).limit(limit).offset(offset);

    return result;
  }

  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement;
  }

  async createAnnouncement(announcementData: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db.insert(announcements).values(announcementData).returning();
    return announcement;
  }

  async getLabels(): Promise<Label[]> {
    return db.select().from(labels);
  }

  async getLabel(id: number): Promise<Label | undefined> {
    const [label] = await db.select().from(labels).where(eq(labels.id, id));
    return label;
  }

  async createLabel(labelData: InsertLabel): Promise<Label> {
    const [label] = await db.insert(labels).values(labelData).returning();
    return label;
  }

  async getQuickLinks(): Promise<QuickLink[]> {
    return db.select().from(quickLinks);
  }

  async getQuickLink(id: number): Promise<QuickLink | undefined> {
    const [quickLink] = await db.select().from(quickLinks).where(eq(quickLinks.id, id));
    return quickLink;
  }

  async createQuickLink(quickLinkData: InsertQuickLink): Promise<QuickLink> {
    const [quickLink] = await db.insert(quickLinks).values(quickLinkData).returning();
    return quickLink;
  }

  async getOrganizationSettings(): Promise<OrganizationSettings> {
    const settings = await db.select().from(organizationSettings);

    if (settings.length === 0) {
      const defaultSettings = {
        name: "Colégio Vila Educação",
        subdomain: "colegiovila",
        logoUrl: null,
        primaryColor: "#1976d2",
        language: "pt_BR",
        country: "BR",
        type: "school",
        messagesEnabled: true,
        mediaEnabled: true,
        appointmentsEnabled: false,
        planType: "Premium",
        planMessagesLimit: 1000,
        planMessagesUsed: 250
      };

      const [newSettings] = await db
        .insert(organizationSettings)
        .values(defaultSettings)
        .returning();

      return newSettings;
    }

    return settings[0];
  }

  async updateOrganizationSettings(
    settingsData: Partial<InsertOrganizationSettings>
  ): Promise<OrganizationSettings> {
    const settings = await this.getOrganizationSettings();

    const [updatedSettings] = await db
      .update(organizationSettings)
      .set(settingsData)
      .where(eq(organizationSettings.id, settings.id))
      .returning();

    return updatedSettings;
  }

  async getDashboardKpis(): Promise<DashboardKpi> {
    const kpis = await db.select().from(dashboardKpis);

    if (kpis.length === 0) {
      const defaultKpis = {
        readRate: 87.5,
        adoptionRate: 68.2,
        adoptionTotal: 560,
        adoptionRegistered: 820,
        csatScore: 4.7,
        readRateChange: 2.3,
        adoptionRateChange: 5.1,
        csatScoreChange: 0.2
      };

      const [newKpis] = await db
        .insert(dashboardKpis)
        .values(defaultKpis)
        .returning();

      return newKpis;
    }

    return kpis[0];
  }

  async updateDashboardKpis(
    kpisData: Partial<InsertDashboardKpi>
  ): Promise<DashboardKpi> {
    const kpis = await this.getDashboardKpis();

    const [updatedKpis] = await db
      .update(dashboardKpis)
      .set(kpisData)
      .where(eq(dashboardKpis.id, kpis.id))
      .returning();

    return updatedKpis;
  }

  async getConversationAnalytics() {
    const channels = await this.getChannels();
    const analyticsData = {
      responseRates: channels.map(channel => ({
        channelName: channel.name,
        rate: Math.floor(Math.random() * 40) + 60 // 60-100% for demo
      })),
      responseTimes: channels.map(channel => ({
        channelName: channel.name,
        avgTime: Math.floor(Math.random() * 30) + 5 // 5-35min for demo
      })),
      channelDetails: channels.map(channel => ({
        id: channel.id,
        name: channel.name,
        messageCount: Math.floor(Math.random() * 1000) + 100,
        responseRate: Math.floor(Math.random() * 40) + 60,
        averageResponseTime: Math.floor(Math.random() * 30) + 5
      })),
      messageVolume: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        count: Math.floor(Math.random() * 100) + 20
      }))
    };
    return analyticsData;
  }
}

// Inicializa o armazenamento com a implementação do banco de dados
export const storage = new DatabaseStorage();