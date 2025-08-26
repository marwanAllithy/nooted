import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { TEST_FILES } from "@/lib/testData";

type Props = {
  currentPath: string | null;
  onOpenFile: (path: string) => void;
};

export default function EditorSidebar({ currentPath, onOpenFile }: Props) {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      className="bg-black text-white"
    >
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Test JSON files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {TEST_FILES.map((f) => (
                <SidebarMenuItem key={f.path}>
                  <SidebarMenuButton
                    isActive={currentPath === f.path}
                    onClick={() => onOpenFile(f.path)}
                  >
                    {f.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
