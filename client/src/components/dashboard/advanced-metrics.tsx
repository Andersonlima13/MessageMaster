import React from 'react';
import { Chart } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

export function AdvancedMetrics() {
  // Fetch additional metrics data if needed
  // For now we'll use static data
  
  // Message volume by hour data
  const hourlyMessageData = [
    { hour: '00:00', value: 12 },
    { hour: '01:00', value: 8 },
    { hour: '02:00', value: 5 },
    { hour: '03:00', value: 2 },
    { hour: '04:00', value: 1 },
    { hour: '05:00', value: 0 },
    { hour: '06:00', value: 3 },
    { hour: '07:00', value: 10 },
    { hour: '08:00', value: 25 },
    { hour: '09:00', value: 45 },
    { hour: '10:00', value: 52 },
    { hour: '11:00', value: 48 },
    { hour: '12:00', value: 35 },
    { hour: '13:00', value: 42 },
    { hour: '14:00', value: 58 },
    { hour: '15:00', value: 63 },
    { hour: '16:00', value: 52 },
    { hour: '17:00', value: 45 },
    { hour: '18:00', value: 32 },
    { hour: '19:00', value: 28 },
    { hour: '20:00', value: 20 },
    { hour: '21:00', value: 15 },
    { hour: '22:00', value: 10 },
    { hour: '23:00', value: 5 },
  ];

  // Read rate evolution data
  const readRateData = [
    { date: '01/Maio', rate: 72 },
    { date: '08/Maio', rate: 78 },
    { date: '15/Maio', rate: 82 },
    { date: '22/Maio', rate: 85 },
    { date: '29/Maio', rate: 87 },
    { date: '05/Jun', rate: 86 },
    { date: '12/Jun', rate: 88 },
    { date: '19/Jun', rate: 87.5 },
  ];

  // Message volume by channel
  const channelMessageData = [
    { name: 'Suporte TI', value: 125 },
    { name: 'Secretaria', value: 230 },
    { name: 'Coordenação', value: 187 },
    { name: 'Direção', value: 64 },
    { name: 'Professores', value: 320 },
  ];

  // Active users data
  const activeUsersData = [
    { date: '01/Maio', daily: 210, monthly: 430 },
    { date: '08/Maio', daily: 240, monthly: 450 },
    { date: '15/Maio', daily: 270, monthly: 470 },
    { date: '22/Maio', daily: 290, monthly: 490 },
    { date: '29/Maio', daily: 305, monthly: 510 },
    { date: '05/Jun', daily: 320, monthly: 530 },
    { date: '12/Jun', daily: 335, monthly: 545 },
    { date: '19/Jun', daily: 350, monthly: 560 },
  ];

  // Average response time by channel
  const responseTimeData = [
    { name: 'Suporte TI', time: 15 },
    { name: 'Secretaria', time: 45 },
    { name: 'Coordenação', time: 120 },
    { name: 'Direção', time: 240 },
    { name: 'Professores', time: 60 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Análise Avançada de Dados</h3>
        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="messages">Volume de Mensagens</TabsTrigger>
            <TabsTrigger value="readRate">Taxa de Leitura</TabsTrigger>
            <TabsTrigger value="channels">Canais</TabsTrigger>
            <TabsTrigger value="users">Usuários Ativos</TabsTrigger>
            <TabsTrigger value="response">Tempo de Resposta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Volume de Mensagens ao Longo do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Chart
                    type="bar"
                    data={hourlyMessageData}
                    categories={['value']}
                    index="hour"
                    valueFormatter={(value) => `${value} msgs`}
                    colors={["hsl(var(--primary))"]}
                    showXAxis={true}
                    showYAxis={true}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Total de Mensagens</h4>
                    <p className="text-2xl font-bold">1,425</p>
                    <p className="text-xs text-neutral-500 mt-1">Últimos 30 dias</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Horário de Pico</h4>
                    <p className="text-2xl font-bold">15:00 - 16:00</p>
                    <p className="text-xs text-neutral-500 mt-1">63 mensagens</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="readRate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evolução da Taxa de Leitura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Chart
                    type="line"
                    data={readRateData}
                    categories={['rate']}
                    index="date"
                    valueFormatter={(value) => `${value}%`}
                    colors={["hsl(var(--success))"]}
                    showXAxis={true}
                    showYAxis={true}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Taxa Média de Leitura</h4>
                    <p className="text-2xl font-bold">83.2%</p>
                    <p className="text-xs text-neutral-500 mt-1">Últimos 60 dias</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Taxa de Engajamento</h4>
                    <p className="text-2xl font-bold">62.5%</p>
                    <p className="text-xs text-neutral-500 mt-1">Respostas/Visualizações</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="channels" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Volume de Mensagens por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Chart
                    type="pie"
                    data={channelMessageData}
                    categories={['value']}
                    index="name"
                    valueFormatter={(value) => `${value} msgs`}
                    showLegend={true}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Canal Mais Ativo</h4>
                    <p className="text-2xl font-bold">Professores</p>
                    <p className="text-xs text-neutral-500 mt-1">320 mensagens (34.6%)</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Tempo Médio de Sessão</h4>
                    <p className="text-2xl font-bold">12min 30s</p>
                    <p className="text-xs text-neutral-500 mt-1">Por usuário</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usuários Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Chart
                    type="line"
                    data={activeUsersData}
                    categories={['daily', 'monthly']}
                    index="date"
                    valueFormatter={(value) => `${value} usuários`}
                    showXAxis={true}
                    showYAxis={true}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Usuários Ativos Diários</h4>
                    <p className="text-2xl font-bold">350</p>
                    <p className="text-xs text-success-500 mt-1">↑ 4.5% vs semana anterior</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Usuários Ativos Mensais</h4>
                    <p className="text-2xl font-bold">560</p>
                    <p className="text-xs text-success-500 mt-1">↑ 2.8% vs mês anterior</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="response" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tempo Médio de Resposta por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Chart
                    type="bar"
                    data={responseTimeData}
                    categories={['time']}
                    index="name"
                    valueFormatter={(value) => `${value} min`}
                    colors={["hsl(var(--secondary))"]}
                    showXAxis={true}
                    showYAxis={true}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Tempo Médio Geral</h4>
                    <p className="text-2xl font-bold">96 min</p>
                    <p className="text-xs text-success-500 mt-1">↓ 12% vs mês anterior</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Canal Mais Rápido</h4>
                    <p className="text-2xl font-bold">Suporte TI</p>
                    <p className="text-xs text-neutral-500 mt-1">15 minutos em média</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}