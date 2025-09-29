📄 PRD — Minimal Portföy Takip Uygulaması
1. Amaç

Kullanıcının sahip olduğu varlıkları (altın, döviz, gümüş vb.) hızlı ve sezgisel bir şekilde ekleyip çıkarmasını sağlamak. Toplam portföy değeri farklı para birimleri ve altın cinsinden görüntülenebilmeli.

Odak: Modern ve minimalist bir ekonomi uygulaması izlenimi. Mobil öncelikli tasarım.

2. Hedefler

Basit ve hızlı kullanım (2 ana sayfa: Ana Sayfa + Varlık Ekle).

Varlık ekleme, silme ve toplam değer hesaplama.

TL / USD / EUR / ALTIN karşılıklarını sekmelerle gösterme.

Şimdilik sabit fiyatlar kullanılacak, ileride API ile güncellenebilir.

Modern ve minimalist UI/UX, ekonomi uygulaması teması.

3. Desteklenen Varlıklar
Tür	Alt Türler
Altın	22 Ayar Gram, 24 Ayar Gram, Çeyrek Altın, Tam Altın
Döviz	USD, EUR
Diğer	Gümüş
4. Kullanıcı İşlemleri

Yeni varlık ekleme (miktar belirtme).

Varlık silme.

Toplam portföy değerini TL, USD, EUR ve ALTIN bazında görüntüleme.

5. Sayfa Akışı
5.1 Ana Sayfa

Başlık: “Toplam Portföy Değeri”

Sekmeler: TL / USD / EUR / ALTIN

Toplam değer: seçili sekmeye göre hesaplanmış

Varlık listesi: tip, miktar, değer

Silme butonu

FAB butonu: Varlık Ekle sayfasına yönlendirir

5.2 Varlık Ekle Sayfası

Dropdown: varlık türü

Input: miktar

Kaydet butonu: ana sayfaya yönlendirme

6. Teknik Gereksinimler

Framework: Vue 3

Router: Vue Router

State management: Vuex (İleriye dönük store yapısı hazır)

HTTP Client: Axios (ileride API bağlanacak)

PWA: Vite PWA plugin

Styling: SCSS, minimal ve modern

Responsive: Mobil öncelikli

Fiyatlar: Sabit, ileride API ile güncellenebilir

7. UI/UX Gereksinimleri

Modern ekonomi uygulaması görünümü

Minimalist, temiz kart ve tab tasarımları

Mobilde rahat kullanım (fab, listeler, inputlar)

Renkler ve tipografi minimalist ve tutarlı

SCSS ile değişkenler üzerinden kolay tema ve renk yönetimi

8. Geliştirme Öncelikleri

Skeleton hazır: Vue 3 + Router + Vuex + Axios + PWA plugin

Ana sayfa ve ekleme sayfası component’leri mevcut

SCSS minimal tasarım uygulanmış

Agent görevi:

Modern, mobil öncelikli ve minimalist UI tasarımını geliştirmek

Kullanıcı deneyimini artırmak (card spacing, font, renk, buton boyutu, fab konumu)

Responsive detayları optimize etmek

9. Gelecek Geliştirmeler (Agent ekleyecek)

Gerçek zamanlı fiyat API entegrasyonu

Varlık düzenleme (edit)

Grafik ve chart entegrasyonu

Kullanıcı hesap/oturum sistemi