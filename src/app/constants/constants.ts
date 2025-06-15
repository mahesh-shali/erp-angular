export interface SidebarItem {
  icon: string;
  label: string;
  section: string;
  route: string;
}

export const APP_CONSTANTS = {
  NAV_ITEMS: [
    { icon: '🏠', label: 'Home', section: 'dashboard', route: '/home' },
    {
      icon: '🏠',
      label: 'Dashboard',
      section: 'dashboard',
      route: '/dashboard',
    },
    { icon: '🏠', label: 'Masters', section: 'dashboard', route: '/settings' },
    { icon: '🏠', label: 'Sales', section: 'dashboard', route: '/settings' },
    {
      icon: '🏠',
      label: 'Outsourcing',
      section: 'settings',
      route: '/settings',
    },
    {
      icon: '🏠',
      label: 'Inventory',
      section: 'dashboard',
      route: '/settings',
    },
    { icon: '🏠', label: 'Planning', section: 'dashboard', route: '/settings' },
    {
      icon: '🏠',
      label: 'Inspection',
      section: 'dashboard',
      route: '/settings',
    },
    { icon: '🏠', label: 'Report', section: 'dashboard', route: '/settings' },
  ],
};
