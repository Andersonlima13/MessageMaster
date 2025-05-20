import React from 'react';
import { Switch } from '@/components/ui/switch';
import { OrganizationSettings } from '@shared/schema';

interface OrganizationModuleProps {
  settings?: OrganizationSettings;
}

export function OrganizationModule({ settings }: OrganizationModuleProps) {
  // Check if settings exist
  const isLoading = !settings;

  return (
    <div className="bg-background rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-neutral-800">Configurações</h3>
        <button className="text-primary-500 hover:text-primary-600">
          <span className="material-icons-outlined">settings</span>
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4 text-neutral-500">Carregando configurações...</div>
      ) : (
        <div className="space-y-4">
          <div className="border-b border-neutral-200 pb-3">
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Informações da Organização</h4>
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2">
                <span className="material-icons-outlined text-xs">school</span>
              </div>
              <div className="text-sm">{settings.name}</div>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2">
                <span className="material-icons-outlined text-xs">link</span>
              </div>
              <div className="text-sm">classapp.co/{settings.subdomain}</div>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2">
                <span className="material-icons-outlined text-xs">language</span>
              </div>
              <div className="text-sm">
                {settings.language === 'pt_BR' ? 'Português (Brasil)' : 
                 settings.language === 'en_US' ? 'English (US)' : 
                 settings.language}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Recursos Ativos</h4>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm">Mensagens podem ser enviadas</div>
              <Switch checked={settings.messagesEnabled} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm">Mídia pode ser enviada</div>
              <Switch checked={settings.mediaEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">Compromissos podem ser enviados</div>
              <Switch checked={settings.appointmentsEnabled} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
