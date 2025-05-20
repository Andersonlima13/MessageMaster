
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

  const { data: channels } = useQuery({
    queryKey: ['/api/channels'],
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar organizationName={organizationSettings?.name || 'ClassApp'} />
      <div className="flex-1 overflow-auto">
        <Header organizationName={organizationSettings?.name || 'Colégio Vila Educação'} />
        
        <main className="p-4 sm:p-6 lg:p-8 bg-background">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-neutral-800">Análise de Conversas</h2>
            <p className="text-neutral-500">Análise detalhada do desempenho dos canais de comunicação</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="channels">Canais</TabsTrigger>
              <TabsTrigger value="responses">Respostas</TabsTrigger>
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
                        data={channels?.map(c => ({
                          name: c.name,
                          value: c.responseRate || 0
                        })) || []}
                        categories={['value']}
                        index="name"
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
                        data={channels?.map(c => ({
                          name: c.name,
                          value: c.averageResponseTime || 0
                        })) || []}
                        categories={['value']}
                        index="name"
                        valueFormatter={(v) => `${v}min`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="channels" className="space-y-6">
              {channels?.map((channel) => (
                <Card key={channel.id}>
                  <CardHeader>
                    <CardTitle>{channel.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Total de Mensagens</h4>
                        <p className="text-2xl font-bold">{channel.messageCount || 0}</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Taxa de Resposta</h4>
                        <p className="text-2xl font-bold">{channel.responseRate || 0}%</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Tempo Médio</h4>
                        <p className="text-2xl font-bold">{channel.averageResponseTime || 0}min</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="responses">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Respostas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <Chart
                      type="line"
                      data={channels?.map(c => ({
                        name: c.name,
                        data: c.responseHistory || []
                      })) || []}
                      categories={['value']}
                      index="date"
                      valueFormatter={(v) => `${v}%`}
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
