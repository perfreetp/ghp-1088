import { useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';

const breadcrumbMap: Record<string, [string, string]> = {
  '/': ['首页', '数据概览'],
  '/application': ['进件管理', '申请录入'],
  '/verification': ['核验中心', '多维核验'],
  '/scoring': ['风险评分', '评分详情'],
  '/review': ['审核审批', '人工审核'],
  '/post-loan': ['贷后管理', '还款跟踪'],
  '/reports': ['数据报表', '风险分析'],
};

export function Header() {
  const location = useLocation();
  const breadcrumb = breadcrumbMap[location.pathname] || ['首页', '数据概览'];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white border-b border-slate-200 px-6">
      <div className="flex items-center">
        <nav className="flex items-center text-sm">
          <span className="text-slate-500">{breadcrumb[0]}</span>
          <span className="mx-2 text-slate-400">/</span>
          <span className="font-medium text-slate-800">{breadcrumb[1]}</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索..."
            className="h-9 w-64 rounded-lg bg-slate-100 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:bg-white transition-all duration-150"
          />
        </div>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors duration-200">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
            李
          </div>
          <span className="text-sm font-medium text-slate-700">李审核员</span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    </header>
  );
}

export default Header;
