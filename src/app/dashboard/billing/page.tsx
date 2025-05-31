"use client";

import DashboardLayout from "@/components/DashboardLayout";

const billingData = {
  currentPlan: {
    name: "Premium Plan",
    price: 29.99,
    currency: "USD",
    period: "monthly",
    features: [
      "Unlimited profile analysis",
      "AI-powered optimization",
      "Priority support",
      "Advanced reporting",
      "Content strategy tools",
    ],
    nextBilling: "2024-02-15",
  },
  invoices: [
    { id: "INV-001", date: "2024-01-15", amount: 29.99, status: "paid" },
    { id: "INV-002", date: "2023-12-15", amount: 29.99, status: "paid" },
    { id: "INV-003", date: "2023-11-15", amount: 29.99, status: "paid" },
  ],
  paymentMethod: {
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiry: "12/26",
  },
};

export default function BillingPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout title="Billing">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Faturalama & Abonelik</h1>
              <p className="text-green-100 text-lg">
                Abonelik planınızı yönetin ve fatura geçmişinizi görüntüleyin
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Plan */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mevcut Plan</h2>
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                Aktif
              </span>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {billingData.currentPlan.name}
                </h3>
                <div className="text-right">
                  <span className="text-3xl font-bold text-green-600">
                    ${billingData.currentPlan.price}
                  </span>
                  <span className="text-gray-600">
                    /{billingData.currentPlan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {billingData.currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
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
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between text-sm text-gray-600 border-t border-green-200 pt-4">
                <span>Next billing date:</span>
                <span className="font-medium">
                  {billingData.currentPlan.nextBilling}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-colors">
                Planı Değiştir
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Aboneliği İptal Et
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Ödeme Yöntemi
              </h2>

              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm opacity-80">Kart Numarası</span>
                  <span className="text-lg font-bold">
                    {billingData.paymentMethod.brand}
                  </span>
                </div>
                <div className="text-xl font-mono tracking-wider mb-3">
                  •••• •••• •••• {billingData.paymentMethod.last4}
                </div>
                <div className="flex justify-between text-sm">
                  <span>Geçerlilik</span>
                  <span>{billingData.paymentMethod.expiry}</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-medium hover:from-gray-600 hover:to-gray-700 transition-colors">
                Ödeme Yöntemini Güncelle
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Özet</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bu ay</span>
                  <span className="font-bold text-gray-900">$29.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam</span>
                  <span className="font-bold text-gray-900">$89.97</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Üyelik süresi</span>
                  <span className="font-bold text-gray-900">3 ay</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice History */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Fatura Geçmişi</h2>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-colors">
              Tüm Faturaları İndir
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Fatura No
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Tarih
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Tutar
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Durum
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingData.invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{invoice.date}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      ${invoice.amount}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status === "paid"
                          ? "Ödendi"
                          : invoice.status === "pending"
                          ? "Bekliyor"
                          : "Başarısız"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                          İndir
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                          Görüntüle
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
