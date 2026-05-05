'use client'

import { useState, useEffect } from 'react'
import { X, Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react'
import { formatCurrency, calculateROI } from '@/lib/utils'

interface Props {
  onClose: () => void
}

export default function ROICalculatorModal({ onClose }: Props) {
  const [priceMonthly, setPriceMonthly] = useState<string>('10000000')
  const [assetsValue, setAssetsValue] = useState<string>('1200000000')
  const [roi, setRoi] = useState<number>(0)
  const [yearlyIncome, setYearlyIncome] = useState<number>(0)
  const [paybackPeriod, setPaybackPeriod] = useState<number>(0)

  // Calculate ROI real-time
  useEffect(() => {
    const monthly = parseFloat(priceMonthly) || 0
    const assets = parseFloat(assetsValue) || 0
    
    if (assets > 0) {
      const calculatedROI = calculateROI(monthly, assets)
      const yearly = monthly * 12
      const payback = assets / yearly
      
      setRoi(calculatedROI)
      setYearlyIncome(yearly)
      setPaybackPeriod(payback)
    } else {
      setRoi(0)
      setYearlyIncome(0)
      setPaybackPeriod(0)
    }
  }, [priceMonthly, assetsValue])

  const handleReset = () => {
    setPriceMonthly('10000000')
    setAssetsValue('1200000000')
  }

  const formatInputNumber = (value: string) => {
    // Remove non-numeric characters
    return value.replace(/[^0-9]/g, '')
  }

  const handleMonthlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceMonthly(formatInputNumber(e.target.value))
  }

  const handleAssetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssetsValue(formatInputNumber(e.target.value))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-t-2xl p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Kalkulator ROI</h2>
              <p className="text-sm text-white/80">Hitung Return on Investment</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Formula Info */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-slate-600 mb-2">📐 Formula:</p>
            <p className="text-sm text-slate-700 font-mono">
              ROI = (Sewa/Bulan × 12) / Harga Properti × 100
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4 mb-6">
            {/* Monthly Rent */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                💰 Harga Sewa per Bulan
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={priceMonthly ? formatCurrency(parseFloat(priceMonthly)) : ''}
                  onChange={handleMonthlyChange}
                  placeholder="Rp 10.000.000"
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Pendapatan sewa per bulan dari properti
              </p>
            </div>

            {/* Asset Value */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                🏠 Harga Properti (Nilai Aset)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={assetsValue ? formatCurrency(parseFloat(assetsValue)) : ''}
                  onChange={handleAssetsChange}
                  placeholder="Rp 1.200.000.000"
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Harga beli atau nilai total properti
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 mb-6 border-2 border-emerald-200">
            <p className="text-sm font-semibold text-emerald-700 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Hasil Perhitungan
            </p>

            <div className="space-y-3">
              {/* ROI */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs text-slate-500 mb-1">ROI per Tahun</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {roi.toFixed(2)}%
                </p>
              </div>

              {/* Yearly Income */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs text-slate-500 mb-1">Pendapatan per Tahun</p>
                <p className="text-xl font-bold text-slate-800">
                  {formatCurrency(yearlyIncome)}
                </p>
              </div>

              {/* Payback Period */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Payback Period (Balik Modal)
                </p>
                <p className="text-xl font-bold text-slate-800">
                  {paybackPeriod > 0 && paybackPeriod < 1000 
                    ? `${paybackPeriod.toFixed(1)} tahun` 
                    : paybackPeriod >= 1000 
                    ? '> 1000 tahun' 
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Example */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 mb-2">💡 Contoh:</p>
            <p className="text-xs text-blue-600 leading-relaxed">
              Sewa Rp 10 juta/bulan, Harga properti Rp 1,2 M<br/>
              → Pendapatan setahun: Rp 120 juta<br/>
              → ROI: 120 juta / 1,2 M × 100 = <strong>10%</strong><br/>
              → Balik modal dalam <strong>10 tahun</strong>
            </p>
          </div>

          {/* Interpretation */}
          {roi > 0 && (
            <div className={`rounded-xl p-4 mb-6 border-2 ${
              roi >= 8 
                ? 'bg-emerald-50 border-emerald-300' 
                : roi >= 5 
                ? 'bg-yellow-50 border-yellow-300' 
                : 'bg-red-50 border-red-300'
            }`}>
              <p className="text-sm font-semibold mb-2">
                {roi >= 8 ? '🎉 ROI Sangat Bagus!' : roi >= 5 ? '👍 ROI Cukup Baik' : '⚠️ ROI Rendah'}
              </p>
              <p className="text-xs leading-relaxed">
                {roi >= 8 
                  ? 'ROI di atas 8% per tahun termasuk investasi properti yang sangat menguntungkan! Payback period relatif cepat.'
                  : roi >= 5 
                  ? 'ROI 5-8% per tahun adalah standar untuk investasi properti. Cukup stabil untuk passive income.'
                  : 'ROI di bawah 5% per tahun tergolong rendah. Pertimbangkan untuk negosiasi harga atau cari properti lain.'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
