import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Channel } from '@shared/schema';

interface ConversationMetricsProps {
  channels?: Channel[];
}

export function ConversationMetrics({ channels = [] }: ConversationMetricsProps) {
  // Helper function to convert minutes to hours and minutes
  const formatResponseTime = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  // Helper function to render CSAT stars
  const renderCsatStars = (score?: number) => {
    if (!score) return null;

    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="material-icons-outlined text-sm">star</span>
        ))}
        {hasHalfStar && <span className="material-icons-outlined text-sm">star_half</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="material-icons-outlined text-sm">star_outline</span>
        ))}
      </div>
    );
  };

  // Map channel types to icons
  const getChannelIcon = (type?: string) => {
    switch (type) {
      case 'support': return 'support_agent';
      case 'academic': return 'school';
      case 'pedagogical': return 'psychology';
      default: return 'forum';
    }
  };

  // Map channel types to background colors
  const getChannelBgColor = (type?: string) => {
    switch (type) {
      case 'support': return 'bg-primary-100 text-primary-700';
      case 'academic': return 'bg-secondary-100 text-secondary-700';
      case 'pedagogical': return 'bg-success-100 text-success-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading text-lg font-semibold text-foreground">Dados Gerais das Conversas</h3>
        <a href="/conversation-analytics" className="text-primary-500 text-sm flex items-center hover:underline">
          Ver relatório completo
          <span className="material-icons-outlined text-sm ml-1">chevron_right</span>
        </a>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-semibold text-neutral-500 uppercase">Canal</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-500 uppercase">Tempo médio</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-500 uppercase">Pontuação CSAT</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-500 uppercase">Responsáveis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-neutral-500">
                  Nenhum canal de atendimento encontrado
                </TableCell>
              </TableRow>
            ) : (
              channels.map((channel) => (
                <TableRow key={channel.id} className="hover:bg-neutral-50">
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full ${getChannelBgColor(channel.type)} flex items-center justify-center mr-3`}>
                        <span className="material-icons-outlined text-sm">{getChannelIcon(channel.type)}</span>
                      </div>
                      <span className="font-medium">{channel.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{formatResponseTime(channel.averageResponseTime)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{channel.csatScore?.toFixed(1) || '-'}</span>
                      {renderCsatStars(channel.csatScore)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {/* This would be populated with the actual responsible users */}
                      <Avatar className="w-7 h-7 border-2 border-white bg-primary-200 text-primary-700">
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-7 h-7 border-2 border-white bg-secondary-200 text-secondary-700">
                        <AvatarFallback>MT</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-7 h-7 border-2 border-white bg-success-200 text-success-700">
                        <AvatarFallback>PL</AvatarFallback>
                      </Avatar>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}