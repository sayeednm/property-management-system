'use client'

import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList
} from 'recharts'
import { TrendingUp, DollarSign, Building2, Award } from 'lucide-react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { formatCurrency, calculateROI, cn } from '@/lib/utils'

export default function ReportsPage() {
  const { properties: storeProperties, bookings } = usePropertyStore()
  const properties = storeProperties

  const stats = useMemo(() => {
    const totalRevenue = properties.reduce((sum, p) => sum + p.price_monthly * 12, 0)
    const avgROI = properties.reduce((sum, p) => sum + calculateROI(p.price_monthly, p.assets_value), 0) / properties.length
    const occupied = properties.filter((p) => p.status === 'occupied').length
    const available = properties.filter((p) => p.status === 'available').length
    const maintenance = properties.filter((p) => p.status === 'maintenance').length
    const occupancyRate = Math.round((occupied / properties.length) * 100)

    const chartData = properties.map((p) => ({
      name: p.name,                          // full name for tooltip
      shortName: p.name.split(' ').slice(0, 2).join(' '), // short for axis
      revenue: p.price_monthly * 12,
      roi: parseFloat(calculateROI(p.price_monthly, p.assets_value).toFixed(2)),
    }))

    const topAssets = [...properties]
      .map((p) => ({ ...p, roi: calculateROI(p.price_monthly, p.assets_value) }))
      .sort((a, b) => b.roi - a.roi)

    return { totalRevenue, avgROI, occupied, available, maintenance, occupancyRate, chartData, topAssets }
  }, [properties, bookings])

  return (
    <div className="flex-1 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Reports & ROI Analysis</h1>
          <p className="text-slate-400 text-sm mt-1">Ringkasan finansial dan performa aset properti</p>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <SummaryCard
            icon={DollarSign}
            label="Total Annual Revenue"
            value={formatCurrency(stats.totalRevenue)}
            sub="Dari seluruh properti"
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <SummaryCard
            icon={TrendingUp}
            label="Rata-rata ROI"
            value={`${stats.avgROI.toFixed(2)}%`}
            sub="Annual yield rata-rata"
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <SummaryCard
            icon={Building2}
            label="Total Aset"
            value={`${properties.length} Properti`}
            sub={`${stats.occupied} occupied · ${stats.available} available`}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
        </div>

        {/* Chart + Occupancy row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

          {/* Bar Chart — horizontal */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-6">
            <p className="text-sm font-semibold text-slate-700 mb-1">Revenue per Properti</p>
            <p className="text-xs text-slate-400 mb-5">Pendapatan tahunan (Rp)</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={stats.chartData}
                layout="vertical"
                barSize={20}
                margin={{ top: 0, right: 80, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`}
                />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: '#F0FDF4' }}
                />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                  {stats.chartData.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? '#10B981' : '#34D399'} />
                  ))}
                  <LabelList
                    dataKey="revenue"
                    position="right"
                    formatter={(v: unknown) => `${(Number(v) / 1000000).toFixed(0)}jt`}
                    style={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Occupancy Rate */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 flex flex-col">
            <p className="text-sm font-semibold text-slate-700 mb-1">Occupancy Rate</p>
            <p className="text-xs text-slate-400 mb-6">Persentase properti terisi</p>

            {/* Ring visual */}
            <div className="flex items-center justify-center mb-6">
              <RingChart rate={stats.occupancyRate} />
            </div>

            {/* Legend */}
            <div className="space-y-2.5 mt-auto">
              <OccupancyRow label="Occupied" count={stats.occupied} total={properties.length} color="bg-emerald-500" />
              <OccupancyRow label="Available" count={stats.available} total={properties.length} color="bg-indigo-400" />
              <OccupancyRow label="Maintenance" count={stats.maintenance} total={properties.length} color="bg-amber-400" />
            </div>
          </div>
        </div>

        {/* Top Performing Assets */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-500" />
            <p className="text-sm font-semibold text-slate-700">Top Performing Assets</p>
            <span className="text-xs text-slate-400 ml-1">— diurutkan berdasarkan ROI tertinggi</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">#</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Properti</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Lokasi</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Harga/Bulan</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Nilai Aset</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Annual ROI</th>
              </tr>
            </thead>
            <tbody>
              {stats.topAssets.map((p, i) => (
                <tr key={p.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      i === 0 ? 'bg-amber-100 text-amber-600' :
                      i === 1 ? 'bg-slate-100 text-slate-500' :
                      i === 2 ? 'bg-orange-100 text-orange-500' : 'text-slate-400'
                    )}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="text-sm font-semibold text-slate-700">{p.name}</p>
                    <span className="text-xs text-slate-400 capitalize">{p.type}</span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{p.location}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-700">{formatCurrency(p.price_monthly)}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{formatCurrency(p.assets_value)}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-16">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min((p.roi / 10) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-emerald-600">{p.roi.toFixed(2)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

// --- Sub-components ---

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; revenue: number } }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{d.name}</p>
      <p className="text-emerald-600 font-bold">{formatCurrency(d.revenue)}</p>
      <p className="text-slate-400">Pendapatan Tahunan</p>
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, sub, iconBg, iconColor }: {
  icon: React.ElementType
  label: string
  value: string
  sub: string
  iconBg: string
  iconColor: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', iconBg)}>
        <Icon className={cn('w-5 h-5', iconColor)} />
      </div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-800 mb-0.5">{value}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  )
}

function OccupancyRow({ label, count, total, color }: {
  label: string; count: number; total: number; color: string
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-700">{count} ({pct}%)</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function RingChart({ rate }: { rate: number }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (rate / 100) * circ

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="144" height="144" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="#F1F5F9" strokeWidth="12" />
        <circle
          cx="72" cy="72" r={r} fill="none"
          stroke="#10B981" strokeWidth="12"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="text-center">
        <p className="text-2xl font-bold text-slate-800">{rate}%</p>
        <p className="text-xs text-slate-400">Occupied</p>
      </div>
    </div>
  )
}
