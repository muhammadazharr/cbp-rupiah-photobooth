snapbooth-frontend/
├── public/
│   ├── templates/          # Aset statis overlay (Koran, Struk, dll)
│   └── sounds/             # Efek suara shutter kamera
├── src/
│   ├── app/
│   │   ├── api/            # Next.js API Routes (Proxy ke Backend)
│   │   ├── capture/        # Halaman hitung mundur & foto
│   │   ├── edit/           # Halaman pemilihan template & filter
│   │   ├── result/         # Halaman QR Code & Print
│   │   ├── layout.tsx
│   │   └── page.tsx        # Landing Page
│   ├── components/
│   │   ├── ui/             # Reusable UI (Buttons, Modals)
│   │   ├── camera/         # Komponen Video Stream & Canvas
│   │   └── templates/      # Komponen layout foto (Struk, Koran)
│   ├── store/
│   │   └── useBoothStore.ts # Zustand state (photos[], template, filter)
│   ├── hooks/
│   │   └── useCamera.ts    # Custom hook untuk getUserMedia
│   └── utils/
│       └── renderImage.ts  # Logika pembantu html2canvas
├── tailwind.config.js
└── tsconfig.json