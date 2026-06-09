import { NavLink } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  FilePlus2,
  ScanSearch,
  Target,
  ClipboardCheck,
  WalletMinimal,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '首页' },
  { to: '/application', icon: FilePlus2, label: '进件管理' },
  { to: '/verification', icon: ScanSearch, label: '核验中心' },
  { to: '/scoring', icon: Target, label: '风险评分' },
  { to: '/review', icon: ClipboardCheck, label: '审核审批' },
  { to: '/post-loan', icon: WalletMinimal, label: '贷后管理' },
  { to: '/reports', icon: BarChart3, label: '数据报表' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 flex flex-col bg-primary-950">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-600">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-white">风控审核台</span>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-800/60 text-white'
                      : 'text-slate-300 hover:bg-primary-800/30 hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-accent-600" />
                    )}
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
            李
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-white">李审核员</span>
            <span className="truncate text-xs text-slate-400">高级审核员</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
