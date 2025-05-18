import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AnnouncementsModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // Fetch announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['/api/announcements', searchQuery, selectedCategoryFilter],
  });

  // Fetch label categories
  const { data: labels = [] } = useQuery({
    queryKey: ['/api/labels'],
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

  // Group labels by type for filter categories
  const categoryLabels = labels.reduce((acc: any, label: any) => {
    if (!acc[label.type]) {
      acc[label.type] = [];
    }
    acc[label.type].push(label);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-neutral-800">Comunicados</h3>
          <a href="#" className="text-primary-500 text-sm flex items-center hover:underline">
            Ver todos
            <span className="material-icons-outlined text-sm ml-1">chevron_right</span>
          </a>
        </div>
        
        <div className="mt-4 flex">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Buscar por palavra-chave..."
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
          <div className="p-8 text-center text-neutral-500">Carregando comunicados...</div>
        ) : announcements.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">Nenhum comunicado encontrado</div>
        ) : (
          announcements.map((announcement: any) => (
            <div key={announcement.id} className="p-4 hover:bg-neutral-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{announcement.title}</div>
                  <div className="flex items-center mt-1">
                    {announcement.labels.map((label: any, index: number) => (
                      <div 
                        key={index}
                        className={`tag ${index > 0 ? 'mr-2' : ''}`}
                        style={{ 
                          backgroundColor: `${label.color}20`, 
                          color: label.color 
                        }}
                      >
                        {label.name}
                      </div>
                    ))}
                  </div>
                </div>
                <span className="material-icons-outlined text-neutral-400">more_vert</span>
              </div>
              
              <div className="mt-2">
                <div className="flex items-center mt-2 text-xs text-neutral-500">
                  <div className="flex items-center">
                    <span className="material-icons-outlined text-xs mr-1">person</span>
                    <span>{announcement.sender.name}</span>
                  </div>
                  <div className="flex items-center ml-4">
                    <span className="material-icons-outlined text-xs mr-1">schedule</span>
                    <span>{formatDate(announcement.createdAt)}</span>
                  </div>
                  <div className="flex items-center ml-4">
                    <span className="material-icons-outlined text-xs mr-1">visibility</span>
                    <span>{announcement.readRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-neutral-200">
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-3 py-1.5 rounded-md text-xs flex items-center ${
              selectedCategoryFilter === '' ? 'bg-neutral-200 text-neutral-800' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            onClick={() => setSelectedCategoryFilter('')}
          >
            <span className="material-icons-outlined text-xs mr-1">library_books</span>
            Todos
          </button>
          
          {Object.entries(categoryLabels).map(([type, typeLabels]: [string, any]) => (
            <button 
              key={type}
              className={`px-3 py-1.5 rounded-md text-xs flex items-center ${
                selectedCategoryFilter === type ? 'border border-primary-500 bg-primary-50 text-primary-700' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              onClick={() => setSelectedCategoryFilter(type)}
            >
              <span className="material-icons-outlined text-xs mr-1">
                {type === 'priority' ? 'flag' : 
                 type === 'department' ? 'business' : 
                 type === 'category' ? 'category' : 'label'}
              </span>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
