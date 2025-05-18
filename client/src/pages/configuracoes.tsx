import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function ConfiguracoesPage() {
  // Fetch organization settings
  const { data: organizationSettings } = useQuery({
    queryKey: ['/api/organization-settings'],
  });

  // Fetch current user data
  const { data: currentUser } = useQuery({
    queryKey: ['/api/me'],
  });

  // State for form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Set initial form values when user data is loaded
  React.useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Function to get initials for avatar
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Perfil atualizado com sucesso!');
  };

  // Function to handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    alert('Senha atualizada com sucesso!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Function to format user role in Portuguese
  const formatUserRole = (role: string = '') => {
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

  // Function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar organizationName={organizationSettings?.name || 'ClassApp'} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Header organizationName={organizationSettings?.name || 'Colégio Vila Educação'} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-neutral-800">Configurações</h2>
            <p className="text-neutral-500">Gerencie suas preferências e informações de conta</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* User Profile Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      {currentUser?.avatarUrl ? (
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.fullName} />
                      ) : (
                        <AvatarFallback className="text-xl">{getInitials(currentUser?.fullName)}</AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <CardTitle>{currentUser?.fullName || 'Carregando...'}</CardTitle>
                  <CardDescription>
                    {formatUserRole(currentUser?.role)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-500">ID do Usuário</p>
                      <p className="font-medium">{currentUser?.id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{currentUser?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Membro desde</p>
                      <p className="font-medium">{currentUser?.createdAt ? formatDate(currentUser.createdAt) : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Último acesso</p>
                      <p className="font-medium">{currentUser?.lastLogin ? formatDate(currentUser.lastLogin) : 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    <span className="material-icons-outlined mr-2 text-sm">logout</span>
                    Sair
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Settings Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="profile">Perfil</TabsTrigger>
                  <TabsTrigger value="security">Segurança</TabsTrigger>
                  <TabsTrigger value="notifications">Notificações</TabsTrigger>
                </TabsList>
                
                {/* Profile Tab */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações do Perfil</CardTitle>
                      <CardDescription>
                        Atualize suas informações pessoais. Estas informações serão exibidas publicamente.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileUpdate}>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="fullName">Nome Completo</Label>
                              <Input 
                                id="fullName" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Seu nome completo"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input 
                                id="email" 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu.email@exemplo.com" 
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="role">Cargo/Função</Label>
                            <Input 
                              id="role" 
                              value={formatUserRole(currentUser?.role)}
                              disabled
                            />
                            <p className="text-sm text-gray-500">
                              Seu cargo/função é definido pelo administrador do sistema.
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="avatar">Foto do Perfil</Label>
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16">
                                {currentUser?.avatarUrl ? (
                                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.fullName} />
                                ) : (
                                  <AvatarFallback>{getInitials(currentUser?.fullName)}</AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <Button type="button" variant="outline" size="sm">
                                  <span className="material-icons-outlined mr-2 text-sm">upload</span>
                                  Alterar Foto
                                </Button>
                                <p className="text-xs text-gray-500 mt-1">
                                  JPG, GIF ou PNG. Tamanho máximo de 2MB.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <Button type="submit" className="bg-primary-500">
                            Salvar Alterações
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Security Tab */}
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Segurança da Conta</CardTitle>
                      <CardDescription>
                        Gerencie sua senha e as configurações de segurança da conta.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordChange}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Senha Atual</Label>
                            <Input 
                              id="currentPassword" 
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="Sua senha atual" 
                            />
                          </div>
                          
                          <Separator />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">Nova Senha</Label>
                              <Input 
                                id="newPassword" 
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nova senha" 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                              <Input 
                                id="confirmPassword" 
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirme a nova senha" 
                              />
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Requisitos de senha:</p>
                            <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                              <li>Mínimo de 8 caracteres</li>
                              <li>Pelo menos uma letra maiúscula</li>
                              <li>Pelo menos um número</li>
                              <li>Pelo menos um caractere especial</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <Button type="submit" className="bg-primary-500">
                            Alterar Senha
                          </Button>
                        </div>
                      </form>
                      
                      <Separator className="my-6" />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Sessões Ativas</h3>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center">
                                  <span className="material-icons-outlined text-gray-500 mr-2">computer</span>
                                  <p className="font-medium">Windows 10 - Chrome</p>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">São Paulo, Brasil • IP: 192.168.1.1</p>
                                <p className="text-xs text-green-600 mt-1">Dispositivo atual</p>
                              </div>
                              <Button variant="outline" size="sm">
                                <span className="material-icons-outlined text-sm mr-1">logout</span>
                                Encerrar
                              </Button>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="w-full">
                            <span className="material-icons-outlined mr-2">logout</span>
                            Encerrar Todas as Outras Sessões
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Notifications Tab */}
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferências de Notificação</CardTitle>
                      <CardDescription>
                        Controle quais notificações você deseja receber.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Canais de Notificação</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="email-notifications">Notificações por Email</Label>
                                <p className="text-sm text-gray-500">Receba atualizações e notificações por email.</p>
                              </div>
                              <Switch
                                id="email-notifications"
                                checked={emailNotifications}
                                onCheckedChange={setEmailNotifications}
                              />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="push-notifications">Notificações Push</Label>
                                <p className="text-sm text-gray-500">Receba notificações no aplicativo móvel.</p>
                              </div>
                              <Switch
                                id="push-notifications"
                                checked={pushNotifications}
                                onCheckedChange={setPushNotifications}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Tipos de Notificação</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Mensagens Diretas</Label>
                                <p className="text-sm text-gray-500">Quando alguém te envia uma mensagem.</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Comunicados</Label>
                                <p className="text-sm text-gray-500">Quando um novo comunicado é publicado.</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Menções</Label>
                                <p className="text-sm text-gray-500">Quando você é mencionado em uma mensagem.</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Preferências de Aparência</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="dark-mode">Modo Escuro</Label>
                                <p className="text-sm text-gray-500">Ativar modo escuro para a interface.</p>
                              </div>
                              <Switch
                                id="dark-mode"
                                checked={darkMode}
                                onCheckedChange={setDarkMode}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button className="bg-primary-500">
                          Salvar Preferências
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}