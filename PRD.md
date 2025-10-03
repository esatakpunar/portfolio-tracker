📄 PRD — Modern Portfolio Tracker Uygulaması
1. Amaç

Kullanıcının sahip olduğu varlıkları (altın, döviz, gümüş vb.) hızlı ve sezgisel bir şekilde ekleyip çık8. Öne Çıkan Özellikler

### 8.1 Modern UX Patterns
- **Swipe Navigation**: Touch-friendly değer değiştirme
- **Sticky Header**: Scrollda sabit header
- **Bottom Navigation**: Mobil-native navigasyon
- **Modal Interactions**: Overlay ile varlık ekleme
- **Hover Effects**: Desktop için subtle hover animasyonları

### 8.2 Performance Optimizations
- **Local Storage**: Instant data persistence
- **Component Splitting**: Modular component yapısı
- **SCSS Modules**: Optimize edilmiş stil yönetimi
- **Vue 3 Composition API**: Modern reactivity

### 8.3 PWA Features
- **Auto Update**: Otomatik güncelleme
- **Offline Ready**: Service worker desteği
- **Install Prompt**: Ana ekrana eklemeak. Toplam portföy değeri farklı para birimleri ve altın cinsinden görüntülenebilmeli.

Odak: Glassmorphism tasarım dili ile modern premium ekonomi uygulaması deneyimi. Mobil öncelikli responsive tasarım.

2. Hedefler

✅ **Tamamlanan Özellikler:**
- Modern glassmorphism UI/UX tasarımı
- 3 ana bölüm: Portfolio, History, Settings
- Varlık ekleme/silme ve otomatik gruplandırma
- Swipe ve slider ile TL/USD/EUR/ALTIN görünümleri
- İşlem geçmişi takibi
- Ayarlar paneli ve veri sıfırlama
- PWA (Progressive Web App) desteği
- Local storage ile veri saklama

🚧 **Geliştirme Aşamasında:**
- API entegrasyonu (şimdilik sabit fiyatlar)
- Gerçek zamanlı fiyat güncellemeleri
- Gelişmiş grafik entegrasyonu

3. Desteklenen Varlıklar

| Kategori | Varlık Türleri | Açıklama |
|----------|---------------|----------|
| **Altın** | 22 Ayar Gram, 24 Ayar Gram, Çeyrek Altın, Tam Altın | Altın türlerinde otomatik grup karşılığı hesaplama |
| **Döviz** | USD, EUR | Ana para birimleri |
| **Değerli Metal** | Gümüş (gram) | Gram bazında gümüş takibi |

4. Mevcut Özellikler

### 4.1 Portfolio Bölümü
- **Slider Görünüm**: Swipe/click ile TL/USD/EUR/ALTIN değer görünümleri
- **Otomatik Gruplandırma**: Aynı tür varlıklar otomatik olarak gruplanır
- **Gerçek Zamanlı Hesaplama**: Tüm para birimi karşılıkları anlık hesaplanır
- **Modal Ekleme Sistemi**: Header'da + butonu ile hızlı varlık ekleme
- **Swipe Desteği**: Mobilde touch gesture desteği

### 4.2 History (Geçmiş) Bölümü
- **İşlem Geçmişi**: Tüm ekleme/silme işlemleri kayıtlı
- **Zaman Damgası**: Her işlem için tarih/saat bilgisi
- **İkon Sistemi**: Add/Remove işlemleri görsel iconlar ile

### 4.3 Settings (Ayarlar) Bölümü
- **Fiyat Görüntüleme**: Tüm varlık fiyatlarının görüntülenmesi
- **Veri Sıfırlama**: "Reset All" ile tüm portfolio verilerini temizleme
- **Tehlikeli İşlem Onayı**: Kritik işlemler için kullanıcı onayı

5. Kullanıcı Akışı

### 5.1 Portfolio Ana Ekran
```
Header: "Portfolio" + Add Button
├── Total Value Slider (TL/USD/EUR/ALTIN)
├── Asset Groups (grouped by type)
└── Bottom Navigation (Portfolio/History/Settings)
```

### 5.2 Varlık Ekleme (Modal)
```
Modal Popup:
├── Asset Type Dropdown
├── Amount Input
└── Save/Cancel Buttons
```

### 5.3 Navigation Flow
```
Bottom Nav:
├── Portfolio (Ana ekran)
├── History (İşlem geçmişi)
└── Settings (Ayarlar)
```

6. Teknik Gereksinimler

### 6.1 Mevcut Tech Stack
| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| **Vue 3** | ^3.5.22 | Composition API ile modern component geliştirme |
| **Vue Router** | ^4.5.1 | SPA routing (şu anda tek sayfa) |
| **Vuex** | ^4.1.0 | Centralized state management |
| **Axios** | ^1.12.2 | HTTP client (gelecek API entegrasyonu için) |
| **Vite** | ^7.1.7 | Modern build tool ve dev server |
| **SCSS** | ^1.93.2 | Modular styling sistemi |
| **PWA Plugin** | ^1.0.3 | Progressive Web App özellikleri |
| **TailwindCSS** | ^4.1.13 | Utility-first CSS framework |

