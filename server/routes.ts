import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertGroupSchema, insertChannelSchema, insertConversationSchema, insertAnnouncementSchema, insertLabelSchema, insertQuickLinkSchema, insertOrganizationSettingsSchema, insertDashboardKpiSchema, insertMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Current user
  app.get("/api/me", async (_req, res) => {
    try {
      // For demo, we'll return admin user
      const user = await storage.getUserByUsername("admin");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get current user" });
    }
  });

  // Organization settings
  app.get("/api/organization-settings", async (_req, res) => {
    try {
      const settings = await storage.getOrganizationSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get organization settings" });
    }
  });

  app.post("/api/organization-settings", async (req, res) => {
    try {
      const data = insertOrganizationSettingsSchema.parse(req.body);
      const settings = await storage.updateOrganizationSettings(data);
      res.json(settings);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to update organization settings" });
    }
  });

  // Dashboard KPIs
  app.get("/api/dashboard-kpis", async (_req, res) => {
    try {
      const kpis = await storage.getDashboardKpis();
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ message: "Failed to get dashboard KPIs" });
    }
  });

  app.post("/api/dashboard-kpis", async (req, res) => {
    try {
      const data = insertDashboardKpiSchema.parse(req.body);
      const kpis = await storage.updateDashboardKpis(data);
      res.json(kpis);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to update dashboard KPIs" });
    }
  });

  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || '';
      const profile = req.query.profile as string || '';
      const group = req.query.group as string || '';
      const status = req.query.status as string || '';

      const result = await storage.getUsers(page, limit, search, profile, group, status);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Groups
  app.get("/api/groups", async (_req, res) => {
    try {
      const groups = await storage.getGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to get groups" });
    }
  });

  app.post("/api/groups", async (req, res) => {
    try {
      const data = insertGroupSchema.parse(req.body);
      const group = await storage.createGroup(data);
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create group" });
    }
  });

  // Channels
  app.get("/api/channels", async (_req, res) => {
    try {
      const channels = await storage.getChannels();
      res.json(channels);
    } catch (error) {
      res.status(500).json({ message: "Failed to get channels" });
    }
  });

  app.post("/api/channels", async (req, res) => {
    try {
      const data = insertChannelSchema.parse(req.body);
      const channel = await storage.createChannel(data);
      res.status(201).json(channel);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create channel" });
    }
  });

  // Conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || '';
      const status = req.query.status as string || '';
      const channel = req.query.channel as string || '';

      const conversations = await storage.getConversations(page, limit, search, status, channel);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get conversations" });
    }
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const data = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(data);
      res.status(201).json(conversation);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // Messages
  app.post("/api/messages", async (req, res) => {
    try {
      const data = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(data);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Announcements
  app.get("/api/announcements", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || '';
      const label = req.query.label as string || '';

      const announcements = await storage.getAnnouncements(page, limit, search, label);
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get announcements" });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const data = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(data);
      res.status(201).json(announcement);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });

  // Labels
  app.get("/api/labels", async (_req, res) => {
    try {
      const labels = await storage.getLabels();
      res.json(labels);
    } catch (error) {
      res.status(500).json({ message: "Failed to get labels" });
    }
  });

  app.post("/api/labels", async (req, res) => {
    try {
      const data = insertLabelSchema.parse(req.body);
      const label = await storage.createLabel(data);
      res.status(201).json(label);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create label" });
    }
  });

  // Quick Links
  app.get("/api/quick-links", async (_req, res) => {
    try {
      const quickLinks = await storage.getQuickLinks();
      res.json(quickLinks);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quick links" });
    }
  });

  app.post("/api/quick-links", async (req, res) => {
    try {
      const data = insertQuickLinkSchema.parse(req.body);
      const quickLink = await storage.createQuickLink(data);
      res.status(201).json(quickLink);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create quick link" });
    }
  });

  // Notifications
  app.get("/api/notifications/unread-count", async (_req, res) => {
    try {
      // For demo, we'll return a fixed count
      res.json({ count: 3 });
    } catch (error) {
      res.status(500).json({ message: "Failed to get unread notifications count" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
