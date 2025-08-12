
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconClassName?: string;
}

export default function Logo({ className, iconClassName }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
       <div className="bg-primary rounded-md p-2">
        <ShoppingCart className={cn('h-6 w-6 text-primary-foreground', iconClassName)} />
       </div>
      <span className="font-headline text-2xl font-bold text-foreground">
        Madras Sandhai
      </span>
    </div>
  );
}
