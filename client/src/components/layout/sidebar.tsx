import React from 'react';
import { useLocation, Link } from 'wouter';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';

interface SidebarProps {
  organizationName: string;
}

export function Sidebar({ organizationName }: SidebarProps) {
  const [location] = useLocation();

  // Get organization settings for the plan data
  const { data: settings } = useQuery({
    queryKey: ['/api/organization-settings'],
  });

  const isActive = (path: string) => location === path;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-neutral-200 shadow-sm">
      <div className="flex items-center justify-center h-16 border-b border-neutral-200">
        <div className="flex items-center space-x-3 px-4">
          <div className="w-8 h-8 rounded-md bg-primary-500 text-white flex items-center justify-center">
            <span className="text-lg font-bold">C</span>
          </div>
          <span className="font-heading font-bold text-lg text-primary-800">{organizationName}</span>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        <nav className="mt-5 px-3 space-y-1">
          <Link href="/">
            <a className={`sidebar-link ${isActive('/') ? 'active' : ''}`}>
              <span className="material-icons-outlined sidebar-link-icon">dashboard</span>
              <span className="font-medium">Dashboard</span>
            </a>
          </Link>
          <Link href="/conversas">
            <a className={`sidebar-link ${isActive('/conversas') ? 'active' : ''}`}>
              <span className="material-icons-outlined sidebar-link-icon">chat</span>
              <span className="font-medium">Conversas</span>
            </a>
          </Link>
          <Link href="/comunicados">
            <a className={`sidebar-link ${isActive('/comunicados') ? 'active' : ''}`}>
              <span className="material-icons-outlined sidebar-link-icon">campaign</span>
              <span className="font-medium">Comunicados</span>
            </a>
          </Link>
          <Link href="/pessoas">
            <a className={`sidebar-link ${isActive('/pessoas') ? 'active' : ''}`}>
              <span className="material-icons-outlined sidebar-link-icon">people</span>
              <span className="font-medium">Pessoas</span>
            </a>
          </Link>
          <Link href="/canais">
            <a className={`sidebar-link ${isActive('/canais') ? 'active' : ''}`}>
              <span className="material-icons-outlined sidebar-link-icon">forum</span>
              <span className="font-medium">Canais</span>
            </a>
          </Link>
          <Link href="/grupos">
            <a className={`sidebar-link ${isActive('/grupos') ? 'active' : ''}`}>
              <span className="material-icons-outlined sidebar-link-icon">group_work</span>
              <span className="font-medium">Grupos</span>
            </a>
          </Link>
          <Link href="/configuracoes">
            <a className={`sidebar-link ${isActive('/configuracoes') ? 'active' : ''}`}>
              <span className="material-icons-outlined sidebar-link-icon">settings</span>
              <span className="font-medium">Configurações</span>
            </a>
          </Link>
          <Link href="/acessos">
            <a className={`sidebar-link ${isActive('/acessos') ? 'active' : ''}`}>
              <span className="material-icons-outlined sidebar-link-icon">link</span>
              <span className="font-medium">Acessos</span>
            </a>
          </Link>
          <Link href="/integracoes">
            <a className={`sidebar-link ${isActive('/integracoes') ? 'active' : ''}`}>
              <span className="material-icons-outlined sidebar-link-icon">sync</span>
              <span className="font-medium">Integrações</span>
            </a>
          </Link>
        </nav>
      </div>
      
      {settings && (
        <div className="p-4 border-t border-neutral-200">
          <div className="bg-primary-50 rounded-md p-3 text-sm">
            <p className="font-semibold text-primary-800">Plano {settings.planType}</p>
            <div className="mt-2 flex items-center">
              <Progress
                value={(settings.planMessagesLimit - settings.planMessagesUsed) / settings.planMessagesLimit * 100}
                className="w-full h-2"
              />
              <span className="ml-2 text-xs text-neutral-600">
                {Math.round((settings.planMessagesLimit - settings.planMessagesUsed) / settings.planMessagesLimit * 100)}%
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-600">
              {settings.planMessagesLimit - settings.planMessagesUsed}/{settings.planMessagesLimit} mensagens restantes
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
