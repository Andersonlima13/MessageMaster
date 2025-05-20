import React from 'react';
import { useQuery } from '@tanstack/react-query';

export function ChannelsModule() {
  // Fetch channels
  const { data: channels = [], isLoading } = useQuery({
    queryKey: ['/api/channels'],
  });

  // Map channel types to icons
  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'support': return 'support_agent';
      case 'academic': return 'school';
      case 'pedagogical': return 'psychology';
      default: return 'forum';
    }
  };

  // Map channel types to background colors
  const getChannelBgColor = (type: string) => {
    switch (type) {
      case 'support': return 'bg-primary-100 text-primary-700';
      case 'academic': return 'bg-secondary-100 text-secondary-700';
      case 'pedagogical': return 'bg-success-100 text-success-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-neutral-800">Canais de Atendimento</h3>
        <button className="text-primary-500 hover:text-primary-600">
          <span className="material-icons-outlined">add_circle</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4 text-neutral-500">Carregando canais...</div>
        ) : channels.length === 0 ? (
          <div className="text-center py-4 text-neutral-500">
            <p>Nenhum canal de atendimento cadastrado</p>
            <p className="text-xs mt-1">Adicione canais para facilitar a comunicação</p>
          </div>
        ) : (
          channels.map((channel: any) => (
            <div 
              key={channel.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors duration-150"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg ${getChannelBgColor(channel.type)} flex items-center justify-center mr-3`}>
                  <span className="material-icons-outlined">{getChannelIcon(channel.type)}</span>
                </div>
                <div>
                  <div className="font-medium">{channel.name}</div>
                  <div className="text-xs text-neutral-500">
                    {channel.userCount > 0 ? `${channel.userCount} usuários` : 'Sem usuários'}
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className={`w-2 h-2 rounded-full ${channel.status === 'active' ? 'bg-success-500' : 'bg-error-500'}`}></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
