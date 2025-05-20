import React from 'react';
import { useQuery } from '@tanstack/react-query';

export function QuickAccessModule() {
  // Fetch quick links
  const { data: quickLinks = [], isLoading } = useQuery({
    queryKey: ['/api/quick-links'],
  });

  return (
    <div className="bg-background rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-neutral-800">Acessos Rápidos</h3>
        <button className="text-primary-500 hover:text-primary-600">
          <span className="material-icons-outlined">add_circle</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4 text-neutral-500">Carregando acessos...</div>
        ) : quickLinks.length === 0 ? (
          <div className="text-center py-4 text-neutral-500">
            <p>Nenhum acesso rápido configurado</p>
            <p className="text-xs mt-1">Adicione links para ferramentas e sistemas externos</p>
          </div>
        ) : (
          quickLinks.map((link: any) => (
            <a 
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 rounded-lg hover:bg-neutral-50 transition-colors duration-150"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center mr-3">
                <span className="material-icons-outlined">{link.icon}</span>
              </div>
              <div>
                <div className="font-medium">{link.name}</div>
                <div className="text-xs text-neutral-500">{new URL(link.url).hostname}</div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
