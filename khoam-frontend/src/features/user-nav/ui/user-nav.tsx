'use client';

import { LogOut, UserRound } from 'lucide-react';
import Link from 'next/link';

import { useUserStore } from '@/app/store';
import { routes } from '@/shared/constants';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui';

export function UserNav() {
  const { logout, user } = useUserStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="text" className="relative hidden md:flex">
          <Avatar className="h-5 w-5">
            <AvatarImage src="#" alt="Avatar" />
            <AvatarFallback className="bg-transparent">TG</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href={routes.profile} className="flex items-center">
              <UserRound className="w-4 h-4 mr-3 text-muted-foreground" />
              Профиль
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:cursor-pointer" onClick={logout}>
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Выход
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
