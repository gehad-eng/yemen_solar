import './globals.css'
import { Inter } from 'next/font/google'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar' // 1. استيراد النافبار

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Solar Hub Yemen | دليلك للطاقة الشمسية',
  description: 'منصة الطاقة الشمسية الأولى في اليمن',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} flex flex-col min-h-screen bg-slate-50`}>
        
        {/* 2. إضافة النافبار هنا */}
        <Navbar />

        <div className="flex-grow">
          {children}
        </div>
        
        <Footer />
      </body>
    </html>
  )
}