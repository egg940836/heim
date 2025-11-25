import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Icons } from '../Icons';

// AdminLayout handles the sidebar and basic structure for admin pages
export const AdminLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  // Helper to determine active state
  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-[#F2F9F5] flex flex-col lg:flex-row font-sans text-ac-darkBrown">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-ac-darkBrown text-white p-4 flex items-center justify-between z-40 border-b-4 border-white shadow-md h-16">
            <div className="flex items-center">
                <div className="w-8 h-8 bg-ac-green rounded-full flex items-center justify-center text-lg mr-2 border-2 border-white">🐹</div>
                <div className="font-black">HeimOS 3.0</div>
            </div>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/10 rounded-lg">
                <Icons.Menu className="w-6 h-6" />
            </button>
        </div>

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 h-full w-64 bg-ac-darkBrown text-[#F2F9F5] flex flex-col z-50 border-r-4 border-white transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-6 border-b border-white/10 flex items-center h-24 lg:h-auto">
                <div className="w-10 h-10 bg-ac-green rounded-full flex items-center justify-center text-xl mr-3 border-2 border-white">🐹</div>
                <div>
                    <h3 className="font-black">哈姆店長</h3>
                    <p className="text-xs text-ac-green font-bold">Administrator</p>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-white/50 hover:text-white">
                     <Icons.Close className="w-6 h-6" />
                </button>
            </div>
            
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {[
                    { path: '/admin', label: '營運儀表板', icon: <Icons.Dashboard className="w-5 h-5"/>, exact: true },
                    { path: '/admin/orders', label: '訂單管理', icon: <Icons.ClipboardList className="w-5 h-5"/> },
                    { path: '/admin/products', label: '商品中心', icon: <Icons.BellBag className="w-5 h-5"/> },
                    { path: '/admin/workshop', label: '工坊管理', icon: <Icons.Workbench className="w-5 h-5"/> },
                    { path: '/admin/converter', label: '風格轉換', icon: <Icons.Palette className="w-5 h-5"/> },
                    { path: '/admin/blog', label: '日誌中心', icon: <Icons.Dodo className="w-5 h-5"/> },
                    { path: '/admin/faq', label: '常見問題', icon: <span className="w-5 h-5 flex items-center justify-center font-bold">?</span> },
                    { path: '/admin/residents', label: '島民名冊', icon: <Icons.Users className="w-5 h-5"/> },
                    { path: '/admin/settings', label: '系統設定', icon: <Icons.Settings className="w-5 h-5"/> },
                ].map(item => {
                    const active = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`w-full flex items-center p-3 rounded-xl font-bold transition-all ${active ? 'bg-ac-green text-white shadow-md translate-x-1' : 'text-gray-300 hover:bg-white/10'}`}
                        >
                            {item.icon} <span className="ml-3">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
            
            <div className="p-4 border-t border-white/10">
                <button onClick={onLogout} className="w-full flex items-center justify-center p-2 text-red-300 font-bold hover:bg-red-900/20 rounded-xl">
                    <Icons.Lock className="w-4 h-4 mr-2"/> 登出
                </button>
            </div>
        </aside>

        {/* Overlay */}
        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

        {/* Main Content Area */}
        <main className="flex-1 p-4 pt-20 lg:p-8 lg:pt-12 min-w-0">
            <Outlet />
        </main>
    </div>
  );
};

