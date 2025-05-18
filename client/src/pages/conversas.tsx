import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ConversasPage() {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState('all');

  // Fetch organization settings
  const { data: organizationSettings } = useQuery({
    queryKey: ['/api/organization-settings'],
  });

  // Fetch conversations
  const { data: conversations = [] } = useQuery({
    queryKey: ['/api/conversations', searchQuery, statusFilter, selectedChannelFilter],
  });

  // Fetch channels for filter
  const { data: channels = [] } = useQuery({
    queryKey: ['/api/channels'],
  });

  // Function to format the timestamp
  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit' }) + ' ' + 
             messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Function to send a message
  const sendMessage = () => {
    if (!message.trim() || !selectedConversation) return;
    
    // Here you would typically make an API call to send the message
    console.log('Sending message:', message);
    
    // Clear the input
    setMessage('');
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

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-500';
      case 'finalizado': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  // Function to start a new conversation
  const startNewConversation = () => {
    // In a real app, this would show a modal to select recipients and channel
    alert('Aqui abriria um modal para selecionar destinatários e canal');
  };

  // Mock messages for selected conversation
  const mockMessages = [
    { 
      id: 1, 
      content: 'Olá, gostaria de saber sobre o calendário de provas', 
      sender: { id: 2, name: 'Maria Silva' },
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isMe: false
    },
    { 
      id: 2, 
      content: 'Bom dia Maria! O calendário de provas foi enviado por e-mail na sexta-feira. Vou reenviar para você.', 
      sender: { id: 1, name: 'Admin' },
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      isMe: true
    },
    { 
      id: 3, 
      content: 'Obrigada! Já recebi.', 
      sender: { id: 2, name: 'Maria Silva' },
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      isMe: false
    },
    { 
      id: 4, 
      content: 'Qual o prazo para o trabalho de matemática?', 
      sender: { id: 2, name: 'Maria Silva' },
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      isMe: false
    },
    { 
      id: 5, 
      content: 'O prazo é dia 25/06. Vou enviar as orientações atualizadas.', 
      sender: { id: 1, name: 'Admin' },
      timestamp: new Date(Date.now() - 900000).toISOString(),
      isMe: true
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar organizationName={organizationSettings?.name || 'ClassApp'} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Header organizationName={organizationSettings?.name || 'Colégio Vila Educação'} />
        
        <main className="flex-1 p-0 flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-2">Conversas</h2>
              <div className="flex space-x-2 mb-4">
                <Button 
                  onClick={startNewConversation}
                  className="bg-primary-500 text-white"
                  size="sm"
                >
                  <span className="material-icons-outlined text-sm mr-1">add</span>
                  Nova Conversa
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar conversas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                  <span className="material-icons-outlined absolute left-3 top-2.5 text-gray-400">search</span>
                </div>
                
                <div className="flex space-x-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-1/2">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pendente">Pendentes</SelectItem>
                      <SelectItem value="finalizado">Finalizados</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedChannelFilter} onValueChange={setSelectedChannelFilter}>
                    <SelectTrigger className="w-1/2">
                      <SelectValue placeholder="Canal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os canais</SelectItem>
                      {channels.map((channel: any) => (
                        <SelectItem key={channel.id} value={channel.id.toString()}>
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <Tabs defaultValue="active" className="w-full">
                <div className="px-4 pt-2">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="active">Ativas</TabsTrigger>
                    <TabsTrigger value="archived">Arquivadas</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="active" className="mt-0">
                  {conversations.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                      <p>Nenhuma conversa encontrada</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {conversations.map((conversation: any) => (
                        <div 
                          key={conversation.id}
                          className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''}`}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="flex items-start">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback>{getInitials(conversation.user.fullName)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <p className="text-sm font-medium truncate">{conversation.user.fullName}</p>
                                <p className="text-xs text-gray-500">{formatTime(conversation.lastMessageAt)}</p>
                              </div>
                              <div className="flex items-center">
                                <span className={`inline-block h-2 w-2 rounded-full ${getStatusColor(conversation.status)} mr-1`}></span>
                                <p className="text-xs text-gray-500">{conversation.channel.name}</p>
                              </div>
                              <p className="text-xs text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="archived" className="mt-0">
                  <div className="text-center p-8 text-gray-500">
                    <p>Nenhuma conversa arquivada</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{getInitials(selectedConversation.user.fullName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedConversation.user.fullName}</h3>
                      <p className="text-xs text-gray-500">{selectedConversation.channel.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <span className="material-icons-outlined">info</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <span className="material-icons-outlined">more_vert</span>
                    </Button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mockMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${msg.isMe ? 'bg-primary-100 text-primary-900' : 'bg-gray-100'} p-3 rounded-lg`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-right mt-1 text-gray-500">{formatTime(msg.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <Button variant="ghost" className="h-10 w-10 p-0 mr-2">
                      <span className="material-icons-outlined">attach_file</span>
                    </Button>
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button className="ml-2 bg-primary-500" onClick={sendMessage}>
                      <span className="material-icons-outlined">send</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <Card className="w-[400px]">
                  <CardContent className="pt-6 text-center">
                    <div className="rounded-full bg-gray-100 p-4 inline-block mb-4">
                      <span className="material-icons-outlined text-4xl text-gray-400">chat</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Nenhuma conversa selecionada</h3>
                    <p className="text-gray-500 mb-4">Selecione uma conversa à esquerda ou inicie uma nova conversa</p>
                    <Button onClick={startNewConversation} className="bg-primary-500">
                      <span className="material-icons-outlined mr-2">add</span>
                      Nova Conversa
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}