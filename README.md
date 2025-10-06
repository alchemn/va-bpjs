This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Konfigurasi Live2D

Untuk menggunakan fitur Live2D Avatar, Anda perlu:

1. Dapatkan `live2dcubismcore.js` dari Live2D Cubism SDK (versi 4)
2. Gantilah file placeholder di `public/js/live2dcubismcore.js` dengan file resmi dari Live2D
3. Pastikan Anda memiliki lisensi yang sah untuk menggunakan Cubism 4 runtime

File `live2dcubismcore.js` adalah runtime yang diperlukan oleh `pixi-live2d-display/cubism4` untuk menampilkan model Live2D Cubism 4 (.model3.json). Tanpa file ini, fitur avatar tidak akan berfungsi.

### Penting:
- File `live2dcubismcore.js` adalah proprietary library dari Live2D
- Anda harus mendapatkannya dari Cubism SDK yang tersedia di situs Live2D resmi
- Hanya model Live2D yang dibuat dengan Cubism 4 (menggunakan file .model3.json) yang akan bekerja dengan konfigurasi ini
- Pastikan Anda mematuhi lisensi dan ketentuan penggunaan dari Live2D
