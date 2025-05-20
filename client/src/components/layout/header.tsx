import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  organizationName: string;
}

export function Header({ organizationName }: HeaderProps) {
  // Get the current user
  const { data: currentUser } = useQuery({
    queryKey: ['/api/me'],
  });

  // Get the unread notification count
  const { data: notificationData } = useQuery({
    queryKey: ['/api/notifications/unread-count'],
  });

  const hasUnreadNotifications = notificationData && notificationData.count > 0;

  // Create initials for the avatar
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-background border-b border-neutral-200 shadow-sm dark:border-neutral-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button className="lg:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100">
              <span className="material-icons-outlined">menu</span>
            </button>
            <h1 className="ml-2 lg:ml-0 font-heading font-semibold text-lg text-neutral-800">{organizationName}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button className="bg-primary-500 hover:bg-primary-600 text-white flex items-center text-sm">
              <span className="material-icons-outlined text-sm mr-1">edit</span>
              Escrever
            </Button>
            
            <button className="p-2 rounded-md text-neutral-600 hover:bg-neutral-100 relative">
              <span className="material-icons-outlined">notifications</span>
              {hasUnreadNotifications && (
                <span className="absolute top-1 right-1 bg-destructive rounded-full w-2 h-2"></span>
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8 bg-primary-100 text-primary-800">
                <AvatarFallback>{currentUser ? getInitials(currentUser.fullName) : 'U'}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">
                {currentUser ? currentUser.fullName : 'Usuário'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
