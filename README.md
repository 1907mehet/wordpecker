# 📚 Dil Öğrenme Uygulaması

Bu proje, kullanıcıların kendi oluşturdukları kelime listeleriyle dil öğrenmesini sağlayan bir uygulamadır. Kullanıcılar diledikleri kelimeleri listelere ekleyerek bu kelimeler üzerinde alıştırmalar yapabilir ve gelişim süreçlerini takip edebilirler.

## 🚀 Amaç

Kendi sözlük listeni oluştur, öğren, test et!  
Uygulama; kişiselleştirilmiş bir dil öğrenme deneyimi sunarak, kullanıcıların daha hızlı ve kalıcı öğrenme sağlamasını hedefler.

---

## 🔑 Temel Özellikler

- 🔐 **Kullanıcı Girişi / Kayıt**  
  (Basit authentication sistemi — ileride eklenebilir)
  
- 📋 **Kelime Listesi Oluşturma**  
  Kendi kelime listelerini oluşturabilir, düzenleyebilir, silebilirsin.

- ➕ **Listeye Kelime Ekleme**  
  Her listeye yeni kelimeler ve anlamları eklenebilir.

- 🧠 **Öğrenme Modu**  
  Flashcard mantığıyla kelimeleri ezberlemeye yardımcı olur.

- ❓ **Quiz/Test Modu**  
  Öğrenilen kelimelerle quiz yaparak bilgiyi pekiştir.

- 📊 **İlerleme Takibi**  
  Hangi kelimeler öğrenildi, hangileri zayıf — takip et!

- ⚙️ **Ayarlar Sayfası**  
  (Tema, dil, kullanıcı tercihleri vs. – planlanabilir)

---

## 📁 Proje Yapısı

Aşağıdaki yapı, uygulamanın klasör ve dosya düzenini gösterir:

dil-ogrenme-uygulamasi/
├── app/             # Uygulamanın ana sayfa/screen dosyaları
├── assets/          # Görsel ve medya dosyaları
├── components/      # Ortak kullanılan UI bileşenleri
├── constants/       # Sabitler, temalar, renkler
├── store/           # State management dosyaları
├── types/           # TypeScript tür tanımları
├── .gitignore       # Git tarafından yok sayılacak dosyalar
├── app.json         # Proje ayar dosyası
├── bun.lock         # Bağımlılık kilit dosyası (bun için)
├── package.json     # Bağımlılıklar ve script tanımları
├── tsconfig.json    # TypeScript konfigürasyonu
└── vercel.json      # Vercel deploy ayarları
