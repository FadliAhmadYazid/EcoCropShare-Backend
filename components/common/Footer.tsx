import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-2xl">🌿</span>
              <span className="ml-2 font-semibold text-lg">EcoCropShare</span>
            </Link>
            <div className="mt-2">
              <p className="text-gray-300 text-sm">
                Platform inovatif untuk berbagi bibit dan hasil panen antar komunitas petani urban.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Pintasan</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm">Dashboard</Link>
              </li>
              <li>
                <Link href="/posts" className="text-gray-300 hover:text-white text-sm">Bibit & Hasil Panen</Link>
              </li>
              <li>
                <Link href="/requests" className="text-gray-300 hover:text-white text-sm">Permintaan</Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-300 hover:text-white text-sm">Artikel Edukasi</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Sumber Daya</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/posts/create" className="text-gray-300 hover:text-white text-sm">Tambah Post Baru</Link>
              </li>
              <li>
                <Link href="/requests/create" className="text-gray-300 hover:text-white text-sm">Buat Permintaan</Link>
              </li>
              <li>
                <Link href="/articles/create" className="text-gray-300 hover:text-white text-sm">Tulis Artikel</Link>
              </li>
              <li>
                <Link href="/history" className="text-gray-300 hover:text-white text-sm">Riwayat Tukar</Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Komunitas</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-gray-300 hover:text-white text-sm">Profil Saya</Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">Kebijakan Privasi</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">Syarat & Ketentuan</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm">Hubungi Kami</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <h3 className="text-lg font-medium mb-4">Ikuti Kami</h3>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white">GitHub</a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} EcoCropShare. Platform berbagi bibit dan hasil panen.</p>
          <p className="text-gray-400 text-sm mt-2">Dibuat untuk memudahkan berbagi tanaman antar komunitas petani urban.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;