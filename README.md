# 📦 Koli Kalite Takip Uygulaması  
**(React.js + Material UI)**

> **This README includes both Turkish and English sections. English version is available below.**  
> Bu proje, staj sürecinde kullanılan aktif bir sistem örnek alınarak tarafımdan sıfırdan geliştirilmiştir.  
> Arayüz yapısı örnek alınan sisteme benzese de, kodların tamamı tarafımdan yazılmıştır.

Koli App, bir tekstil fabrikasındaki koli içeriklerinin dijital ortamda takip edilmesini sağlayan bir web uygulamasıdır. Uygulama; ürün okutma, silme, ekleme ve raporlama işlevlerini içermektedir. Kullanıcı arayüzü React.js ile geliştirilmiş, veri iletişimi Swagger API üzerinden sağlanmıştır.

---

## 🧱 Proje Mimarisi

- 🔧 `pages/` klasöründe 4 ana modül:
  - Koli İçerik Okutma
  - Koli İçerik Silme
  - Koli İçerik Ekleme
  - Raporlama
- 🎨 `components/` klasöründe ortak arayüz öğeleri (ör: Sidebar)
- 🌐 `apiConfig.js` üzerinden Swagger tabanlı API bağlantısı
- 🎛️ Material UI ile DataGrid, Snackbar ve AppBar gibi bileşenler entegre edildi
- 📱 Responsive tasarım ve mobil uyumluluk sağlandı

---

## ⚙️ Temel Özellikler

### ✅ Koli İçerik Okutma
- Koli numarası girildiğinde barkod alanına otomatik geçiş
- Barkod okutulunca SKU bilgisi çekilir
- Aynı ürün varsa adet artırılır, yoksa tabloya eklenir
- Snackbar ile hata ve bilgi mesajları

### 🧹 Koli İçerik Silme
- Mevcut koli içeriği tabloyla görüntülenir
- Barkod okutularak ürün içerikten çıkarılır
- Silme işlemi sonrası tablo anlık güncellenir

### ➕ Koli İçerik Ekleme
- Mevcut koliye barkodla yeni ürün eklenir
- Daha önce varsa adet artırılır
- API’de bulunmayan ürünlerde uyarı gösterilir

### 📊 Raporlama
- Tüm koliler tablo halinde listelenir
- Başlangıç ve bitiş tarihi girilerek filtreleme yapılabilir
- API'den büyük veri çekimi ve gösterimi sağlanır

---

## 🧪 Test & Mobil Uyumluluk

- Grid/Box yapıları ile responsive yapı geliştirildi
- Küçük ekranlarda tablo ve form görünümü optimize edildi
- Tüm sayfalarda CRUD işlemleri test edildi
- Snackbar ile kullanıcı bilgilendirme doğrulandı

---

## 🚀 Kullanılan Teknolojiler

- React.js (CRA)
- Material UI (MUI v5)
- Axios
- React Hooks (useState, useEffect, useRef)
- .NET tabanlı REST API (Swagger)

---

> ℹ️ Proje sırasında geliştirilen sayfalara ait ekran görüntüleri `screenshots/` klasöründe yer almaktadır.

# 🇬🇧 Koli Quality Tracking App  
**(React.js + Material UI)**

> This project was built from scratch by myself, based on a system that was actively used in the company during my internship.  
> While the UI structure was inspired by the existing tool, the entire codebase was written independently.

This is a React-based web application developed to manage and track the contents of product boxes in a textile factory. It includes 4 main modules: Scan, Delete, Add, and Report. API integration was done using Swagger endpoints.

---

## 🔧 Architecture

- `pages/` folder contains the main modules:
  - Box Content Scanning
  - Box Content Deletion
  - Box Content Addition
  - Reporting
- `components/` folder holds reusable UI elements (e.g., Sidebar)
- API communication handled via `apiConfig.js` and Axios
- Responsive layout designed with Material UI's Grid and Box
- Snackbar provides user feedback on every action

---

## ✅ Features

### 📥 Box Scanning
- Enter box number, focus moves to barcode input automatically
- Scans barcode and fetches SKU from API
- If SKU exists, quantity is increased; if not, added to table
- Realtime feedback via Snackbar

### 🧹 Box Deletion
- Displays current contents of the box in a DataGrid
- Barcode input removes the product from the box
- Table updates instantly after deletion

### ➕ Box Addition
- Allows adding new barcodes into an existing box
- Increments quantity if already present
- Handles missing SKUs with error notification

### 📊 Reporting
- Lists all recorded box contents in a table
- Allows filtering by start/end date
- Data fetched from backend and shown via MUI DataGrid

---

## 🧪 Testing & Responsiveness

- Responsive layout with Grid and Box
- Forms and tables adapted for smaller screens
- All CRUD operations tested across pages
- Error cases and API response handling validated

---

> ℹ️ Screenshots of the developed interface pages are available in the `screenshots/` folder.

## 🏁 Run the Project

```bash
npm install
npm start
```
> ℹ️ To run the project locally, use the commands above.
