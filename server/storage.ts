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

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(page: number, limit: number, search?: string, profile?: string, group?: string, status?: string): Promise<{ users: User[], total: number }>;
  
  // Groups
  getGroups(): Promise<Group[]>;
  getGroup(id: number): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  
  // Channels
  getChannels(): Promise<Channel[]>;
  getChannel(id: number): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  
  // Conversations
  getConversations(page: number, limit: number, search?: string, status?: string, channel?: string): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  
  // Messages
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Announcements
  getAnnouncements(page: number, limit: number, search?: string, label?: string): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  
  // Labels
  getLabels(): Promise<Label[]>;
  getLabel(id: number): Promise<Label | undefined>;
  createLabel(label: InsertLabel): Promise<Label>;
  
  // Quick Links
  getQuickLinks(): Promise<QuickLink[]>;
  getQuickLink(id: number): Promise<QuickLink | undefined>;
  createQuickLink(quickLink: InsertQuickLink): Promise<QuickLink>;
  
  // Organization Settings
  getOrganizationSettings(): Promise<OrganizationSettings>;
  updateOrganizationSettings(settings: Partial<InsertOrganizationSettings>): Promise<OrganizationSettings>;
  
  // Dashboard KPIs
  getDashboardKpis(): Promise<DashboardKpi>;
  updateDashboardKpis(kpis: Partial<InsertDashboardKpi>): Promise<DashboardKpi>;
}

import { db } from './db';
import { eq, like, desc, asc, and, or, sql, isNull, not } from 'drizzle-orm';

// Implementação com banco de dados PostgreSQL
export class DatabaseStorage implements IStorage {
  
  // USERS
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
      conditions.push(
        or(
          like(users.username, `%${search}%`),
          like(users.fullName, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }
    
    if (profile && profile !== 'all') {
      conditions.push(eq(users.role, profile));
    }
    
    if (status && status !== 'all') {
      conditions.push(eq(users.status, status));
    }
    
    // Aplicar condições se houver
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Consulta com paginação
    const resultUsers = whereClause 
      ? await db.select().from(users).where(whereClause).limit(limit).offset(offset)
      : await db.select().from(users).limit(limit).offset(offset);
    
    // Consulta para contagem total
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause || sql`1=1`);
    
    return { 
      users: resultUsers, 
      total: Number(count) 
    };
  }
  
  // GROUPS
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
  
  // CHANNELS
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
  
