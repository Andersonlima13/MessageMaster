
import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chart } from '@/components/ui/chart';
import { useQuery } from '@tanstack/react-query';

export default function ConversationAnalytics() {
  const { data: organizationSettings } = useQuery({
    queryKey: ['/api/organization-settings'],
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/analytics/conversations'],
  });

  if (!analytics) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar organizationName={organizationSettings?.name || 'ClassApp'} />
        <div className="flex-1 overflow-auto">
          <Header organizationName={organizationSettings?.name || 'ClassApp'} />
          <main className="p-4 sm:p-6 lg:p-8 bg-background">
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <p className="text-neutral-500">Carregando dados...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar organizationName={organizationSettings?.name || 'ClassApp'} />
      <div className="flex-1 overflow-auto">
        <Header organizationName={organizationSettings?.name || 'ClassApp'} />
        
        <main className="p-4 sm:p-6 lg:p-8 bg-background">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-neutral-800">Análise de Conversas</h2>
            <p className="text-neutral-500">Análise detalhada do desempenho dos canais de comunicação</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="channels">Por Canal</TabsTrigger>
              <TabsTrigger value="trends">Tendências</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Taxa de Resposta por Canal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Chart
                        type="bar"
                        data={analytics.responseRates}
                        categories={['rate']}
                        index="channelName"
                        valueFormatter={(v) => `${v}%`}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tempo Médio de Resposta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Chart
                        type="bar"
                        data={analytics.responseTimes}
                        categories={['avgTime']}
                        index="channelName"
                        valueFormatter={(v) => `${v}min`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="channels">
              <div className="grid grid-cols-1 gap-6">
                {analytics.channelDetails.map((channel) => (
                  <Card key={channel.id}>
                    <CardHeader>
                      <CardTitle>{channel.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">Total de Mensagens</h4>
                          <p className="text-2xl font-bold">{channel.messageCount}</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">Taxa de Resposta</h4>
                          <p className="text-2xl font-bold">{channel.responseRate}%</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">Tempo Médio de Resposta</h4>
                          <p className="text-2xl font-bold">{channel.averageResponseTime}min</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Volume de Mensagens por Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <Chart
                      type="line"
                      data={analytics.messageVolume}
                      categories={['count']}
                      index="date"
                      valueFormatter={(v) => `${v} mensagens`}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