### 6.2 Proje Yapısı
```
src/
├── components/          # Reusable components
│   ├── AddItemModal.vue    # Varlık ekleme modal'ı
│   ├── PortfolioSection.vue # Portfolio içerik bölümü
│   ├── HistorySection.vue   # Geçmiş işlemler bölümü
│   ├── SettingsSection.vue  # Ayarlar bölümü
│   └── [Other Components]
├── pages/              # Page components
│   └── Home.vue           # Ana sayfa (tüm bölümleri içerir)
├── store/              # Vuex store
│   └── index.js           # Ana store dosyası
├── styles/             # SCSS modülleri
│   ├── _variables.scss    # Design system değişkenleri
│   ├── _base.scss         # Base styles
│   ├── _components.scss   # Component styles
│   └── _utilities.scss    # Utility classes
└── router/             # Vue Router
    └── index.js           # Route tanımları
```

### 6.3 State Management (Vuex)
```javascript
State:
├── items: []          # Portfolio varlıkları
├── prices: {}         # Varlık fiyatları (sabit)
└── history: []        # İşlem geçmişi

Actions:
├── addItem()          # Varlık ekleme
├── removeItem()       # Varlık silme
├── fetchPrices()      # Fiyat güncelleme (şimdilik sabit)
└── resetAll()         # Tüm veriyi sıfırlama

Getters:
└── totalIn()          # Para birimi bazında toplam hesaplama
```

7. UI/UX Design System

### 7.1 Glassmorphism Tasarım
- **Backdrop Blur**: Modern cam efekti
- **Semi-transparent Backgrounds**: rgba(255, 255, 255, 0.08)
- **Subtle Borders**: Hafif beyaz borderlar
- **Glass Shadows**: Derinlik hissi veren gölgeler

### 7.2 Renk Paleti
```scss
Primary: #667eea → #764ba2 (gradient)
Glass: rgba(255, 255, 255, 0.08)
Text Primary: #f8fafc
Text Secondary: #cbd5e1
Text Muted: #64748b
Border: rgba(255, 255, 255, 0.1)
```

### 7.3 Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Font Scales**: xs(12px), sm(14px), base(16px), lg(18px), xl(20px)

### 7.4 Spacing & Layout
- **Space Scale**: 1(4px), 2(8px), 3(12px), 4(16px), 6(24px), 8(32px)
- **Border Radius**: md(6px), lg(8px), xl(12px), 2xl(16px), full(50%)
- **Container**: Max-width 500px, center aligned

8. Geliştirme Öncelikleri

Skeleton hazır: Vue 3 + Router + Vuex + Axios + PWA plugin

Ana sayfa ve ekleme sayfası component’leri mevcut

SCSS minimal tasarım uygulanmış

Agent görevi:

Modern, mobil öncelikli ve minimalist UI tasarımını geliştirmek

Kullanıcı deneyimini artırmak (card spacing, font, renk, buton boyutu, fab konumu)

Responsive detayları optimize etmek

9. Gelecek Roadmap

### 9.1 Kısa Vadeli (1-2 Hafta)
- [ ] **Real-time API Integration**: Canlı fiyat verisi
- [ ] **Edit Asset Feature**: Varlık düzenleme
- [ ] **Export Data**: CSV/JSON export
- [ ] **Dark/Light Theme**: Tema geçişi

### 9.2 Orta Vadeli (1-2 Ay)
- [ ] **Charts & Graphs**: Portfolio performance grafikleri
- [ ] **Price Alerts**: Fiyat uyarıları
- [ ] **Historical Data**: Geçmiş fiyat verileri
- [ ] **Multi-currency Support**: Daha fazla para birimi

### 9.3 Uzun Vadeli (3+ Ay)
- [ ] **User Accounts**: Kullanıcı hesap sistemi
- [ ] **Cloud Sync**: Çoklu cihaz senkronizasyonu
- [ ] **Advanced Analytics**: Detaylı analizler
- [ ] **Social Features**: Portfolio paylaşımı

10. Teknik Notlar

### 10.1 Fiyat Sistemi (Mevcut)
```javascript
Sabit Fiyatlar (TL):
├── 22 Ayar: 2300 TL/gram
├── 24 Ayar: 2500 TL/gram
├── Çeyrek: 4000 TL/adet
├── Tam: 16000 TL/adet
├── USD: 34 TL
├── EUR: 36 TL
└── Gümüş: 30 TL/gram
```

### 10.2 Hesaplama Mantığı
- **Altın Karşılık**: Gram bazında karşılık hesaplama
- **Para Birimi Çevirimi**: TL üzerinden çapraz kur hesaplama
- **Otomatik Gruplandırma**: Aynı tür varlıkların otomatik toplanması