/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // KUNCI UTAMA: Memberitahu Next.js untuk generate HTML statis
  
  // Opsional: Jika repository kamu bukan root (misal: username.github.io/nama-repo)
  // basePath: '/nama-repo', 
  
  images: {
    unoptimized: true, // Wajib: GitHub Pages tidak punya server untuk optimasi gambar Next.js
  },
}

module.exports = nextConfig
