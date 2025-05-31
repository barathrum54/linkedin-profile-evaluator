"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";

interface PlanDetails {
  name: string;
  price: number;
  features: string[];
  color: string;
}

const plans: Record<string, PlanDetails> = {
  basic: {
    name: "Temel Plan",
    price: 5,
    features: [
      "Detaylı profil analiz raporu",
      "12 kritik alan için özel öneriler",
      "Profil başlığı şablonları (5 adet)",
      "Hakkında bölümü rehberi",
      "PDF formatında rapor",
      "E-posta desteği",
    ],
    color: "purple",
  },
  premium: {
    name: "Premium Plan",
    price: 20,
    features: [
      "Temel plandaki tüm özellikler",
      "1-1 video konsültasyon (30 dk)",
      "Kişiselleştirilmiş içerik stratejisi",
      "LinkedIn banner tasarım şablonları (10 adet)",
      "Networking stratejileri rehberi",
      "30 günlük takip ve destek",
      "Özel WhatsApp destek grubu",
      "Aylık güncellemeler ve yeni özellikler",
    ],
    color: "pink",
  },
};

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    billingAddress: "",
    city: "",
    postalCode: "",
    country: "TR",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan && plans[plan]) {
      setSelectedPlan(plan);
    } else {
      router.push("/pricing");
    }
  }, [searchParams, router]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) errors.email = "E-posta adresi gerekli";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Geçerli bir e-posta adresi girin";

    if (!formData.firstName) errors.firstName = "Ad gerekli";
    if (!formData.lastName) errors.lastName = "Soyad gerekli";
    if (!formData.cardNumber) errors.cardNumber = "Kart numarası gerekli";
    else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
      errors.cardNumber = "Geçerli bir kart numarası girin";

    if (!formData.expiryDate) errors.expiryDate = "Son kullanma tarihi gerekli";
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate))
      errors.expiryDate = "MM/YY formatında girin";

    if (!formData.cvv) errors.cvv = "CVV gerekli";
    else if (!/^\d{3,4}$/.test(formData.cvv))
      errors.cvv = "Geçerli bir CVV girin";

    if (!formData.nameOnCard) errors.nameOnCard = "Kart üzerindeki ad gerekli";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    }
    // Format expiry date
    else if (name === "expiryDate") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2");
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Here you would integrate with Stripe
      // Example Stripe integration points:

      // 1. Create payment intent
      // const paymentIntent = await stripe.createPaymentIntent({
      //   amount: plans[selectedPlan].price * 100, // Stripe uses cents
      //   currency: 'usd',
      //   customer_email: formData.email
      // });

      // 2. Confirm payment
      // const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
      //   payment_method: {
      //     card: elements.getElement(CardElement),
      //     billing_details: {
      //       name: formData.nameOnCard,
      //       email: formData.email,
      //       address: {
      //         line1: formData.billingAddress,
      //         city: formData.city,
      //         postal_code: formData.postalCode,
      //         country: formData.country
      //       }
      //     }
      //   }
      // });

      // For now, simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      router.push(`/payment/success?plan=${selectedPlan}`);
    } catch (error) {
      console.error("Payment failed:", error);
      // Handle payment failure
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPlan || !plans[selectedPlan]) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const plan = plans[selectedPlan];

  return (
    <Layout
      className="bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      navbarProps={{
        title: "Güvenli Ödeme",
        subtitle: "SSL şifreli güvenli ödeme sayfası",
        showBackButton: true,
        showRestartButton: false,
        backRoute: "/pricing",
        maxWidth: "4xl",
      }}
      contentClassName="overflow-auto"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="lg:order-2">
              <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Sipariş Özeti
                </h2>

                {/* Plan Details */}
                <div
                  className={`border-2 rounded-2xl p-6 mb-6 ${
                    plan.color === "purple"
                      ? "border-purple-200 bg-purple-50"
                      : "border-pink-200 bg-pink-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <div className="text-right">
                      <span
                        className={`text-3xl font-bold ${
                          plan.color === "purple"
                            ? "text-purple-600"
                            : "text-pink-600"
                        }`}
                      >
                        ${plan.price}
                      </span>
                      <p className="text-sm text-gray-500">/tek seferlik</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
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
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 4 && (
                      <p className="text-sm text-gray-500 italic">
                        +{plan.features.length - 4} adet daha...
                      </p>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Ara toplam</span>
                    <span>${plan.price}.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>KDV (%18)</span>
                    <span>${(plan.price * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-3">
                    <span>Toplam</span>
                    <span>${(plan.price * 1.18).toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span>256-bit SSL</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-green-500"
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
                      <span>PCI Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:order-1">
              <form
                onSubmit={handleSubmit}
                className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6 space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Ödeme Bilgileri
                </h2>

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Kişisel Bilgiler
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          formErrors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Adınız"
                      />
                      {formErrors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Soyad
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          formErrors.lastName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Soyadınız"
                      />
                      {formErrors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="ornek@email.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Ödeme Bilgileri
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kart Numarası
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        maxLength={19}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          formErrors.cardNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {formErrors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Son Kullanma Tarihi
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          maxLength={5}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            formErrors.expiryDate
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="MM/YY"
                        />
                        {formErrors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.expiryDate}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          maxLength={4}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            formErrors.cvv
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="123"
                        />
                        {formErrors.cvv && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.cvv}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kart Üzerindeki Ad
                      </label>
                      <input
                        type="text"
                        name="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          formErrors.nameOnCard
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="JOHN DOE"
                        style={{ textTransform: "uppercase" }}
                      />
                      {formErrors.nameOnCard && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.nameOnCard}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl"
                    } text-white`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>İşleniyor...</span>
                      </div>
                    ) : (
                      `$${(plan.price * 1.18).toFixed(2)} Öde`
                    )}
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      Ödeme yaparak{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Kullanım Şartları
                      </a>{" "}
                      ve{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Gizlilik Politikası
                      </a>
                      &apos;nı kabul etmiş olursunuz.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
