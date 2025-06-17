export interface SidebarItem {
  icon: string; // just the icon name or emoji as string
  label: string;
  section: string;
  route: string;
}

export const APP_CONSTANTS = {
  NAV_ITEMS: [
    {
      icon: 'home', // just icon name as string for mat-icon
      label: 'Home',
      section: 'dashboard',
      route: '/home',
    },
    {
      icon: 'dashboard', // another material icon name
      label: 'Dashboard',
      section: 'dashboard',
      route: '/dashboard',
    },
    {
      icon: 'settings',
      label: 'Masters',
      section: 'dashboard',
      route: '/settings',
    },
    {
      icon: 'shopping_cart',
      label: 'Sales',
      section: 'dashboard',
      route: '/settings',
    },
    {
      icon: 'group_work',
      label: 'Outsourcing',
      section: 'settings',
      route: '/settings',
    },
    {
      icon: 'inventory',
      label: 'Inventory',
      section: 'dashboard',
      route: '/settings',
    },
    {
      icon: 'calendar_today',
      label: 'Planning',
      section: 'dashboard',
      route: '/settings',
    },
    {
      icon: 'search',
      label: 'Inspection',
      section: 'dashboard',
      route: '/settings',
    },
    {
      icon: 'assessment',
      label: 'Report',
      section: 'dashboard',
      route: '/settings',
    },
  ],
};
