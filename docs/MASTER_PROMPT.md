Sen bir senior full-stack lead developer gibi davranacaksın. Görevin, aşağıda tanımlanan "Hukuki Yayın Platformu" projesini ilk faz özellikleriyle geliştirmek, ancak mimariyi ileride sosyal ağ (LinkedIn tarzı), mesajlaşma, mobil uygulama gibi ek modüller entegre edilebilecek şekilde tasarlamak. Şu anda sadece ilk faz özellikleri geliştirilecek, ancak ileride refactor gerektirmeyecek esneklik sağlanacak.

Tüm geliştirme sürecini modüler şekilde planla ve sırayla uygula. Her modülde:
1. Gereksinimleri analiz et
2. Gerekirse veri modelini güncelle
3. API endpointlerini tanımla
4. Frontend bileşenlerini oluştur
5. Test et ve optimize et

---

## 1. Proje Tanımı
- Hukukçulara özel, SEO uyumlu yayın platformu.
- İlk faz: "Yayınlar" (SEO odaklı yazılar) + yorumlar + puanlama + kanun & yargıtay karar kütüphanesi.
- İleride: Makaleler, sosyal ağ özellikleri, mesajlaşma, mobil uygulama.
- Tüm mimari baştan bu genişlemelere uygun olacak.

---

## 2. Özellik Listesi

### Yayınlar
- RankMath benzeri SEO asistanı (başlık yapısı, meta açıklaması, kelime yoğunluğu, görsel alt etiketi, otomatik TOC).
- Kategori, yazar, metin filtreleme.
- Atıf sistemi: TBK m.6 veya Yargıtay kararlarına referans verebilme.
- OG görsel otomatik üretimi (LinkedIn, X, WhatsApp vb. platformlara uygun).

### Kanun ve Yargıtay Kararları
- Yalnızca yetkili editörler ekleyebilir.
- Tek metinden yüklenip madde başlıkları regex ile otomatik parçalanır.
- Her maddeye ayrı URL verilir.
- Madde sayfasından tüm kanunun listesine erişim.

### Yorumlar ve Puanlama
- 5 yıldız sistemi, herkese açık.
- Yorumlar: 
  - Hukukçu üyeler → isimle yorum.
  - Doğrulanmamış → e-posta + captcha doğrulaması.
- Yazar yorumları açıp kapatabilir.

### Kullanıcı Profili
- Alanlar: isim, meslek unvanı, biyografi, iletişim bilgileri, sosyal medya linkleri.
- Dijital kartvizit: mobil uyumlu, iframe/API ile diğer sitelere gömülebilir.
- İletişim bilgileri isteğe bağlı.

### Üyelik ve Doğrulama
- Herkes kayıt olamaz: yalnızca hukukçular.
- Doğrulama:
  - Avukatlar → baro levhasındaki e-posta ile otomatik + manuel kontrol.
  - Diğer meslekler → manuel onay.
- Doğrulanmamış üyelerin içerik ekleme yetkisi olmaz.

### Tema ve Reklamlar
- Dark / light mode.
- Mobil uyumlu reklam alanları, içerik kalitesini bozmadan.

---

## 3. Teknoloji Seçimi
- **Frontend:** Next.js (App Router, SSR/SSG), TailwindCSS, ShadCN UI.
- **Backend API:** NestJS veya Next.js API routes (TypeScript).
- **Database:** PostgreSQL + Prisma ORM.
- **Editor:** Tiptap + custom SEO uyarı modülü + kaynak ekleme butonu.
- **Auth:** NextAuth.js (custom verification flow).
- **Search:** MeiliSearch veya Elasticsearch.
- **Image Handling:** Sharp, OG Image API.
- **Containerization:** Docker + Docker Compose.
- **Version Control:** Git + GitHub (main/dev/feature branch stratejisi).
- **Deployment:** Vercel (frontend) + Railway/Fly.io/Render (backend).

---

## 4. Veri Modelleri (Prisma)
- User: id, name, surname, email, passwordHash, role, verifiedStatus, profession, bio, socialLinks, contactInfo, createdAt, updatedAt.
- Publication: id, title, slug, metaDescription, categoryId, authorId, content, featuredImage, seoScore, status (draft, review, unpublished, updated), allowComments, allowRatings, createdAt, updatedAt.
- Category: id, name, slug.
- Rating: id, publicationId, userId/null, score, createdAt.
- Comment: id, publicationId, userId/null, content, createdAt, status.
- Reference: id, type (law, case), label, linkedId (optional), createdAt.
- Law: id, title, slug, fullText, createdAt, updatedAt.
- LawArticle: id, lawId, number, text, createdAt, updatedAt.
- Case: id, title, court, date, text, createdAt, updatedAt.

---

## 5. API Uçları
### Auth
- POST /auth/register
- POST /auth/login
- GET /auth/logout
- POST /auth/verify-email
- POST /auth/baro-verification

### Users
- GET /users/:id
- PUT /users/:id
- GET /users (liste)

### Publications
- GET /publications
- GET /publications/:slug
- POST /publications
- PUT /publications/:id
- DELETE /publications/:id

### Categories
- CRUD

### Ratings
- POST /ratings
- GET /ratings/:publicationId

### Comments
- POST /comments
- GET /comments/:publicationId
- DELETE /comments/:id

### Laws
- POST /laws/upload
- GET /laws
- GET /laws/:id
- GET /laws/:lawId/articles/:number

### Cases
- CRUD

---

## 6. Görev Listesi (Modüler)

### 1️⃣ Proje Altyapısı
- Monorepo kur (frontend, backend, shared).
- Docker Compose: PostgreSQL + MeiliSearch.
- GitHub repo oluştur, branch stratejisini ayarla.

### 2️⃣ Database & ORM
- Prisma şemalarını oluştur.
- Migration yap.
- Seed dosyası ile test verisi ekle.

### 3️⃣ Auth Sistemi
- NextAuth.js entegrasyonu.
- Baro e-posta doğrulama flow.
- Manuel onay mekanizması.

### 4️⃣ Yayın Modülü
- Tiptap editör.
- SEO asistanı modülü.
- Yayın CRUD + kategori yönetimi.

### 5️⃣ Yorum & Puanlama
- Backend endpointleri.
- Frontend bileşenleri (yorum listesi, puan ortalaması).

### 6️⃣ Atıf Sistemi
- Editörde “kaynak ekle” butonu.
- Admin’de “boş atıf” listesi.

### 7️⃣ Kanun & Karar Sistemi
- Metin yükleme + regex ile madde parçalama.
- Her maddeye özel URL.
- Tüm kanun listesi sayfası.

### 8️⃣ OG Görsel Üretimi
- Dinamik şablon sistemi.
- API route ile görsel oluşturma.

### 9️⃣ Tema & Reklamlar
- Dark/light switch.
- Mobil uyumlu reklam bileşenleri.

### 🔟 Deploy
- Vercel + Railway/Fly.io/Render.

---

## 7. Güvenlik
- XSS, CSRF, SQL injection önlemleri.
- Rate limiting (özellikle yorum ve puanlama).
- File upload boyut limitleri.

---

## 8. Test & Optimize
- Jest ile backend testleri.
- Playwright ile frontend testleri.
- Lighthouse raporu ile performans iyileştirme.

