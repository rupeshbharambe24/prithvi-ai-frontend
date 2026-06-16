import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Flame,
  Activity,
  Building2,
  Wind,
  Target,
  Settings,
  Bell,
  Network,
  FileText,
  Database,
  Shield,
  MapPin,
  Users,
  Globe,
  Brain,
} from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";

const ConsoleSidebar = () => {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const mainItems = [
    { icon: LayoutDashboard, label: t('nav.overview'), path: '/console/overview' },
    { icon: Flame, label: t('nav.heat'), path: '/console/heat' },
    { icon: Activity, label: t('nav.disease'), path: '/console/disease' },
    { icon: Building2, label: t('nav.hospital'), path: '/console/hospital' },
    { icon: Wind, label: t('nav.air'), path: '/console/air' },
    { icon: Bell, label: t('nav.alerts'), path: '/console/alerts' },
  ];

  const toolsItems = [
    { icon: Target, label: t('nav.scenario'), path: '/console/scenario' },
    { icon: Network, label: t('nav.kg'), path: '/console/kg' },
    { icon: FileText, label: t('nav.evidence'), path: '/console/evidence' },
  ];

  const systemItems = [
    { icon: Database, label: t('nav.catalog'), path: '/console/catalog' },
    { icon: Shield, label: t('nav.fairness'), path: '/console/fairness' },
    { icon: Brain, label: 'Models', path: '/console/models' },
    { icon: Settings, label: t('nav.settings'), path: '/console/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Globe className="h-6 w-6 text-primary" />
        {!collapsed && (
          <div className="font-bold">
            <span className="text-primary">PRITHVI</span>
            <span className="text-muted-foreground text-sm">-AI</span>
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && "Main"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className="flex items-center gap-2"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && "Tools"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className="flex items-center gap-2"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && "System"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className="flex items-center gap-2"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t border-border">
        <SidebarTrigger />
      </div>
    </Sidebar>
  );
};

export default ConsoleSidebar;
