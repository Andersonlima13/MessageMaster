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
  const { data: settings = { 
    planType: 'Premium',
    planMessagesLimit: 1000,
    planMessagesUsed: 250
  } } = useQuery({
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
          <Link href="/" className={`sidebar-link ${isActive('/') ? 'active' : ''}`}>
            <span className="material-icons-outlined sidebar-link-icon">dashboard</span>
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/conversas" className={`sidebar-link ${isActive('/conversas') ? 'active' : ''}`}>
            <span className="material-icons-outlined sidebar-link-icon">chat</span>
            <span className="font-medium">Conversas</span>
          </Link>
          <Link href="/comunicados" className={`sidebar-link ${isActive('/comunicados') ? 'active' : ''}`}>
            <span className="material-icons-outlined sidebar-link-icon">campaign</span>
            <span className="font-medium">Comunicados</span>
          </Link>
          <Link href="/pessoas" className={`sidebar-link ${isActive('/pessoas') ? 'active' : ''}`}>
            <span className="material-icons-outlined sidebar-link-icon">people</span>
            <span className="font-medium">Pessoas</span>
          </Link>
          <Link href="/canais" className={`sidebar-link ${isActive('/canais') ? 'active' : ''}`}>
            <span className="material-icons-outlined sidebar-link-icon">forum</span>
            <span className="font-medium">Canais</span>
          </Link>
          <Link href="/grupos" className={`sidebar-link ${isActive('/grupos') ? 'active' : ''}`}>
            <span className="material-icons-outlined sidebar-link-icon">group_work</span>
            <span className="font-medium">Grupos</span>
          </Link>
          <Link href="/configuracoes" className={`sidebar-link ${isActive('/configuracoes') ? 'active' : ''}`}>
            <span className="material-icons-outlined sidebar-link-icon">settings</span>
            <span className="font-medium">Configurações</span>
          </Link>
          <Link href="/acessos" className={`sidebar-link ${isActive('/acessos') ? 'active' : ''}`}>
            <span className="material-icons-outlined sidebar-link-icon">link</span>
            <span className="font-medium">Acessos</span>
          </Link>
          <Link href="/integracoes" className={`sidebar-link ${isActive('/integracoes') ? 'active' : ''}`}>
            <span className="material-icons-outlined sidebar-link-icon">sync</span>
            <span className="font-medium">Integrações</span>
          </Link>
          <button 
            onClick={() => {
              const isDark = !document.documentElement.classList.contains('dark');
              document.documentElement.classList.toggle('dark', isDark);
              localStorage.setItem('darkMode', isDark.toString());
            }}
            className="sidebar-link w-full flex justify-between items-center mt-2 px-4"
          >
            <div className="flex items-center">
              <span className="material-icons-outlined sidebar-link-icon">
                {document.documentElement.classList.contains('dark') ? 'light_mode' : 'dark_mode'}
              </span>
              <span className="font-medium">Modo Escuro</span>
            </div>
            <div className={`w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${document.documentElement.classList.contains('dark') ? 'bg-purple-600' : 'bg-gray-200'} relative`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 left-0.5 transition-transform duration-200 ease-in-out ${document.documentElement.classList.contains('dark') ? 'translate-x-5' : ''}`} />
            </div>
          </button>
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
