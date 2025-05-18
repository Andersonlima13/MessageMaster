import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ComunicadosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedComunicado, setSelectedComunicado] = useState<any>(null);

  // Fetch organization settings
  const { data: organizationSettings } = useQuery({
    queryKey: ['/api/organization-settings'],
  });

  // Fetch announcements
  const { data: announcements = [] } = useQuery({
    queryKey: ['/api/announcements', searchQuery, selectedLabel],
  });

  // Fetch labels
  const { data: labels = [] } = useQuery({
    queryKey: ['/api/labels'],
  });

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  // Function to create a new announcement
  const createNewAnnouncement = () => {
    alert('Aqui abriria um modal para criar um novo comunicado');
  };
  
  // Function to get initial letters for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Content for the selected announcement (mock for now)
  const mockAnnouncementContent = selectedComunicado ? 
    `<div class="prose">
      <p>Prezados pais e responsáveis,</p>
      <p>Segue o calendário de provas do segundo trimestre de 2024.</p>
      <p>As avaliações acontecerão nos seguintes dias:</p>
      <ul>
        <li><strong>10/06</strong> - Língua Portuguesa</li>
        <li><strong>12/06</strong> - Matemática</li>
        <li><strong>14/06</strong> - História</li>
        <li><strong>17/06</strong> - Geografia</li>
        <li><strong>19/06</strong> - Ciências</li>
        <li><strong>21/06</strong> - Inglês</li>
        <li><strong>24/06</strong> - Arte</li>
        <li><strong>26/06</strong> - Educação Física</li>
      </ul>
      <p>É importante que os alunos estejam presentes em todas as avaliações. Em caso de ausência justificada, a segunda chamada será realizada na primeira semana de julho.</p>
      <p>O conteúdo de cada avaliação será disponibilizado pelos professores com uma semana de antecedência.</p>
      <p>Qualquer dúvida, estamos à disposição.</p>
      <p>Atenciosamente,<br>Coordenação Pedagógica</p>
    </div>` : '';

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar organizationName={organizationSettings?.name || 'ClassApp'} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Header organizationName={organizationSettings?.name || 'Colégio Vila Educação'} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-neutral-800">Comunicados</h2>
              <p className="text-neutral-500">Gerencie e visualize todos os comunicados enviados</p>
            </div>
            <Button 
              onClick={createNewAnnouncement}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <span className="material-icons-outlined mr-2">add</span>
              Novo Comunicado
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar with filters and list */}
            <div className="col-span-1">
              <Card>
                <CardHeader className="px-4 py-3 border-b">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar por comunicados..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                    <span className="material-icons-outlined absolute left-3 top-2.5 text-gray-400">search</span>
                  </div>
                </CardHeader>
                
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium mb-2">Filtrar por etiqueta</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-full ${selectedLabel === '' ? 'bg-primary-50 border-primary-200 text-primary-600' : ''}`}
                      onClick={() => setSelectedLabel('')}
                    >
                      Todas
                    </Button>
                    
                    {labels.map((label: any) => (
                      <Button
                        key={label.id || label.name}
                        variant="outline"
                        size="sm"
                        className={`rounded-full ${selectedLabel === label.name ? 'border-primary-200 bg-primary-50 text-primary-600' : ''}`}
                        onClick={() => setSelectedLabel(label.name)}
                        style={{ 
                          borderColor: selectedLabel === label.name ? '' : `${label.color}50`,
                          backgroundColor: selectedLabel === label.name ? '' : `${label.color}10`,
                          color: selectedLabel === label.name ? '' : label.color
                        }}
                      >
                        {label.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <CardContent className="px-0 py-0">
                  <Tabs defaultValue="all" className="w-full">
                    <div className="px-4 pt-3">
                      <TabsList className="w-full grid grid-cols-3">
                        <TabsTrigger value="all">Todos</TabsTrigger>
                        <TabsTrigger value="sent">Enviados</TabsTrigger>
                        <TabsTrigger value="drafts">Rascunhos</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="all" className="mt-0">
                      <div className="divide-y divide-gray-200 max-h-[calc(100vh-380px)] overflow-y-auto">
                        {announcements.length === 0 ? (
                          <div className="text-center p-8 text-gray-500">
                            <p>Nenhum comunicado encontrado</p>
                          </div>
                        ) : (
                          announcements.map((announcement: any) => (
                            <div 
                              key={announcement.id}
                              className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedComunicado?.id === announcement.id ? 'bg-gray-50' : ''}`}
                              onClick={() => setSelectedComunicado(announcement)}
                            >
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium text-sm">{announcement.title}</h3>
                                <div className="text-xs text-gray-500">
                                  {new Date(announcement.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <span className="material-icons-outlined text-xs mr-1">person</span>
                                {announcement.sender.name}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {announcement.labels?.map((label: any, index: number) => (
                                  <Badge 
                                    key={index} 
                                    className="text-xs"
                                    style={{ 
                                      backgroundColor: `${label.color}20`, 
                                      color: label.color 
                                    }}
                                  >
                                    {label.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="sent" className="mt-0">
                      <div className="text-center p-8 text-gray-500">
                        <p>Comunicados enviados aparecerão aqui</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="drafts" className="mt-0">
                      <div className="text-center p-8 text-gray-500">
                        <p>Rascunhos salvos aparecerão aqui</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Announcement detail */}
            <div className="col-span-2">
              {selectedComunicado ? (
                <Card>
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{selectedComunicado.title}</CardTitle>
                        <div className="flex items-center mt-2">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{getInitials(selectedComunicado.sender.name)}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">{selectedComunicado.sender.name}</p>
                            <p className="text-gray-500 text-xs">
                              {formatDate(selectedComunicado.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <span className="material-icons-outlined mr-1 text-sm">print</span>
                          Imprimir
                        </Button>
                        <Button variant="outline" size="sm">
                          <span className="material-icons-outlined mr-1 text-sm">forward</span>
                          Encaminhar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-4">
                      {selectedComunicado.labels?.map((label: any, index: number) => (
                        <Badge 
                          key={index} 
                          className="text-xs"
                          style={{ 
                            backgroundColor: `${label.color}20`, 
                            color: label.color 
                          }}
                        >
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="border-t border-gray-200 pt-4">
                      <div 
                        className="prose max-w-none" 
                        dangerouslySetInnerHTML={{ __html: mockAnnouncementContent }}
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t flex justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="material-icons-outlined text-sm mr-1">visibility</span>
                      <span>Taxa de leitura: {selectedComunicado.readRate || 0}%</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <span className="material-icons-outlined mr-1 text-sm">reply</span>
                        Responder
                      </Button>
                      <Button variant="outline" size="sm">
                        <span className="material-icons-outlined mr-1 text-sm">more_vert</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-20">
                    <div className="rounded-full bg-gray-100 p-4 inline-block mb-4">
                      <span className="material-icons-outlined text-4xl text-gray-400">mail</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Nenhum comunicado selecionado</h3>
                    <p className="text-gray-500 mb-4">Selecione um comunicado para visualizar detalhes ou crie um novo</p>
                    <Button 
                      onClick={createNewAnnouncement}
                      className="bg-primary-500"
                    >
                      <span className="material-icons-outlined mr-2">add</span>
                      Novo Comunicado
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}