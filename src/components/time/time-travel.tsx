
'use client';

import { useTime } from '@/hooks/use-time';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Clock, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { useLocalization } from '@/hooks/use-localization';

export function TimeTravel() {
  const { simulatedTime, advanceTime, resetTime } = useTime();
  const { t } = useLocalization();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Clock className="mr-2 h-4 w-4" />
          {format(new Date(simulatedTime), 'PPP')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{t('timeTravel_title')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => advanceTime(1)}>
          {t('timeTravel_advance1Day')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => advanceTime(3)}>
          {t('timeTravel_advance3Days')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => advanceTime(7)}>
          {t('timeTravel_advance1Week')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={resetTime}>
          <RotateCcw className="mr-2 h-4 w-4" />
          {t('timeTravel_reset')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
