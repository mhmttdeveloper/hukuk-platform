# 🏛️ YargıTam

Hukukçulara özel, SEO uyumlu yayın platformu. İlk fazda yayınlar, yorumlar, puanlama ve kanun/yargıtay karar kütüphanesi özellikleri bulunmaktadır.

## 🚀 Özellikler

### 📝 Yayınlar
- RankMath benzeri SEO asistanı
- Kategori, yazar, metin filtreleme
- Atıf sistemi (TBK m.6, Yargıtay kararları)
- OG görsel otomatik üretimi

### ⚖️ Kanun ve Yargıtay Kararları
- Yetkili editörler tarafından ekleme
- Otomatik madde parçalama
- Her madde için ayrı URL
- Kapsamlı arama

### 💬 Yorumlar ve Puanlama
- 5 yıldız puanlama sistemi
- Hukukçu üyeler için isimli yorumlar
- Doğrulanmamış kullanıcılar için e-posta + captcha
- Yazar kontrolü

### 👤 Kullanıcı Profili
- Detaylı profil bilgileri
- Dijital kartvizit
- İsteğe bağlı iletişim bilgileri

### ✅ Üyelik ve Doğrulama
- Sadece hukukçular kayıt olabilir
- Baro e-posta doğrulama
- Manuel onay sistemi

### 🎨 **YENİ: Gelişmiş UI/UX Sistemi** 🆕
- **Responsive Sidebar:** Her ekran boyutunda açılabilir sidebar
- **Sticky Header:** Scroll sırasında görünür kalan header
- **Dark Mode:** Tam responsive dark mode toggle
- **Mobile-First:** 768px breakpoint'te optimize edilmiş davranış
- **Smooth Animasyonlar:** Tüm geçişlerde smooth transitions
- **Ziyaretçi Modu:** Ayrı sidebar sistemi (mobilde)

## 🏗️ Teknoloji Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Search:** MeiliSearch
- **Cache:** Redis
- **Auth:** NextAuth.js
- **Editor:** Tiptap
- **Containerization:** Docker + Docker Compose

## �� Proje Yapısı

```
yargi-tam/
├── apps/
│   └── web/                 # Next.js web uygulaması
│       ├── src/             # Kaynak kodlar
│       │   ├── app/         # App Router
│       │   │   ├── (public)/    # Ziyaretçi sayfaları
│       │   │   ├── (dashboard)/ # Kullanıcı sayfaları
│       │   │   └── api/         # API routes
│       │   ├── components/  # React component'leri
│       │   │   ├── layout/      # Layout component'leri
│       │   │   │   ├── Navbar.tsx       # Responsive header
│       │   │   │   ├── Sidebar.tsx      # User mode sidebar
│       │   │   │   └── VisitorSidebar.tsx # Visitor mode sidebar
│       │   │   └── ...
│       │   ├── contexts/    # React context'leri
│       │   ├── lib/         # Utility fonksiyonları
│       │   └── types/       # TypeScript tip tanımları
│       ├── prisma/          # Veritabanı şeması
│       └── package.json
├── packages/
│   └── shared/              # Paylaşılan tipler ve utilities
├── docker-compose.yml       # Docker servisleri
├── turbo.json               # Monorepo yapılandırması
└── package.json             # Ana workspace
```

## 🚀 Kurulum

### 1. Gereksinimler
- Node.js 18+
- Docker & Docker Compose
- Git

### 2. Projeyi klonlayın
```bash
git clone <repository-url>
cd hukuk-platformu
```

### 3. Bağımlılıkları yükleyin
```bash
npm install
```

### 4. Environment dosyası oluşturun
```bash
# apps/web/.env.local dosyası oluşturun
cp env.example apps/web/.env.local
# Gerekli değerleri düzenleyin
```

### 5. Docker servislerini başlatın
```bash
npm run docker:up
```

### 6. Veritabanını hazırlayın
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 7. Geliştirme sunucusunu başlatın
```bash
npm run dev
```

## 🔧 Geliştirme Komutları

```bash
# Geliştirme
npm run dev              # Tüm uygulamaları başlat
npm run build            # Tüm uygulamaları build et
npm run lint             # Lint kontrolü

# Veritabanı
npm run db:generate      # Prisma client oluştur
npm run db:migrate       # Migration çalıştır
npm run db:seed          # Test verisi ekle
npm run db:studio        # Prisma Studio aç

# Docker
npm run docker:up        # Servisleri başlat
npm run docker:down      # Servisleri durdur
```

## 🌐 Erişim Bilgileri

### Web Uygulaması
- **URL:** http://localhost:3000 (veya otomatik port)
- **Admin:** admin@test / admin123
- **Editör:** editor@test / editor123
- **Yazar:** author@test / author123

### Servisler
- **PostgreSQL:** localhost:5432
- **MeiliSearch:** http://localhost:7700
- **Redis:** localhost:6379

## 📋 Geliştirme Planı

### ✅ Tamamlanan
- [x] Proje altyapısı (monorepo)
- [x] Docker servisleri
- [x] Veritabanı şeması
- [x] Temel type tanımları
- [x] **YENİ: Layout ve navigasyon sistemi**
- [x] **YENİ: Responsive sidebar sistemi**
- [x] **YENİ: Sticky header ve smooth animasyonlar**
- [x] **YENİ: Ziyaretçi ve kullanıcı modu ayrımı**

### 🔄 Devam Eden
- [ ] Auth sistemi
- [ ] Yayın modülü
- [ ] Yorum & puanlama
- [ ] Atıf sistemi

### 📅 Planlanan
- [ ] Kanun & karar sistemi
- [ ] Tema & reklamlar
- [ ] Deploy

## 🎨 **YENİ: UI/UX Özellikleri** 🆕

### **Responsive Sidebar Sistemi**
- **Kullanıcı Modunda:** Her ekran boyutunda açılabilir
- **Ziyaretçi Modunda:** Sadece 768px altında görünür
- **Toggle Özelliği:** Aç/kapat butonu ve X butonu
- **Smooth Animasyonlar:** 300ms transition süreleri

### **Sticky Header**
- **Scroll Efekti:** Scroll sırasında backdrop filter
- **Responsive Davranış:** 768px altında optimize edilmiş
- **Dark Mode Toggle:** Responsive yerleşim
- **Z-Index Yönetimi:** Proper stacking order

### **Responsive Breakpoint Sistemi**
- **768px:** Kritik responsive breakpoint
- **Navigation Linkler:** Küçük ekranlarda sidebar'a taşınır
- **Kullanıcı Adı:** Büyük ekranlarda görünür
- **Site İsmi:** Küçük ekranlarda ortalanır

### **Component Yapısı**
- **Navbar.tsx:** Responsive header, sticky, dark mode
- **Sidebar.tsx:** User mode sidebar, toggle, responsive
- **VisitorSidebar.tsx:** Visitor mode sidebar, mobile only
- **ThemeToggle.tsx:** Size prop ile responsive boyutlar

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Proje:** [GitHub Issues](https://github.com/username/yargi-tam/issues)
- **E-posta:** info@yargi-tam.com

---

**Not:** Bu proje geliştirme aşamasındadır. Production kullanımı için ek güvenlik önlemleri alınmalıdır.

**Son Güncelleme:** 15 Ağustos 2024 - Layout ve navigasyon sistemi tamamen yenilendi, responsive tasarım optimize edildi, dokümantasyon güncellendi.

**Versiyon:** 2.1.1
