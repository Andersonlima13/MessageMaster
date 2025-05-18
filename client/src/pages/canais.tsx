import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CanaisPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch organization settings
  const { data: organizationSettings } = useQuery({
    queryKey: ['/api/organization-settings'],
  });

  // Fetch channels
  const { data: channels = [] } = useQuery({
    queryKey: ['/api/channels'],
  });

  // Filter channels based on search query
  const filteredChannels = channels.filter((channel: any) => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (channel.description && channel.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Function to create a new channel
  const createNewChannel = () => {
    alert('Aqui abriria um modal para criar um novo canal');
  };

  // Function to format channel type in Portuguese
  const formatChannelType = (type: string) => {
    switch(type) {
      case 'support':
        return 'Suporte';
      case 'class':
        return 'Turma';
      case 'admin':
        return 'Administrativo';
      case 'general':
        return 'Geral';
      default:
        return type;
    }
  };

  // Function to format channel status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'archived':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Arquivado</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500">Em Manutenção</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar organizationName={organizationSettings?.name || 'ClassApp'} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Header organizationName={organizationSettings?.name || 'Colégio Vila Educação'} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-neutral-800">Canais</h2>
              <p className="text-neutral-500">Gerencie todos os canais de comunicação</p>
            </div>
            <Button 
              onClick={createNewChannel}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <span className="material-icons-outlined mr-2">add</span>
              Novo Canal
            </Button>
          </div>
          
          <div className="mb-6">
            <div className="relative max-w-md">
              <Input
                type="text"
                placeholder="Buscar por canais..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <span className="material-icons-outlined absolute left-3 top-2.5 text-gray-400">search</span>
            </div>
          </div>
          
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="grid">
                  <span className="material-icons-outlined mr-1">grid_view</span>
                  Grade
                </TabsTrigger>
                <TabsTrigger value="list">
                  <span className="material-icons-outlined mr-1">format_list_bulleted</span>
                  Lista
                </TabsTrigger>
              </TabsList>
              
              <div className="text-sm text-gray-500">
                Total: {filteredChannels.length} canais
              </div>
            </div>
            
            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChannels.length === 0 ? (
                  <div className="col-span-full text-center p-8 text-gray-500">
                    <p>Nenhum canal encontrado</p>
                  </div>
                ) : (
                  filteredChannels.map((channel: any) => (
                    <Card key={channel.id} className="overflow-hidden">
                      <div className="h-3" style={{ backgroundColor: channel.color || '#3b82f6' }}></div>
                      <CardHeader className="pb-3 pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="mr-3 rounded-full p-2" style={{ backgroundColor: `${channel.color || '#3b82f6'}20` }}>
                              <span className="material-icons-outlined" style={{ color: channel.color || '#3b82f6' }}>
                                {channel.icon || 'forum'}
                              </span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{channel.name}</CardTitle>
                              <div className="flex items-center mt-1">
                                {getStatusBadge(channel.status)}
                                <span className="mx-2 text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-500">{formatChannelType(channel.type)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pb-3">
                        {channel.description ? (
                          <p className="text-sm text-gray-600 line-clamp-2">{channel.description}</p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">Sem descrição</p>
                        )}
                        
                        <div className="mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              <span className="font-medium">{channel.memberCount || 0}</span> membros
                            </span>
                            
                            <div className="flex -space-x-2">
                              {channel.managers && channel.managers.map((manager: any, index: number) => (
                                <Avatar key={index} className="h-8 w-8 border-2 border-white">
                                  {manager.avatarUrl ? (
                                    <AvatarImage src={manager.avatarUrl} alt={manager.name} />
                                  ) : (
                                    <AvatarFallback>{getInitials(manager.name)}</AvatarFallback>
                                  )}
                                </Avatar>
                              ))}
                              
                              {!channel.managers || channel.managers.length === 0 ? (
                                <span className="text-sm text-gray-400">Sem administradores</span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-3 pb-4 border-t">
                        <div className="flex w-full justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="material-icons-outlined text-sm mr-1">schedule</span>
                            <span>Tempo de resposta médio: {channel.averageResponseTime ? `${channel.averageResponseTime} min` : 'N/A'}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <span className="material-icons-outlined">more_horiz</span>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-4 py-3 text-left font-medium text-gray-500">Nome</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500">Tipo</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500">Membros</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500">Responsáveis</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-500">Tempo Médio de Resposta</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-500">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredChannels.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                              Nenhum canal encontrado
                            </td>
                          </tr>
                        ) : (
                          filteredChannels.map((channel: any) => (
                            <tr key={channel.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="mr-3 rounded-full p-1.5" style={{ backgroundColor: `${channel.color || '#3b82f6'}20` }}>
                                    <span className="material-icons-outlined text-sm" style={{ color: channel.color || '#3b82f6' }}>
                                      {channel.icon || 'forum'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium">{channel.name}</p>
                                    {channel.description && (
                                      <p className="text-xs text-gray-500 line-clamp-1">{channel.description}</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">{formatChannelType(channel.type)}</td>
                              <td className="px-4 py-3">{getStatusBadge(channel.status)}</td>
                              <td className="px-4 py-3">{channel.memberCount || 0}</td>
                              <td className="px-4 py-3">
                                <div className="flex -space-x-2">
                                  {channel.managers && channel.managers.map((manager: any, index: number) => (
                                    <Avatar key={index} className="h-6 w-6 border-2 border-white">
                                      {manager.avatarUrl ? (
                                        <AvatarImage src={manager.avatarUrl} alt={manager.name} />
                                      ) : (
                                        <AvatarFallback>{getInitials(manager.name)}</AvatarFallback>
                                      )}
                                    </Avatar>
                                  ))}
                                  
                                  {!channel.managers || channel.managers.length === 0 ? (
                                    <span className="text-sm text-gray-400">-</span>
                                  ) : null}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {channel.averageResponseTime ? `${channel.averageResponseTime} min` : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button variant="ghost" size="sm">
                                  <span className="material-icons-outlined text-gray-500">more_vert</span>
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
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