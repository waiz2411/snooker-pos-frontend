import { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

export function DashboardCard({ title, value, icon: Icon, trend, color = 'text-primary' }: DashboardCardProps) {
  return (
    <Card className="glass-card p-6 hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-muted-foreground">{title}</p>
          <p className={`${color} neon-text`}>{value}</p>
          {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
        </div>
        <div className={`${color} bg-secondary/50 p-4 rounded-xl`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </Card>
  );
}
