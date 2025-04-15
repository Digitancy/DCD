'use client'

import {
  Rocket,
  GitBranch,
  Lightbulb,
  Users,
  Laptop,
  Database,
  Crown,
  UserCog,
  Code,
  User,
  Building2,
  ArrowRight,
  Target,
  FileText,
  RefreshCw,
  Download,
  Building,
  Briefcase,
  ChartBar,
  Brain,
  Network,
  LineChart,
  Menu,
  Mail,
  Lock,
  LucideIcon
} from 'lucide-react'

export type IconName = 'Rocket' | 'GitBranch' | 'Lightbulb' | 'Users' | 'Laptop' | 'Database' | 'Crown' | 'UserCog' | 'Code' | 'User' | 'Building2' | 'ArrowRight' | 'Target' | 'FileText' | 'RefreshCw' | 'Download' | 'Building' | 'Briefcase' | 'ChartBar' | 'Brain' | 'Network' | 'LineChart' | 'Menu' | 'Mail' | 'Lock'

const icons: Record<IconName, LucideIcon> = {
  Rocket,
  GitBranch,
  Lightbulb,
  Users,
  Laptop,
  Database,
  Crown,
  UserCog,
  Code,
  User,
  Building2,
  ArrowRight,
  Target,
  FileText,
  RefreshCw,
  Download,
  Building,
  Briefcase,
  ChartBar,
  Brain,
  Network,
  LineChart,
  Menu,
  Mail,
  Lock
}

export interface LucideIconProps {
  name: IconName
  size?: number
  className?: string
}

export function LucideIconWrapper({ name, size, className }: LucideIconProps) {
  const Icon = icons[name]
  return <Icon size={size} className={className} />
} 