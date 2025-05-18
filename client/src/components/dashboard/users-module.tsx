import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';

export function UsersModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [profileFilter, setProfileFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // Fetch users with filters
  const { data, isLoading } = useQuery({
    queryKey: ['/api/users', currentPage, searchQuery, profileFilter, groupFilter, statusFilter],
  });

  const users = data?.users || [];
  const totalUsers = data?.total || 0;
  const totalPages = Math.ceil(totalUsers / pageSize);

  // Fetch groups for filter dropdown
  const { data: groups = [] } = useQuery({
    queryKey: ['/api/groups'],
  });
  
  // Get user initials for avatar
  const getUserInitials = (fullName: string) => {
    return fullName.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2);
  };

  // Get avatar background based on profile
  const getAvatarBg = (profile: string) => {
    switch (profile) {
      case 'aluno': return 'bg-primary-100 text-primary-700';
      case 'funcionario': return 'bg-secondary-100 text-secondary-700';
      case 'admin': return 'bg-error-100 text-error-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  // Get profile badge styling
  const getProfileBadge = (profile: string) => {
    switch (profile) {
      case 'aluno': return 'bg-primary-100 text-primary-700';
      case 'funcionario': return 'bg-secondary-100 text-secondary-700';
      case 'admin': return 'bg-success-100 text-success-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    return status === 'cadastrado' ? 'bg-success-500' : 'bg-error-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 mt-8">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-neutral-800">Pessoas</h3>
          <Button className="bg-primary-500 hover:bg-primary-600 text-white">
            <span className="material-icons-outlined text-sm mr-1">person_add</span>
            Adicionar pessoa
          </Button>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Buscar por nome..."
              className="pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="material-icons-outlined absolute left-3 top-2 text-neutral-400">search</span>
          </div>
          
          <div className="flex space-x-2">
            <Select value={profileFilter} onValueChange={setProfileFilter}>
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="Todos os perfis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os perfis</SelectItem>
                <SelectItem value="aluno">Aluno</SelectItem>
                <SelectItem value="funcionario">Funcionário</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="Todos os grupos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os grupos</SelectItem>
                {groups.map((group: any) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="cadastrado">Cadastrado</SelectItem>
                <SelectItem value="não cadastrado">Não cadastrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Nome</TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Perfil</TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Grupos</TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                  Carregando usuários...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: any) => (
                <TableRow key={user.id} className="hover:bg-neutral-50">
                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className={`w-8 h-8 ${getAvatarBg(user.profile)}`}>
                        <AvatarFallback>{getUserInitials(user.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-xs text-neutral-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${getProfileBadge(user.profile)}`}>
                      {user.profile.charAt(0).toUpperCase() + user.profile.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm">
                      {user.groups ? user.groups.map((g: any) => g.name).join(', ') : '-'}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`status-badge ${getStatusBadge(user.status)}`}></div>
                      <span className="text-sm">{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-right">
                    <button className="text-neutral-400 hover:text-primary-500">
                      <span className="material-icons-outlined">edit</span>
                    </button>
                    <button className="text-neutral-400 hover:text-error-500 ml-2">
                      <span className="material-icons-outlined">delete</span>
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-4 border-t border-neutral-200 flex items-center justify-between">
        <div className="text-sm text-neutral-500">
          {totalUsers > 0 ? `Mostrando ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalUsers)} de ${totalUsers} pessoas` : 'Nenhuma pessoa encontrada'}
        </div>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => (
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
          
          {totalPages > 3 && (
            <>
              <span className="text-neutral-400">...</span>
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-600 text-sm"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
