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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight
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
  const { open, setOpen } = useSidebar();
  const collapsed = !open;
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);

  const toggleSidebar = () => setOpen(!open);

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
    `group flex items-center w-full p-3 rounded-xl transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-primary/10 to-civic/10 text-primary border-l-4 border-primary font-semibold shadow-lg backdrop-blur-sm"
        : "text-white/80 hover:bg-white/10 hover:text-white hover:backdrop-blur-sm hover:shadow-md"
    }`;

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-72'} bg-gradient-to-b from-primary via-primary/95 to-primary/90 border-r-0 shadow-2xl backdrop-blur-xl transition-all duration-300`}>
      <SidebarContent className="bg-transparent relative">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm rounded-r-3xl" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-sm">
          <div className={`flex items-center space-x-3 transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-civic to-warning rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">Officer Portal</h1>
              <p className="text-white/70 text-sm font-medium">Municipal Dashboard</p>
            </div>
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <SidebarGroup className="px-4 py-6 relative">
          <SidebarGroupLabel className={`text-white/60 uppercase text-xs font-bold tracking-widest px-3 mb-4 transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/officer-dashboard"}
                      className={({ isActive }) => getNavCls({ isActive })}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative">
                        <item.icon className="w-6 h-6 flex-shrink-0 transition-all duration-300 drop-shadow-sm" />
                        {isActive(item.url) && (
                          <div className="absolute -inset-1 bg-gradient-to-r from-civic/30 to-warning/30 rounded-lg blur animate-pulse" />
                        )}
                      </div>
                      {!collapsed && (
                        <span className="truncate ml-4 font-medium transition-all duration-300">
                          {item.title}
                        </span>
                      )}
                      {!collapsed && isActive(item.url) && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-civic rounded-full animate-pulse" />
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className="mt-auto p-4 border-t border-white/10 backdrop-blur-sm relative">
          <SidebarMenuButton asChild>
            <button
              onClick={handleLogout}
              className="group flex items-center w-full p-3 rounded-xl transition-all duration-300 text-white/80 hover:bg-gradient-to-r hover:from-danger/20 hover:to-danger/10 hover:text-white hover:backdrop-blur-sm hover:shadow-md border border-transparent hover:border-danger/20"
            >
              <LogOut className="w-6 h-6 flex-shrink-0 transition-all duration-300 group-hover:scale-110" />
              {!collapsed && (
                <span className="truncate ml-4 font-medium">Logout</span>
              )}
            </button>
          </SidebarMenuButton>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-4 w-32 h-32 bg-gradient-to-br from-civic/10 to-warning/10 rounded-full blur-2xl opacity-50" />
        <div className="absolute bottom-20 left-4 w-24 h-24 bg-gradient-to-br from-success/10 to-primary/10 rounded-full blur-2xl opacity-30" />
      </SidebarContent>
    </Sidebar>
  );
}