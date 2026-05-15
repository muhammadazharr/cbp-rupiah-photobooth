# 📸 SnapBooth – Web Frontend

> Antarmuka berbasis web untuk sistem photobooth interaktif. Dibangun dengan Next.js, difokuskan untuk performa tinggi pada perangkat layar sentuh (Tablet/Desktop Kiosk).

---

## 🏗️ System Architecture

Arsitektur sistem berjalan sepenuhnya di peramban pengguna dengan Next.js sebagai pengelola rute API dan integrasi pihak ketiga.

```text
User Device (Desktop/Tablet Kiosk)
    ↓
├─ Camera Input (getUserMedia API)
├─ Preview Canvas (Live stream kamera)
├─ Template Selection & Filter (Zustand state)
└─ Final Image Render (html2canvas)
    ↓
Next.js Server (BFF - Backend for Frontend)
    ├─ Upload & Store Photo (Terhubung ke Node.js Backend / S3)
    └─ API endpoints (Proxy routes):
        ├─ /api/upload (Teruskan foto ke penyimpanan)
        ├─ /api/send-whatsapp (Integrasi Twilio / Fonnte)
        └─ /api/print (Kirim instruksi ke PrintNode / node-ipp)