import {
  Home, Users, FileText, BookOpen, Gavel, Settings, BarChart3, MessageSquare,
  Edit3, PenTool, Eye, Plus, FolderOpen, Calendar, Star, Heart, Bell,
  Bookmark, Search, HelpCircle, Shield, Database, Globe, Zap
} from 'lucide-react'

export interface SubMenuItem {
  name: string
  href: string
  exists: boolean
  badge?: string | number
}

export interface MenuItem {
  name: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  exists: boolean
  badge?: string | number
  subItems?: SubMenuItem[]
  roles: string[] // Hangi roller görebilir
}

export interface MenuGroup {
  title: string
  items: MenuItem[]
}

// Menu configuration with role-based visibility
export const menuConfig: MenuGroup[] = [
  {
    title: 'Genel',
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
        exists: true,
        roles: ['admin', 'editor', 'author', 'member']
      },
      {
        name: 'Profilim',
        href: '/profile',
        icon: Users,
        exists: true,
        roles: ['admin', 'editor', 'author', 'member']
      }
    ]
  },
  {
    title: 'İçerik',
    items: [
      {
        name: 'Yayın Yönetimi',
        icon: FileText,
        exists: false,
        roles: ['admin', 'editor'],
        subItems: [
          { name: 'Tüm Yayınlar', href: '/admin/publications', exists: false },
          { name: 'Yeni Yayın Ekle', href: '/admin/publications/new', exists: false },
          { name: 'Bekleyen Onaylar', href: '/admin/publications/pending', exists: false, badge: '5' }
        ]
      },
      {
        name: 'Kanun Yönetimi',
        icon: BookOpen,
        exists: false,
        roles: ['admin'],
        subItems: [
          { name: 'Tüm Kanunlar', href: '/admin/laws', exists: false },
          { name: 'Kanun Ekle', href: '/admin/laws/new', exists: false }
        ]
      },
      {
        name: 'Dava Yönetimi',
        icon: Gavel,
        exists: false,
        roles: ['admin'],
        subItems: [
          { name: 'Tüm Davalar', href: '/admin/cases', exists: false },
          { name: 'Yeni Dava Ekle', href: '/admin/cases/new', exists: false }
        ]
      },
      {
        name: 'Yorum Yönetimi',
        icon: MessageSquare,
        href: '/admin/comments',
        exists: false,
        roles: ['admin', 'editor'],
        badge: '12'
      }
    ]
  },
  {
    title: 'Yazar Paneli',
    items: [
      {
        name: 'Yazılarım',
        icon: PenTool,
        href: '/author/articles',
        exists: true,
        roles: ['author']
      },
      {
        name: 'Yeni Yazı',
        icon: Plus,
        href: '/author/articles/new',
        exists: true,
        roles: ['author']
      },
      {
        name: 'Taslaklarım',
        icon: Edit3,
        href: '/author/drafts',
        exists: true,
        roles: ['author'],
        badge: '3'
      },
      {
        name: 'Yayınlanan Yazılarım',
        icon: Eye,
        href: '/author/published',
        exists: true,
        roles: ['author']
      }
    ]
  },
  {
    title: 'Sistem',
    items: [
      {
        name: 'Kullanıcı Yönetimi',
        icon: Shield,
        href: '/admin/users',
        exists: true,
        roles: ['admin']
      },
      {
        name: 'İstatistikler',
        icon: BarChart3,
        href: '/admin/analytics',
        exists: false,
        roles: ['admin', 'editor']
      },
      {
        name: 'Sistem Ayarları',
        icon: Settings,
        href: '/admin/settings',
        exists: false,
        roles: ['admin']
      },
      {
        name: 'Veritabanı',
        icon: Database,
        href: '/admin/database',
        exists: false,
        roles: ['admin']
      }
    ]
  },
  {
    title: 'Kişisel',
    items: [
      {
        name: 'Yorumlarım',
        icon: MessageSquare,
        href: '/my-comments',
        exists: true,
        roles: ['member', 'author', 'editor']
      },
      {
        name: 'Bildirimlerim',
        icon: Bell,
        href: '/notifications',
        exists: true,
        roles: ['admin', 'editor', 'author', 'member'],
        badge: '2'
      },
      {
        name: 'Ayarlarım',
        icon: Settings,
        href: '/settings',
        exists: true,
        roles: ['admin', 'editor', 'author', 'member']
      },
      {
        name: 'Yardım',
        icon: HelpCircle,
        href: '/help',
        exists: true,
        roles: ['admin', 'editor', 'author', 'member']
      },
      {
        name: 'Test Menü 1',
        icon: Search,
        href: '/test1',
        exists: false,
        roles: ['admin', 'editor', 'author', 'member']
      },
      {
        name: 'Test Menü 2',
        icon: Globe,
        href: '/test2',
        exists: false,
        roles: ['admin', 'editor', 'author', 'member']
      },
      {
        name: 'Test Menü 3',
        icon: Zap,
        href: '/test3',
        exists: false,
        roles: ['admin', 'editor', 'author', 'member']
      }
    ]
  }
]

// Helper function to get menu items for a specific role
export function getMenuForRole(role: string): MenuGroup[] {
  return menuConfig.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(role))
  })).filter(group => group.items.length > 0)
}

// Helper function to check if user has access to a specific route
export function hasRouteAccess(route: string, role: string): boolean {
  for (const group of menuConfig) {
    for (const item of group.items) {
      if (item.href === route && item.roles.includes(role)) {
        return true
      }
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (subItem.href === route && item.roles.includes(role)) {
            return true
          }
        }
      }
    }
  }
  return false
}
