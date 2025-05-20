import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ConversationsModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  // Fetch conversations
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['/api/conversations', currentPage, searchQuery],
  });

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Hoje, ${format(date, 'HH:mm')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd/MMM, HH:mm', { locale: ptBR });
    }
  };

  // Function to determine channel icon
  const getChannelIcon = (channelType: string) => {
    switch (channelType) {
      case 'whatsapp': return 'chat';
      case 'email': return 'email';
      case 'app': return 'chat_bubble';
      default: return 'forum';
    }
  };

  // Function to determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finalizado': return 'bg-success-100 text-success-700';
      case 'pendente': return 'bg-destructive-100 text-destructive-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-neutral-800">Conversas</h3>
          <a href="#" className="text-primary-500 text-sm flex items-center hover:underline">
            Tudo sobre conversas
            <span className="material-icons-outlined text-sm ml-1">chevron_right</span>
          </a>
        </div>
        
        <div className="mt-4 flex">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Buscar por aluno ou canal..."
              className="pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="material-icons-outlined absolute left-3 top-2 text-neutral-400">search</span>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-neutral-200">
        {isLoading ? (
          <div className="p-8 text-center text-neutral-500">Carregando conversas...</div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">Nenhuma conversa encontrada</div>
        ) : (
          conversations.map((conversation: any) => (
            <div key={conversation.id} className="p-4 hover:bg-neutral-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="w-10 h-10 bg-primary-100 text-primary-700">
                    <AvatarFallback>{conversation.user.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <div className="font-medium">{conversation.user.fullName}</div>
                    <div className="text-sm text-neutral-500">{conversation.user.group}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(conversation.status)}`}>
                    {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
                  </div>
                  <span className="material-icons-outlined text-neutral-400 ml-2">more_vert</span>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="text-sm text-neutral-600">{conversation.lastMessage}</div>
                <div className="flex items-center mt-2 text-xs text-neutral-500">
                  <div className="flex items-center">
                    <span className="material-icons-outlined text-xs mr-1">{getChannelIcon(conversation.channel.type)}</span>
                    <span>{conversation.channel.name}</span>
                  </div>
                  <div className="flex items-center ml-4">
                    <span className="material-icons-outlined text-xs mr-1">schedule</span>
                    <span>{formatDate(conversation.lastMessageAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-neutral-200 flex items-center justify-between">
        <button 
          className="text-sm text-neutral-500 flex items-center hover:text-primary-500 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        >
          <span className="material-icons-outlined text-sm mr-1">arrow_back</span>
          Anterior
        </button>
        
        <div className="flex items-center space-x-1">
          {/* Dynamic page buttons */}
          {Array.from({ length: Math.min(3, Math.ceil(conversations.length / pageSize)) }, (_, i) => (
            <button
              key={i}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                currentPage === i + 1 ? 'bg-primary-50 text-primary-600' : 'hover:bg-neutral-100 text-neutral-600'
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <span className="text-neutral-400">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-600 text-sm">
            8
          </button>
        </div>
        
        <button 
          className="text-sm text-neutral-500 flex items-center hover:text-primary-500 disabled:opacity-50"
          disabled={currentPage === Math.ceil(conversations.length / pageSize)}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Próximo
          <span className="material-icons-outlined text-sm ml-1">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
