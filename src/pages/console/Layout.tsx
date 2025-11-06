import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import ConsoleSidebar from "@/components/console/ConsoleSidebar";
import ConsoleTopbar from "@/components/console/ConsoleTopbar";

const ConsoleLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ConsoleSidebar />
        <div className="flex-1 flex flex-col">
          <ConsoleTopbar />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ConsoleLayout;
