import React from 'react';
import { useQuery } from '@tanstack/react-query';

export function GroupsModule() {
  // Fetch groups
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['/api/groups'],
  });

  // Get group icon based on group name
  const getGroupIcon = (name: string) => {
    if (name.toLowerCase().includes('prof')) return 'school';
    if (name.toLowerCase().includes('coordena')) return 'psychology';
    if (name.toLowerCase().includes('diretor')) return 'business';
    if (name.match(/\d/) && name.toLowerCase().includes('ano')) return 'groups_2';
    return 'group';
  };

  // Get group background color based on visibility
  const getGroupBgColor = (name: string) => {
    if (name.toLowerCase().includes('prof')) return 'bg-primary-100 text-primary-700';
    if (name.toLowerCase().includes('coordena')) return 'bg-success-100 text-success-700';
    if (name.toLowerCase().includes('diretor')) return 'bg-error-100 text-error-700';
    return 'bg-secondary-100 text-secondary-700';
  };

  return (
    <div className="bg-background rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-neutral-800">Grupos</h3>
        <button className="text-primary-500 hover:text-primary-600">
          <span className="material-icons-outlined">add_circle</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4 text-neutral-500">Carregando grupos...</div>
        ) : groups.length === 0 ? (
          <div className="text-center py-4 text-neutral-500">
            <p>Nenhum grupo cadastrado</p>
            <p className="text-xs mt-1">Adicione grupos para organizar usuários</p>
          </div>
        ) : (
          groups.map((group: any) => (
            <div 
              key={group.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors duration-150"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg ${getGroupBgColor(group.name)} flex items-center justify-center mr-3`}>
                  <span className="material-icons-outlined">{getGroupIcon(group.name)}</span>
                </div>
                <div>
                  <div className="font-medium">{group.name}</div>
                  <div className="flex items-center text-xs text-neutral-500">
                    <span className="material-icons-outlined text-xs mr-1">
                      {group.visibility === 'public' ? 'visibility' : 'lock'}
                    </span>
                    {group.visibility === 'public' ? 'Público' : 'Restrito'}
                  </div>
                </div>
              </div>
              <div className="text-sm text-neutral-500">{group.userCount || 0}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
