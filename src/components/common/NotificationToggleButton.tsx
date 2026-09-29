import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useToast } from '@/hooks/use-toast';

interface NotificationToggleButtonProps {
  className?: string;
  showText?: boolean;
}

export const NotificationToggleButton: React.FC<NotificationToggleButtonProps> = ({
  className = '',
  showText = true,
}) => {
  const { isNotificationsEnabled, toggleNotifications, devicePermissionStatus } = useNotifications();
  const { toast } = useToast();

  const handleToggle = async () => {
    const enabled = await toggleNotifications();
    if (enabled) {
      toast({
        title: 'Notifications Active 🔔',
        description: 'You will receive real-time order alerts and countdown notifications.',
      });
    } else {
      toast({
        title: 'Notifications Muted 🔕',
        description: 'Desktop alerts are turned off. You can re-enable anytime.',
      });
    }
  };

  const isActive = isNotificationsEnabled && devicePermissionStatus !== 'denied';

  return (
    <button
      onClick={handleToggle}
      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer bg-[#ffffff] dark:bg-[#232323] border border-slate-200 shadow-xs ${
        isActive
          ? 'text-foreground dark:border-[#383838] opacity-100'
          : 'text-slate-700 dark:text-gray-400 dark:border-transparent opacity-80 hover:opacity-100'
      } ${className}`}
      title={isActive ? 'Notifications are ON (Click to turn off)' : 'Notifications are OFF (Click to turn on)'}
    >
      {isActive ? (
        <Bell className="w-3.5 h-3.5 shrink-0 text-orange-500" />
      ) : (
        <BellOff className="w-3.5 h-3.5 shrink-0 text-slate-500 dark:text-gray-400" />
      )}
      {showText && (
        <span>{isActive ? 'Notifications On' : 'Turn On Notifications'}</span>
      )}
    </button>
  );
};