  // CONVERSATIONS
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
      conditions.push(like(conversations.title, `%${search}%`));
    }
    
    if (status && status !== 'all') {
      conditions.push(eq(conversations.status, status));
    }
    
    if (channel && channel !== 'all') {
      conditions.push(eq(conversations.channelId, parseInt(channel)));
    }
    
    // Aplicar condições se houver
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Consulta com paginação
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
  
  constructor() {
    this.users = new Map();
    this.groups = new Map();
    this.channels = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.announcements = new Map();
    this.labels = new Map();
    this.quickLinks = new Map();
    
    this.userIdCounter = 1;
    this.groupIdCounter = 1;
    this.channelIdCounter = 1;
    this.conversationIdCounter = 1;
    this.messageIdCounter = 1;
    this.announcementIdCounter = 1;
    this.labelIdCounter = 1;
    this.quickLinkIdCounter = 1;
    
    // Initialize with default organization settings
    this.organizationSettings = {
      id: 1,
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
      planMessagesUsed: 250,
      updatedAt: new Date()
    };
    
    // Initialize with default dashboard KPIs
    this.dashboardKpis = {
      id: 1,
      readRate: 87.5,
      adoptionRate: 68.3,
      adoptionTotal: 627,
      adoptionRegistered: 428,
      csatScore: 4.7,
      readRateChange: 2.1,
      adoptionRateChange: -1.4,
      csatScoreChange: 0.3,
      updatedAt: new Date()
    };
    
    // Seed some initial data
    this.seedInitialData();
  }
  
  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      id,
      username: userData.username,
      password: userData.password,
      fullName: userData.fullName,
      email: userData.email,
      avatar: userData.avatar || null,
      profile: userData.profile || 'aluno',
      status: userData.status || 'não cadastrado',
      createdAt: now
    };
    this.users.set(id, user);
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
    let filteredUsers = Array.from(this.users.values());
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.fullName.toLowerCase().includes(searchLower) || 
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower)
      );
    }
    
    if (profile) {
      filteredUsers = filteredUsers.filter(user => user.profile === profile);
    }
    
    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    // Enhance users with group information
    const usersWithGroups = await Promise.all(paginatedUsers.map(async (user) => {
      const userGroups = await this.getUserGroups(user.id);
      return {
        ...user,
        groups: userGroups
      };
    }));
    
    return {
      users: usersWithGroups,
      total: filteredUsers.length
    };
  }
  
  private async getUserGroups(userId: number): Promise<Group[]> {
    // In a real implementation, this would query the user_groups table
    // For now, we'll return some mock groups based on user profile
    const user = await this.getUser(userId);
    if (!user) return [];
    
    const userGroups: Group[] = [];
    
    if (user.profile === 'aluno') {
      // Find a classroom group
      for (const group of this.groups.values()) {
        if (group.name.includes('Ano')) {
          userGroups.push(group);
          break;
        }
      }
    } else if (user.profile === 'funcionario') {
      // Find a staff group
      for (const group of this.groups.values()) {
        if (group.name.includes('Professor')) {
          userGroups.push(group);
          break;
        }
      }
    } else if (user.profile === 'admin') {
      // Find admin groups
      for (const group of this.groups.values()) {
        if (group.name.includes('Diretor') || group.name.includes('TI')) {
          userGroups.push(group);
        }
      }
    }
    
    return userGroups;
  }
  
  // Group Methods
  async getGroups(): Promise<Group[]> {
    const groups = Array.from(this.groups.values());
    
    // Enhance groups with user count
    return groups.map(group => ({
      ...group,
      userCount: Math.floor(Math.random() * 30) + 5 // In a real implementation, this would count users in each group
    }));
  }
  
  async getGroup(id: number): Promise<Group | undefined> {
    return this.groups.get(id);
  }
  
  async createGroup(groupData: InsertGroup): Promise<Group> {
    const id = this.groupIdCounter++;
    const now = new Date();
    const group: Group = { 
      id,
      name: groupData.name,
      visibility: groupData.visibility || 'public',
      description: groupData.description || null,
      createdAt: now
    };
    this.groups.set(id, group);
    return group;
  }
  
  // Channel Methods
  async getChannels(): Promise<Channel[]> {
    const channels = Array.from(this.channels.values());
    
    // Enhance channels with user count
    return channels.map(channel => ({
      ...channel,
      userCount: Math.floor(Math.random() * 8) + 2 // In a real implementation, this would count users assigned to each channel
    }));
  }
  
  async getChannel(id: number): Promise<Channel | undefined> {
    return this.channels.get(id);
  }
  
  async createChannel(channelData: InsertChannel): Promise<Channel> {
    const id = this.channelIdCounter++;
    const now = new Date();
    const channel: Channel = { 
      id,
      name: channelData.name,
      type: channelData.type,
      icon: channelData.icon,
      status: channelData.status || 'active',
      description: channelData.description || null,
      averageResponseTime: channelData.averageResponseTime || null,
      csatScore: channelData.csatScore || null,
      createdAt: now
    };
    this.channels.set(id, channel);
    return channel;
  }
  
  // Conversation Methods
  async getConversations(
    page: number, 
    limit: number, 
    search?: string, 
    status?: string, 
    channelId?: string
  ): Promise<Conversation[]> {
    let filteredConversations = Array.from(this.conversations.values());
    
    // Apply filters
    if (status) {
      filteredConversations = filteredConversations.filter(conv => conv.status === status);
    }
    
    if (channelId) {
      const channelIdNum = parseInt(channelId);
      filteredConversations = filteredConversations.filter(conv => conv.channelId === channelIdNum);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedConversations = filteredConversations.slice(startIndex, endIndex);
    
    // Enhance conversations with user and channel info, and last message
    const enhancedConversations = await Promise.all(paginatedConversations.map(async (conv) => {
      const user = await this.getUser(conv.userId);
      const channel = await this.getChannel(conv.channelId);
      
      // Get messages for this conversation
      const conversationMessages = Array.from(this.messages.values())
        .filter(msg => msg.conversationId === conv.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      const lastMessage = conversationMessages.length > 0 ? conversationMessages[0].content : "Sem mensagens";
      
      return {
        ...conv,
        user: {
          fullName: user?.fullName || "Usuário desconhecido",
          group: "3° Ano - Turma B", // In a real implementation, this would come from the user's group
        },
        channel: {
          name: channel?.name || "Canal desconhecido",
          type: channel?.type || "unknown"
        },
        lastMessage
      };
    }));
    
    return enhancedConversations;
  }
  
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }
  
  async createConversation(conversationData: InsertConversation): Promise<Conversation> {
    const id = this.conversationIdCounter++;
    const now = new Date();
    const conversation: Conversation = { 
      id,
      channelId: conversationData.channelId,
      userId: conversationData.userId,
      title: conversationData.title || null,
      status: conversationData.status || 'pendente',
      lastMessageAt: now,
      createdAt: now
    };
    this.conversations.set(id, conversation);
    return conversation;
  }
  
  // Message Methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const message: Message = { 
      ...messageData, 
      id, 
      readAt: null,
      createdAt: now
    };
    this.messages.set(id, message);
    
    // Update the lastMessageAt field of the conversation
    const conversation = await this.getConversation(messageData.conversationId);
    if (conversation) {
      conversation.lastMessageAt = now;
      this.conversations.set(conversation.id, conversation);
    }
    
    return message;
  }
  
  // Announcement Methods
  async getAnnouncements(
    page: number, 
    limit: number, 
    search?: string, 
    labelId?: string
  ): Promise<Announcement[]> {
    let filteredAnnouncements = Array.from(this.announcements.values());
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAnnouncements = filteredAnnouncements.filter(announcement => 
        announcement.title.toLowerCase().includes(searchLower) || 
        announcement.content.toLowerCase().includes(searchLower)
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);
    
    // Enhance announcements with sender info and labels
    const enhancedAnnouncements = await Promise.all(paginatedAnnouncements.map(async (announcement) => {
      const sender = await this.getUser(announcement.senderId);
      
      // Calculate read rate based on readCount and totalRecipients
      const readRate = announcement.totalRecipients > 0 
        ? Math.round((announcement.readCount / announcement.totalRecipients) * 100) 
        : 0;
      
      return {
        ...announcement,
        sender: {
          name: sender?.fullName || "Remetente desconhecido"
        },
        readRate,
        labels: await this.getAnnouncementLabels(announcement.id)
      };
    }));
    
    return enhancedAnnouncements;
  }
  
  private async getAnnouncementLabels(announcementId: number): Promise<Label[]> {
    // In a real implementation, this would query the announcement_labels table
    // For now, we'll return some labels based on announcement ID
    const labels: Label[] = [];
    
    // Even numbered announcements get "Importante" label
    if (announcementId % 2 === 0) {
      const importantLabel = Array.from(this.labels.values()).find(l => l.name === "Importante");
      if (importantLabel) labels.push(importantLabel);
    }
    
    // Every third announcement gets a department label
    if (announcementId % 3 === 0) {
      const departmentLabels = Array.from(this.labels.values()).filter(l => l.type === "department");
      if (departmentLabels.length > 0) {
        labels.push(departmentLabels[announcementId % departmentLabels.length]);
      }
    }
    
    return labels;
  }
  
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }
  
  async createAnnouncement(announcementData: InsertAnnouncement): Promise<Announcement> {
    const id = this.announcementIdCounter++;
    const now = new Date();
    const announcement: Announcement = { 
      ...announcementData, 
      id,
      readCount: 0,
      totalRecipients: 100, // Default number of recipients
      createdAt: now
    };
    this.announcements.set(id, announcement);
    return announcement;
  }
  
  // Label Methods
  async getLabels(): Promise<Label[]> {
    return Array.from(this.labels.values());
  }
  
  async getLabel(id: number): Promise<Label | undefined> {
    return this.labels.get(id);
  }
  
  async createLabel(labelData: InsertLabel): Promise<Label> {
    const id = this.labelIdCounter++;
    const now = new Date();
    const label: Label = { 
      ...labelData, 
      id, 
      createdAt: now
    };
    this.labels.set(id, label);
    return label;
  }
  
  // Quick Link Methods
  async getQuickLinks(): Promise<QuickLink[]> {
    return Array.from(this.quickLinks.values());
  }
  
  async getQuickLink(id: number): Promise<QuickLink | undefined> {
    return this.quickLinks.get(id);
  }
  
  async createQuickLink(quickLinkData: InsertQuickLink): Promise<QuickLink> {
    const id = this.quickLinkIdCounter++;
    const now = new Date();
    const quickLink: QuickLink = { 
      ...quickLinkData, 
      id, 
      createdAt: now
    };
    this.quickLinks.set(id, quickLink);
    return quickLink;
  }
  
  // Organization Settings Methods
  async getOrganizationSettings(): Promise<OrganizationSettings> {
    return this.organizationSettings;
  }
  
  async updateOrganizationSettings(settingsData: Partial<InsertOrganizationSettings>): Promise<OrganizationSettings> {
    const now = new Date();
    this.organizationSettings = { 
      ...this.organizationSettings, 
      ...settingsData, 
      updatedAt: now
    };
    return this.organizationSettings;
  }
  
  // Dashboard KPIs Methods
  async getDashboardKpis(): Promise<DashboardKpi> {
    return this.dashboardKpis;
  }
  
  async updateDashboardKpis(kpisData: Partial<InsertDashboardKpi>): Promise<DashboardKpi> {
    const now = new Date();
    this.dashboardKpis = { 
      ...this.dashboardKpis, 
      ...kpisData, 
      updatedAt: now
    };
    return this.dashboardKpis;
  }
  
  // Helper method to seed initial data
  private seedInitialData() {
    // Seed admin user
    this.createUser({
      username: "admin",
      password: "password123",
      fullName: "Admin Demo",
      email: "admin@colegiovila.edu.br",
      profile: "admin",
      status: "cadastrado",
      avatar: null
    });
    
    // Seed sample users
    this.createUser({
      username: "joao.carlos",
      password: "password123",
      fullName: "João Carlos",
      email: "jcarlos@email.com",
      profile: "aluno",
      status: "cadastrado",
      avatar: null
    });
    
    this.createUser({
      username: "mariana.costa",
      password: "password123",
      fullName: "Mariana Costa",
      email: "mcosta@email.com",
      profile: "funcionario",
      status: "cadastrado",
      avatar: null
    });
    
    this.createUser({
      username: "ricardo.silva",
      password: "password123",
      fullName: "Ricardo Silva",
      email: "rsilva@email.com",
      profile: "admin",
      status: "cadastrado",
      avatar: null
    });
    
    this.createUser({
      username: "luciana.mendes",
      password: "password123",
      fullName: "Luciana Mendes",
      email: "lmendes@email.com",
      profile: "aluno",
      status: "não cadastrado",
      avatar: null
    });
    
    // Seed groups
    this.createGroup({
      name: "Professores",
      description: "Grupo de todos os professores",
      visibility: "public"
    });
    
    this.createGroup({
      name: "2° Ano A",
      description: "Alunos do 2° Ano A",
      visibility: "public"
    });
    
    this.createGroup({
      name: "Coordenação",
      description: "Equipe de coordenação pedagógica",
      visibility: "restricted"
    });
    
    this.createGroup({
      name: "3° Ano B",
      description: "Alunos do 3° Ano B",
      visibility: "public"
    });
    
    // Seed channels
    this.createChannel({
      name: "Suporte Técnico",
      description: "Canal para suporte técnico e TI",
      type: "support",
      icon: "support_agent",
      status: "active",
      averageResponseTime: 72, // 1h 12min in minutes
      csatScore: 4.8
    });
    
    this.createChannel({
      name: "Secretaria Acadêmica",
      description: "Canal para assuntos da secretaria",
      type: "academic",
      icon: "school",
      status: "active",
      averageResponseTime: 220, // 3h 40min in minutes
      csatScore: 4.5
    });
    
    this.createChannel({
      name: "Coordenação Pedagógica",
      description: "Canal para assuntos pedagógicos",
      type: "pedagogical",
      icon: "psychology",
      status: "active",
      averageResponseTime: 320, // 5h 20min in minutes
      csatScore: 4.7
    });
    
    // Seed conversations
    const conversation1 = this.createConversation({
      title: "Dúvida material de matemática",
      channelId: 3, // Coordenação Pedagógica
      userId: 2, // João Carlos
      status: "finalizado"
    });
    
    const conversation2 = this.createConversation({
      title: "Declaração de matrícula",
      channelId: 2, // Secretaria Acadêmica
      userId: 3, // Mariana Costa
      status: "pendente"
    });
    
    const conversation3 = this.createConversation({
      title: "Confirmação reunião de pais",
      channelId: 1, // Suporte Técnico
      userId: 4, // Ricardo Silva
      status: "sem status"
    });
    
    // Seed messages
    this.createMessage({
      conversationId: 1,
      userId: 2, // João Carlos
      content: "Dúvida sobre o material de matemática resolvida pelo Prof. Carlos."
    });
    
    this.createMessage({
      conversationId: 2,
      userId: 3, // Mariana Costa
      content: "Solicitação de declaração de matrícula para fins de comprovação."
    });
    
    this.createMessage({
      conversationId: 3,
      userId: 4, // Ricardo Silva
      content: "Confirmação de presença na reunião de pais do próximo mês."
    });
    
    // Seed labels
    this.createLabel({
      name: "Importante",
      color: "#ff8f00",
      type: "priority"
    });
    
    this.createLabel({
      name: "Urgente",
      color: "#d32f2f",
      type: "priority"
    });
    
    this.createLabel({
      name: "Rotina",
      color: "#455a64",
      type: "priority"
    });
    
    this.createLabel({
      name: "Pedagógico",
      color: "#1976d2",
      type: "department"
    });
    
    this.createLabel({
      name: "Enfermagem",
      color: "#43a047",
      type: "department"
    });
    
    this.createLabel({
      name: "Cantina",
      color: "#ff8f00",
      type: "department"
    });
    
    this.createLabel({
      name: "TI",
      color: "#1976d2",
      type: "department"
    });
    
    // Seed announcements
    this.createAnnouncement({
      title: "Calendário de Provas do 2° Trimestre",
      content: "Confira o calendário de provas para o segundo trimestre...",
      senderId: 3, // Mariana Costa
    });
    
    this.createAnnouncement({
      title: "Formulário de Autodeclaração de Saúde",
      content: "Todos os alunos devem preencher o formulário de autodeclaração de saúde...",
      senderId: 4, // Ricardo Silva
    });
    
    this.createAnnouncement({
      title: "Atualização do Cardápio da Cantina",
      content: "Informamos que o cardápio da cantina foi atualizado para o mês de julho...",
      senderId: 1, // Admin
    });
    
    this.createAnnouncement({
      title: "Manutenção nos Laboratórios de Informática",
      content: "Os laboratórios de informática estarão em manutenção nos dias 10 e 11 de julho...",
      senderId: 4, // Ricardo Silva
    });
    
    // Update read counts for announcements
    const announcement1 = this.announcements.get(1);
    if (announcement1) {
      announcement1.readCount = 95;
      announcement1.totalRecipients = 100;
      this.announcements.set(1, announcement1);
    }
    
    const announcement2 = this.announcements.get(2);
    if (announcement2) {
      announcement2.readCount = 87;
      announcement2.totalRecipients = 100;
      this.announcements.set(2, announcement2);
    }
    
    const announcement3 = this.announcements.get(3);
    if (announcement3) {
      announcement3.readCount = 92;
      announcement3.totalRecipients = 100;
      this.announcements.set(3, announcement3);
    }
    
    const announcement4 = this.announcements.get(4);
    if (announcement4) {
      announcement4.readCount = 78;
      announcement4.totalRecipients = 100;
      this.announcements.set(4, announcement4);
    }
    
    // Seed quick links
    this.createQuickLink({
      name: "Google for Education",
      url: "https://classroom.google.com",
      icon: "school"
    });
    
    this.createQuickLink({
      name: "Árvore de Livros",
      url: "https://arvoredelivros.com.br",
      icon: "auto_stories"
    });
    
    this.createQuickLink({
      name: "Portal da Escola",
      url: "https://colegiovila.edu.br",
      icon: "web"
    });
  }
}

export const storage = new DatabaseStorage();
