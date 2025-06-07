'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  processPendingTestData,
  showProcessingState,
  getPendingTestData,
} from '@/utils/testDataProcessor';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isProcessingTestData, setIsProcessingTestData] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Ad Soyad gereklidir.');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email adresi gereklidir.');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return false;
    }
    return true;
  };

  const handlePostAuthFlow = async () => {
    // Check if there's pending test data
    const hasPendingData = getPendingTestData() !== null;

    if (hasPendingData) {
      setIsProcessingTestData(true);
      showProcessingState(true);

      // Give the session a moment to establish
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Process the pending test data
      const success = await processPendingTestData();

      showProcessingState(false);
      setIsProcessingTestData(false);

      if (success) {
        console.log(
          'Test data processed successfully, redirecting to dashboard'
        );
      } else {
        console.log('No test data or processing failed, redirecting anyway');
      }
    }

    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Hesap oluşturulurken bir hata oluştu.');
        return;
      }

      setSuccess(true);

      // Auto sign in after successful registration
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        // Handle post-auth flow including test data processing
        await handlePostAuthFlow();
      } else {
        router.push(
          '/auth/signin?message=Hesabınız oluşturuldu, lütfen giriş yapın.'
        );
      }
    } catch {
      setError('Hesap oluşturulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: string) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (result?.ok) {
        // Handle post-auth flow including test data processing
        await handlePostAuthFlow();
      } else if (result?.url) {
        // OAuth might redirect directly, handle that case
        window.location.href = result.url;
      }
    } catch {
      setError('OAuth hesap oluşturulurken bir hata oluştu.');
      setIsLoading(false);
    }
  };

  if (success || isProcessingTestData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {isProcessingTestData ? (
                <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isProcessingTestData
                ? 'Test Sonuçlarınız Kaydediliyor'
                : 'Hesabınız Oluşturuldu!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isProcessingTestData
                ? 'Test sonuçlarınız veritabanına kaydediliyor, lütfen bekleyin...'
                : "Giriş yapılıyor ve dashboard'a yönlendiriliyorsunuz..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hesap Oluşturun
          </h1>
          <p className="text-gray-600">
            LinkedIn profil analizinizi başlatmak için hesap oluşturun
          </p>
        </div>

        {/* OAuth Providers */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="space-y-4 mb-6">
            <button
              onClick={() => handleOAuthSignUp('linkedin')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#0077B5] hover:bg-[#005885] text-white py-3 px-4 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn ile Hesap Oluştur
            </button>

            <button
              onClick={() => handleOAuthSignUp('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl font-semibold border border-gray-300 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google ile Hesap Oluştur
            </button>

            <button
              onClick={() => handleOAuthSignUp('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub ile Hesap Oluştur
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                veya email ile
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ad Soyad
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Adınız Soyadınız"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="En az 8 karakter"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Şifrenizi tekrar girin"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Hesap oluşturarak{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700">
              Kullanım Şartları
            </Link>{' '}
            ve{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
              Gizlilik Politikası
            </Link>
            &apos;nı kabul etmiş olursunuz.
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Giriş Yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
