import React from 'react';

export type LayoutType = 'app' | 'auth' | 'error' | 'loading';

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  layout?: LayoutType;
  protected?: boolean;
  title?: string;
  description?: string;
  breadcrumb?: string;
  icon?: React.ReactNode;
  hideInNav?: boolean;
  children?: AppRoute[];
}

export interface NavigationItem {
  path: string;
  title: string;
  icon: React.ReactNode;
  badge?: string | number;
  children?: NavigationItem[];
  external?: boolean;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
}
