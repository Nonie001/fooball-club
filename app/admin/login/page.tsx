'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Globe, X } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentIP, setCurrentIP] = useState('');
  const [trustedIPs, setTrustedIPs] = useState<any[]>([]);

  const removeTrustedIP = (ipToRemove: string) => {
    const updatedTrustedIPs = trustedIPs.filter((ip: any) => ip.address !== ipToRemove);
    localStorage.setItem('trustedAdminIPs', JSON.stringify(updatedTrustedIPs));
    setTrustedIPs(updatedTrustedIPs);
  };

  useEffect(() => {
    const loadIPData = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setCurrentIP(data.ip);
        
        // โหลด trusted IPs
        const trusted = JSON.parse(localStorage.getItem('trustedAdminIPs') || '[]');
        setTrustedIPs(trusted);
        
        // ตรวจสอบ auto-login
        const ipData = trusted.find((ip: any) => ip.address === data.ip);
        if (ipData && Date.now() < ipData.expiry) {
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminSession', JSON.stringify({
            ip: data.ip,
            loginTime: Date.now(),
            trusted: true
          }));
          router.push('/admin/dashboard');
        }
      } catch (error) {
        console.log('ไม่สามารถดึง IP ได้:', error);
      }
    };

    loadIPData();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // ตรวจสอบ IP address
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      const userIP = data.ip;

      // ตรวจสอบว่า IP นี้เคย login แล้วหรือไม่
      const trustedIPs = JSON.parse(localStorage.getItem('trustedAdminIPs') || '[]');
      const ipData = trustedIPs.find((ip: any) => ip.address === userIP);
      
      if (ipData && Date.now() < ipData.expiry) {
        // IP นี้ยังไว้ใจได้ ให้เข้าได้เลย
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminSession', JSON.stringify({
          ip: userIP,
          loginTime: Date.now(),
          trusted: true
        }));
        router.push('/admin/dashboard');
        setIsLoading(false);
        return;
      }

      // ตรวจสอบ username/password
      if (username === 'admin' && password === 'admin123') {
        // Success - บันทึก IP เป็น trusted (7 วัน)
        const newTrustedIP = {
          address: userIP,
          expiry: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 วัน
          firstLogin: Date.now()
        };
        
        const updatedTrustedIPs = trustedIPs.filter((ip: any) => ip.address !== userIP);
        updatedTrustedIPs.push(newTrustedIP);
        
        localStorage.setItem('trustedAdminIPs', JSON.stringify(updatedTrustedIPs));
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminSession', JSON.stringify({
          ip: userIP,
          loginTime: Date.now(),
          trusted: true
        }));
        
        router.push('/admin/dashboard');
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      console.error('Error getting IP:', error);
      // Fallback ถ้าไม่สามารถดึง IP ได้
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isAdmin', 'true');
        router.push('/admin/dashboard');
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">กลับหน้าแรก</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full mb-4">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              เข้าสู่ระบบ Admin
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              จัดการข้อมูล Brotherhood FC
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                ชื่อผู้ใช้
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="กรอกชื่อผู้ใช้"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                รหัสผ่าน
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="กรอกรหัสผ่าน"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                'เข้าสู่ระบบ'
              )}
            </button>
          </form>

          {/* IP Information */}
          <div className="mt-6 space-y-4">
            {currentIP && (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  <Globe className="w-4 h-4" />
                  <span>IP ปัจจุบัน</span>
                </div>
                <div className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">
                  {currentIP}
                </div>
              </div>
            )}

            {trustedIPs.length > 0 && (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  <Lock className="w-4 h-4" />
                  <span>IP ที่จดจำ ({trustedIPs.length})</span>
                </div>
                <div className="space-y-2">
                  {trustedIPs.slice(0, 3).map((ip: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm group">
                      <span className="font-mono text-zinc-700 dark:text-zinc-300">{ip.address}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {new Date(ip.expiry).toLocaleDateString('th-TH')}
                        </span>
                        <button
                          onClick={() => removeTrustedIP(ip.address)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all text-xs p-1"
                          title="ลบ IP นี้"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {trustedIPs.length > 3 && (
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center pt-1">
                      และอีก {trustedIPs.length - 3} IP
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
              Demo: username: <span className="font-mono font-semibold">admin</span> / password: <span className="font-mono font-semibold">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}  