"use client"
import { useState } from "react"
import { DollarSign } from "lucide-react"

export default function TopUpPage() {
  const [selectedPayment, setSelectedPayment] = useState<string | null>("visa")
  const [selectedAmount, setSelectedAmount] = useState<string | null>("10")
  const [customAmount, setCustomAmount] = useState<string>("")

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Top up your balance</h1>

        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
          {/* Step 1: Payment Method */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">1. Choose a payment method</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {/* Payment Method Cards - Row 1 */}
              <button
                className={`border rounded-xl p-3 h-[70px] flex items-center justify-center transition-all ${selectedPayment === "visa" ? "border-blue-500 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => setSelectedPayment("visa")}
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-6 relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-8 h-5 bg-[#1434CB] rounded-sm mr-1"></div>
                        <div className="w-8 h-5 bg-[#FF5F00] rounded-sm ml-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              <button
                className={`border rounded-xl p-3 h-[70px] flex items-center justify-center transition-all ${selectedPayment === "wechat" ? "border-blue-500 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => setSelectedPayment("wechat")}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-[#07C160] rounded-full mr-1"></div>
                  <span className="text-[#07C160] font-medium">WeChat</span>
                </div>
              </button>

              <button
                className={`border rounded-xl p-3 h-[70px] flex items-center justify-center transition-all ${selectedPayment === "alipay" ? "border-blue-500 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => setSelectedPayment("alipay")}
              >
                <div className="flex items-center">
                  <span className="text-[#00A0E9] font-bold text-lg">Alipay</span>
                </div>
              </button>

              <button
                className={`border rounded-xl p-3 h-[70px] flex items-center justify-center transition-all ${selectedPayment === "crypto" ? "border-blue-500 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => setSelectedPayment("crypto")}
              >
                <div className="flex items-center space-x-1">
                  <div className="w-5 h-5 bg-[#F7931A] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ₿
                  </div>
                  <div className="w-5 h-5 bg-[#627EEA] rounded-full"></div>
                  <div className="w-5 h-5 bg-[#BFBBBB] rounded-full"></div>
                  <div className="w-5 h-5 bg-[#26A17B] rounded-full"></div>
                </div>
              </button>

              <button
                className={`border rounded-xl p-3 h-[70px] flex items-center justify-center transition-all ${selectedPayment === "usdt" ? "border-blue-500 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => setSelectedPayment("usdt")}
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#26A17B] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">$</span>
                  </div>
                  <div className="text-xs mt-1">
                    <span className="font-bold">USDT</span>
                    <span className="text-[10px] block text-center">TRC20</span>
                  </div>
                </div>
              </button>

              <button
                className={`border rounded-xl p-3 h-[70px] flex items-center justify-center transition-all ${selectedPayment === "ton" ? "border-blue-500 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => setSelectedPayment("ton")}
              >
                <div className="flex flex-col items-center">
                  <div className="text-[#0088CC] font-bold">TON</div>
                  <div className="w-8 h-8 bg-[#0088CC] rounded-full flex items-center justify-center">
                    <span className="text-white">◊</span>
                  </div>
                </div>
              </button>

              {/* Payment Method Cards - Row 2 */}
              <button
                className={`border rounded-xl p-3 h-[70px] flex items-center justify-center transition-all ${selectedPayment === "payeer" ? "border-blue-500 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => setSelectedPayment("payeer")}
              >
                <div className="flex items-center">
                  <span className="font-bold text-black">
                    PAY<span className="text-[#00AEEF]">EER</span>
                  </span>
                  <span className="text-xs align-top">®</span>
                </div>
              </button>

              <button
                className={`border rounded-xl p-3 h-[70px] flex items-center justify-center transition-all ${selectedPayment === "paytm" ? "border-blue-500 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => setSelectedPayment("paytm")}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 bg-[#5F259F] rounded-full"></div>
                    <div className="w-5 h-5 bg-[#6739B6] rounded-full"></div>
                    <div className="w-5 h-5 bg-[#4285F4] rounded-full"></div>
                  </div>
                  <div className="text-xs">UPI</div>
                </div>
              </button>

              <button
                className={`border rounded-xl p-3 h-[70px] flex items-center justify-center transition-all ${selectedPayment === "promptpay" ? "border-blue-500 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => setSelectedPayment("promptpay")}
              >
                <div className="flex items-center">
                  <div className="bg-[#1A458B] text-white text-xs px-2 py-1 rounded">
                    <span className="font-bold">Prompt</span>Pay
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Amount */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              2. Specify top up amount
              <DollarSign className="w-5 h-5 ml-1 text-blue-500" />
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <button
                className={`border rounded-xl py-3 px-4 transition-all ${selectedAmount === "10" ? "bg-blue-50 border-blue-500" : "border-gray-200 bg-blue-50 hover:border-gray-300"}`}
                onClick={() => setSelectedAmount("10")}
              >
                10$
              </button>

              <button
                className={`border rounded-xl py-3 px-4 transition-all ${selectedAmount === "50" ? "bg-blue-50 border-blue-500" : "border-gray-200 bg-blue-50 hover:border-gray-300"}`}
                onClick={() => setSelectedAmount("50")}
              >
                50$
              </button>

              <button
                className={`border rounded-xl py-3 px-4 transition-all ${selectedAmount === "100" ? "bg-blue-50 border-blue-500" : "border-gray-200 bg-blue-50 hover:border-gray-300"}`}
                onClick={() => setSelectedAmount("100")}
              >
                100$
              </button>

              <input
                type="text"
                placeholder="Other amount"
                value={selectedAmount === "other" ? customAmount : ""}
                className="border rounded-xl py-3 px-4 text-center transition-all text-gray-500 border-gray-200 bg-blue-50 hover:border-gray-300 focus:border-blue-500 focus:bg-blue-50 focus:outline-none"
                onClick={() => setSelectedAmount("other")}
                onChange={(e) => {
                  setSelectedAmount("other")
                  setCustomAmount(e.target.value)
                }}
              />
            </div>
          </div>

          {/* Pay Button */}
          <button className="w-full sm:w-auto bg-[#0187ff] hover:bg-blue-600 text-white font-medium py-2 px-16 rounded-lg transition-colors">
            Pay
          </button>

          <p className="text-sm text-gray-500 mt-4">You will be redirected to the payment page of the chosen service</p>

          {/* Currency Conversion */}
          <div className="mt-8 text-sm text-gray-600">
            <p>1 ¥ = 11.74 ₽</p>
            <p>1 $ = 85.93 ₽</p>
          </div>
        </div>
      </div>

      {/* Chat Bubble */}
      <div className="fixed bottom-4 right-4 bg-white rounded-full shadow-md p-2">
        <div className="bg-white rounded-full p-2 flex items-center">
          <span className="mr-2">👋</span>
          <span className="text-sm">Hi! Ask me about anything!</span>
        </div>
      </div>
    </div>
  )
}

