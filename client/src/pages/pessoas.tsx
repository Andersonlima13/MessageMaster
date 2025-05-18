import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';

export default function PessoasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [profileFilter, setProfileFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch organization settings
  const { data: organizationSettings } = useQuery({
    queryKey: ['/api/organization-settings'],
  });

  // Fetch users with pagination and filters
  const { data: userData = { users: [], total: 0 } } = useQuery({
    queryKey: ['/api/users', currentPage, pageSize, searchQuery, profileFilter, groupFilter, statusFilter],
  });

  const { users = [], total = 0 } = userData;

  // Fetch groups for filtering
  const { data: groups = [] } = useQuery({
    queryKey: ['/api/groups'],
  });

  // Calculate total pages
  const totalPages = Math.ceil(total / pageSize);

  // Function to create a new user
  const createNewUser = () => {
    alert('Aqui abriria um modal para criar um novo usuário');
  };

  // Function to format status badges
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Offline</Badge>;
      case 'away':
        return <Badge className="bg-yellow-500">Ausente</Badge>;
      case 'busy':
        return <Badge className="bg-red-500">Ocupado</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Desconhecido</Badge>;
    }
  };

  // Function to get user role in Portuguese
  const getUserRole = (role: string) => {
    switch(role) {
      case 'admin':
        return 'Administrador';
      case 'teacher':
        return 'Professor';
      case 'student':
        return 'Estudante';
      case 'parent':
        return 'Responsável';
      case 'staff':
        return 'Funcionário';
      default:
        return role;
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
              <h2 className="font-heading text-2xl font-bold text-neutral-800">Pessoas</h2>
              <p className="text-neutral-500">Gerencie todos os usuários da plataforma</p>
            </div>
            <Button 
              onClick={createNewUser}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <span className="material-icons-outlined mr-2">person_add</span>
              Novo Usuário
            </Button>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                  <span className="material-icons-outlined absolute left-3 top-2.5 text-gray-400">search</span>
                </div>

                <Select value={profileFilter} onValueChange={setProfileFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os perfis</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="teacher">Professor</SelectItem>
                    <SelectItem value="student">Estudante</SelectItem>
                    <SelectItem value="parent">Responsável</SelectItem>
                    <SelectItem value="staff">Funcionário</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={groupFilter} onValueChange={setGroupFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os grupos</SelectItem>
                    {groups.map((group: any) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="away">Ausente</SelectItem>
                    <SelectItem value="busy">Ocupado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              {user.avatarUrl ? (
                                <AvatarImage src={user.avatarUrl} />
                              ) : (
                                <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.fullName}</p>
                              <p className="text-xs text-gray-500">@{user.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getUserRole(user.role)}</TableCell>
                        <TableCell>
                          {user.groups && user.groups.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {user.groups.map((group: any, index: number) => (
                                <span key={index} className="text-sm">
                                  {group.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Sem grupo</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <span className="material-icons-outlined text-gray-500">edit</span>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <span className="material-icons-outlined text-gray-500">more_vert</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {totalPages > 1 && (
                <div className="p-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        // Display first page, last page, and pages around current page
                        if (
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        
                        // Add ellipsis after first page and before last page
                        if (page === 2 || page === totalPages - 1) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}