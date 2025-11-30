import React from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  BadgeCheck,
  Coffee,
  Users,
  Activity
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="mx-auto space-y-6">
        {/* Congratulations Banner */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Congratulations John! 🎉
            </h2>
            <p className="text-gray-600 mt-2">
              You have done <span className="font-bold text-gray-900">72% ☕</span> more sales today.
              Check your new raising badge in your profile.
            </p>
          </div>

          <div className="flex items-center gap-8">


            <div className="flex gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center min-w-32">
                <div className="flex items-center justify-center text-green-500 mb-2">
                  <DollarSign className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$95.2k</p>
                <p className="text-sm text-green-600 flex items-center justify-center gap-1 mt-1">
                  <ArrowUpRight className="w-4 h-4" />
                  +12%
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center min-w-32">
                <div className="flex items-center justify-center text-purple-500 mb-2">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">1.2k</p>
                <p className="text-sm text-green-600 flex items-center justify-center gap-1 mt-1">
                  <ArrowUpRight className="w-4 h-4" />
                  +38%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Profit Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Total Profit</h3>
              <BadgeCheck className="w-5 h-5 text-purple-500" />
            </div>

            <div className="space-y-4">
              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between h-48 gap-2">
                {[25, 35, 32, 28, 40, 22, 45, 38, 30, 48].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end">
                    <div
                      className={`w-full rounded-t-lg transition-all ${i === 9 ? 'bg-green-500' : 'bg-purple-500'
                        }`}
                      style={{ height: `${height * 3}px` }}
                    ></div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>2015</span>
                <span>2016</span>
                <span>2017</span>
                <span>2018</span>
                <span>2019</span>
                <span>2020</span>
                <span>2021</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-3xl font-bold text-gray-900">$482.85k</div>
              <p className="text-sm text-gray-600">Last month balance $234.40k</p>
            </div>
          </div>

          {/* Total Profit Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Profit</p>
                  <p className="text-2xl font-bold text-gray-900">$48,568.20</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Income</p>
                  <p className="text-2xl font-bold text-gray-900">$38,453.25</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Expense</p>
                  <p className="text-xl font-semibold text-gray-900">$2,453.45</p>
                </div>
              </div>

              <button className="w-full mt-6 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition">
                View Report
              </button>
            </div>
          </div>

          {/* Total Sales */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Sales</h3>
              <span className="text-sm text-gray-600">Calculated in last 7 days</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">$25,980</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4" />
                  15.6%
                </p>
              </div>

              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#f3f4f6"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#fbbf24"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset="70.3"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">28%</span>
                  <span className="text-xs text-gray-600">1 Quarter</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">$35.4k</p>
            <div className="mt-4 h-20">
              <svg viewBox="0 0 200 80" className="w-full">
                <path
                  d="M0,40 Q50,10 100,30 T200,40"
                  stroke="#a78bfa"
                  strokeWidth="4"
                  fill="none"
                  className="drop-shadow-sm"
                />
                <circle cx="180" cy="40" r="6" fill="#a78bfa" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Sales</h3>
            <p className="text-3xl font-bold text-gray-900">135k</p>
            <div className="mt-4 relative">
              <div className="w-full bg-gray-200 rounded-full h-12">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-12 rounded-full flex items-center justify-end pr-4 text-white font-bold"
                  style={{ width: "78%" }}
                >
                  78%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-sm p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Growth Rate</h3>
            <p className="text-4xl font-bold">68.2%</p>
            <p className="text-purple-100 mt-2">+8.2% from last month</p>
            <div className="mt-6">
              <TrendingUp className="w-12 h-12 text-white opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}