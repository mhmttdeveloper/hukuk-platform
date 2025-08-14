# 🏛️ Hukuk Platformu

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

## 🏗️ Teknoloji Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Search:** MeiliSearch
- **Cache:** Redis
- **Auth:** NextAuth.js
- **Editor:** Tiptap
- **Containerization:** Docker + Docker Compose

## 📁 Proje Yapısı

```
hukuk-platformu/
├── apps/
│   └── web/                 # Next.js web uygulaması
│       ├── src/             # Kaynak kodlar
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
- **URL:** http://localhost:3000
- **Admin:** admin@hukuk-platformu.com / admin123
- **Editör:** editor@hukuk-platformu.com / editor123
- **Yazar:** author@hukuk-platformu.com / author123

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

### 🔄 Devam Eden
- [ ] Auth sistemi
- [ ] Yayın modülü
- [ ] Yorum & puanlama
- [ ] Atıf sistemi

### 📅 Planlanan
- [ ] Kanun & karar sistemi

- [ ] Tema & reklamlar
- [ ] Deploy

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Proje:** [GitHub Issues](https://github.com/username/hukuk-platformu/issues)
- **E-posta:** info@hukuk-platformu.com

---

**Not:** Bu proje geliştirme aşamasındadır. Production kullanımı için ek güvenlik önlemleri alınmalıdır.
