import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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
  Building2,
  Menu
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

  return (
    <Sidebar
      className={`transition-all duration-200 ease-out ${
        open 
          ? "w-72" 
          : "w-16"
      }`}
      collapsible="icon"
    >
      <SidebarContent className="bg-white/95 backdrop-blur-md border-r border-gray-200 relative">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-3 transition-opacity duration-200 ${!open && 'opacity-0'}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-civic rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                {open && (
                  <div>
                    <h1 className="text-lg font-bold text-foreground">CivicPortal</h1>
                    <p className="text-xs text-muted-foreground">Officer Dashboard</p>
                  </div>
                )}
              </div>
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Menu className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          end 
                          className={({ isActive }) => 
                            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                              isActive 
                                ? 'bg-primary text-white' 
                                : 'hover:bg-gray-100 text-foreground'
                            }`
                          }
                        >
                          <item.icon className="w-5 h-5" />
                          {open && (
                            <span className="font-medium text-sm">{item.title}</span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              {open && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}