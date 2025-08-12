import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/hooks/use-localization';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusStyles: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  Packed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800',
  Delivered: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  Cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { t } = useLocalization();
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-semibold capitalize',
        statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
      )}
    >
      {t(`orderStatus_${status}`)}
    </Badge>
  );
}
