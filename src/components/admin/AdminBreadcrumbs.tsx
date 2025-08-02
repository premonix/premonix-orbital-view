import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { adminTabs } from '@/constants/adminTabs';
import { useAuth } from '@/contexts/AuthContext';

interface AdminBreadcrumbsProps {
  activeTab: string;
}

export const AdminBreadcrumbs = ({ activeTab }: AdminBreadcrumbsProps) => {
  const { user } = useAuth();
  const currentTab = adminTabs.find(tab => tab.id === activeTab);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Admin Console</BreadcrumbLink>
        </BreadcrumbItem>
        {currentTab && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentTab.label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};