export interface NestedPermission {
  id: number;
  orguserid: number;
  nestsidenavbarid: number;
  canread: boolean;
  canwrite: boolean;
  canput: boolean;
  candelete: boolean;
  isvisible: boolean;
  ishidden: boolean;
  isrestricted: boolean;
  label: string;
  option: string;
  route: string;
  nestedPermissions?: NestedPermission[]; // recursive
  isOpen?: boolean;
  icon?: string;
}
export interface SubPermission {
  id: number;
  orguserid: number;
  subsidenavbarid: number;
  canread: boolean;
  canwrite: boolean;
  canput: boolean;
  candelete: boolean;
  isvisible: boolean;
  ishidden: boolean;
  isrestricted: boolean;
  label: string;
  option: string;
  route: string;
  nestedPermissions: NestedPermission[];
  isOpen?: boolean;
}

export interface SidebarItem {
  id: number;
  orguserid: number;
  sidenavbarid: number;
  canread: boolean;
  canwrite: boolean;
  canput: boolean;
  candelete: boolean;
  isvisible: boolean;
  ishidden: boolean;
  isrestricted: boolean;
  icon: string;
  label: string;
  section: string;
  subPermissions?: SubPermission[];
  isOpen?: boolean;
  route?: string;
}
