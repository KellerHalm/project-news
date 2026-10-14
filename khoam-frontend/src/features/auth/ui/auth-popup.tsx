import Link from 'next/link';

import { routes } from '@/shared/constants';
import { Button } from '@/shared/ui';

export function AuthPopup() {
  return <Button asChild className="hidden md:flex" variant="text"><Link href={routes.login}>Войти</Link></Button>;
}
