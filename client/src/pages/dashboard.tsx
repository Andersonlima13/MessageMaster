import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { KpiSection } from '@/components/dashboard/kpi-section';
import { ConversationMetrics } from '@/components/dashboard/conversation-metrics';
import { ConversationsModule } from '@/components/dashboard/conversations-module';
import { AnnouncementsModule } from '@/components/dashboard/announcements-module';
import { UsersModule } from '@/components/dashboard/users-module';
import { QuickAccessModule } from '@/components/dashboard/quick-access-module';
import { ChannelsModule } from '@/components/dashboard/channels-module';
import { GroupsModule } from '@/components/dashboard/groups-module';
import { OrganizationModule } from '@/components/dashboard/organization-module';
import { AdvancedMetrics } from '@/components/dashboard/advanced-metrics';
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const { data: organizationSettings } = useQuery({
    queryKey: ['/api/organization-settings'],
  });

  const { data: dashboardKpis } = useQuery({
    queryKey: ['/api/dashboard-kpis'],
  });

  const { data: channels } = useQuery({
    queryKey: ['/api/channels'],
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar organizationName={organizationSettings?.name || 'ClassApp'} />
      <div className="flex-1 overflow-auto">
        <Header organizationName={organizationSettings?.name || 'Colégio Vila Educação'} />
        
        <main className="p-4 sm:p-6 lg:p-8 bg-background text-foreground">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-neutral-800">Painel Principal</h2>
            <p className="text-neutral-500">Acompanhe todas as atividades e métricas da sua escola</p>
          </div>

          {/* KPI Section */}
          <KpiSection 
            kpiData={dashboardKpis} 
            planData={organizationSettings} 
          />

          {/* Conversation Metrics */}
          <ConversationMetrics channels={channels} />
          
          {/* Advanced Metrics Section */}
          <div className="bg-background rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 mb-8">
            <AdvancedMetrics />
          </div>

          {/* Conversations and Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ConversationsModule />
            <AnnouncementsModule />
          </div>

          {/* Users Module */}
          <UsersModule />

          {/* Quick Access Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <QuickAccessModule />
            <ChannelsModule />
            <GroupsModule />
            <OrganizationModule settings={organizationSettings} />
          </div>
        </main>
      </div>
    </div>
  );
}
