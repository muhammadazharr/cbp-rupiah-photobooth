# 🎨 SnapBooth - UI/UX & Design System

Dokumen ini memuat panduan visual dan arsitektur desain antarmuka untuk SnapBooth Frontend.

## 🌟 Design Philosophy
- **Clean & Modern:** Antarmuka aplikasi harus transparan dan tidak mengganggu proses foto. Penggunaan ruang kosong (white space) yang berlimpah.
- **Kiosk-Optimized:** Elemen tombol harus besar, tebal, dan mudah ditekan pada layar sentuh (tablet/layar monitor interaktif).
- **Aesthetic Contrast:** UI aplikasi menggunakan gaya *minimalist soft*, sementara template hasil cetak (photo strip) menggunakan gaya *brutalist*, *vintage bootleg*, atau konseptual (koran, struk belanja) untuk memberikan elemen kejutan dan estetika *streetwear* yang kuat.

## 🎨 Color Palette (UI Application)
- **Background:** Soft Pink (`#FADBE6`) ke White gradient.
- **Primary Accent:** Bubblegum Pink (`#F472B6`) untuk tombol utama.
- **Secondary/Surface:** Putih transparan (`rgba(255, 255, 255, 0.8)`) dengan efek *glassmorphism*.
- **Text:** Dark Gray/Black (`#1A1A1A`) untuk keterbacaan optimal.

## 🔤 Typography
- **UI Application:** `Inter` atau `Plus Jakarta Sans` (Sans-serif, modern, bulat, mudah dibaca).
- **Template The Daily Paper:** `Playfair Display` atau `Times New Roman` (Serif elegan untuk kesan editorial).
- **Template Nutrition Facts:** `Space Mono` atau `Helvetica` tebal (Memberikan kesan industrial dan presisi).
- **Template Y2K/Bootleg:** `Impact` atau custom brutalist font untuk elemen grafis yang lebih berani.

## 📐 Template Grid System
1. **Classic 4-Strip:** 4 foto vertikal, rasio foto 3:2, border putih 8px.
2. **Polaroid Grid:** 2x2 grid foto, rasio foto 1:1 (square), caption area di bagian bawah.
3. **Editorial Layout (Koran):** 2 kolom foto tidak beraturan dengan sisipan teks "BREAKING NEWS" dan ornamen garis tabel.

## 🧩 Komponen Utama (Figma / UI Reference)
1. **`HeroScreen`**: Landing page statis dengan tombol Call to Action berdenyut (pulsing).
2. **`BoothView`**: Jendela bidik kamera layar penuh dengan overlay panduan wajah dan timer melingkar.
3. **`CustomizerPanel`**: Sidebar melayang (floating) untuk memindahkan foto, menukar urutan, dan menerapkan filter CSS (Grayscale, Sepia, High Contrast).
4. **`ActionModal`**: Dialog box yang muncul setelah selesai, menampilkan QR code dinamis dan input nomor telepon (untuk integrasi WhatsApp).