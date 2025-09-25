import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Shield
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { title: "Dashboard", url: "/officer-dashboard", icon: LayoutDashboard },
  { title: "Complaints", url: "/officer-dashboard/complaints", icon: FileText },
  { title: "Contractors", url: "/officer-dashboard/contractors", icon: Users },
  { title: "Analytics", url: "/officer-dashboard/analytics", icon: BarChart3 },
  { title: "Settings", url: "/officer-dashboard/settings", icon: Settings },
];

export function OfficerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-yellow-50 text-blue-900 border-l-4 border-yellow-500 font-semibold shadow-sm"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <Sidebar className="w-64 bg-slate-900 border-r-0 shadow-xl">
      <SidebarContent className="bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Officer Portal</h1>
              <p className="text-slate-400 text-xs">Municipal Dashboard</p>
            </div>
          </div>
          <SidebarTrigger className="text-slate-400 hover:text-white" />
        </div>

        <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className="text-slate-400 uppercase text-xs font-semibold tracking-wider px-3 mb-2">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/officer-dashboard"}
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className="mt-auto p-2 border-t border-slate-700">
          <SidebarMenuButton asChild>
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg transition-all duration-200 text-slate-400 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}