import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NovoGrupoDialog } from '@/components/grupos/novo-grupo-dialog';

export default function GruposPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch organization settings
  const { data: organizationSettings = { name: 'Colégio Vila Educação' } } = useQuery<any>({
    queryKey: ['/api/organization-settings'],
  });

  // Fetch groups
  const { data: groups = [] } = useQuery<any[]>({
    queryKey: ['/api/groups'],
  });

  // Filter groups based on search query and visibility filter
  const filteredGroups = groups.filter((group: any) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesVisibility = visibilityFilter === 'all' || group.visibility === visibilityFilter;

    return matchesSearch && matchesVisibility;
  });

  // Function to open the new group dialog
  const openGroupDialog = () => {
    setIsDialogOpen(true);
  };

  // Function to format visibility in Portuguese
  const formatVisibility = (visibility: string) => {
    switch(visibility) {
      case 'public':
        return 'Público';
      case 'private':
        return 'Privado';
      case 'restricted':
        return 'Restrito';
      default:
        return visibility;
    }
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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar organizationName={organizationSettings?.name || 'ClassApp'} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Header organizationName={organizationSettings?.name || 'Colégio Vila Educação'} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-neutral-800">Grupos e Turmas</h2>
              <p className="text-neutral-500">Gerencie os grupos e turmas da sua instituição</p>
            </div>
            <Button 
              onClick={openGroupDialog}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <span className="material-icons-outlined mr-2">group_add</span>
              Novo Grupo
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative md:w-64">
              <Input
                type="text"
                placeholder="Buscar por grupos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <span className="material-icons-outlined absolute left-3 top-2.5 text-gray-400">search</span>
            </div>
            
            <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Visibilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="public">Público</SelectItem>
                <SelectItem value="private">Privado</SelectItem>
                <SelectItem value="restricted">Restrito</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="ml-auto text-sm text-gray-500 flex items-center">
              <span className="material-icons-outlined text-gray-400 mr-1">filter_list</span>
              Total: {filteredGroups.length} grupos
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.length === 0 ? (
              <div className="col-span-full text-center p-8 text-gray-500">
                <div className="rounded-full bg-gray-100 p-4 inline-block mb-4">
                  <span className="material-icons-outlined text-4xl text-gray-400">groups</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Nenhum grupo encontrado</h3>
                <p className="text-gray-500 mb-4">Tente ajustar os filtros ou criar um novo grupo</p>
                <Button onClick={openGroupDialog} className="bg-primary-500">
                  <span className="material-icons-outlined mr-2">group_add</span>
                  Novo Grupo
                </Button>
              </div>
            ) : (
              filteredGroups.map((group: any) => (
                <Card key={group.id} className="overflow-hidden flex flex-col">
                  <div className="h-3" style={{ backgroundColor: group.color || '#6366f1' }}></div>
                  <CardHeader className="pb-3 pt-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{group.name}</CardTitle>
                      <Badge variant={group.visibility === 'public' ? 'default' : 'outline'}>
                        {formatVisibility(group.visibility)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-4 flex-1">
                    {group.description ? (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{group.description}</p>
                    ) : (
                      <p className="text-sm text-gray-400 italic mb-4">Sem descrição</p>
                    )}
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold">{group.memberCount || 0}</span>
                        <span className="text-xs text-gray-500">Membros</span>
                      </div>
                      
                      {group.createdAt && (
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium">Criado em</span>
                          <span className="text-xs text-gray-500">
                            {new Date(group.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Coordenadores</h4>
                      {group.coordinators && group.coordinators.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {group.coordinators.map((coordinator: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-full pl-1 pr-3 py-1">
                              <Avatar className="h-6 w-6">
                                {coordinator.avatarUrl ? (
                                  <AvatarImage src={coordinator.avatarUrl} alt={coordinator.name} />
                                ) : (
                                  <AvatarFallback>{getInitials(coordinator.name)}</AvatarFallback>
                                )}
                              </Avatar>
                              <span className="text-xs">{coordinator.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Sem coordenadores designados</p>
                      )}
                    </div>
                  </CardContent>
                  
                  <div className="p-4 border-t mt-auto">
                    <div className="flex justify-between items-center">
                      <Button variant="ghost" size="sm">
                        <span className="material-icons-outlined mr-1">visibility</span>
                        Ver Detalhes
                      </Button>
                      <Button variant="ghost" size="sm">
                        <span className="material-icons-outlined">more_vert</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
      
      {/* Dialog de novo grupo */}
      <NovoGrupoDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}