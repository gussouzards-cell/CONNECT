'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Key, Webhook, TrendingUp, AlertCircle, Clock, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const kpiData = [
  { label: 'Total de Chamadas', value: '1,234,567', icon: TrendingUp, color: 'text-primary-600' },
  { label: 'Erros', value: '234', icon: AlertCircle, color: 'text-red-600' },
  { label: 'Latência Média', value: '145ms', icon: Clock, color: 'text-green-600' },
]

const recentRequests = [
  { endpoint: '/api/v1/products', status: 200, time: '12:34:56', latency: '120ms' },
  { endpoint: '/api/v1/orders', status: 201, time: '12:34:52', latency: '145ms' },
  { endpoint: '/api/v1/users', status: 200, time: '12:34:48', latency: '98ms' },
  { endpoint: '/api/v1/payments', status: 400, time: '12:34:45', latency: '234ms' },
  { endpoint: '/api/v1/inventory', status: 200, time: '12:34:40', latency: '167ms' },
]

const chartData = [
  { time: '00:00', chamadas: 120, erros: 5 },
  { time: '04:00', chamadas: 180, erros: 8 },
  { time: '08:00', chamadas: 320, erros: 12 },
  { time: '12:00', chamadas: 450, erros: 15 },
  { time: '16:00', chamadas: 380, erros: 10 },
  { time: '20:00', chamadas: 290, erros: 7 },
]

export default function Dashboard() {
  return (
    <div className="p-fluap">
      <div className="mb-fluap">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do seu portal de integrações</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-fluap mb-fluap">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="fluap-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{kpi.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-fluap bg-gray-50 ${kpi.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-fluap mb-fluap">
        <div className="fluap-card">
          <h2 className="text-xl font-semibold mb-4">Chamadas ao Longo do Dia</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="chamadas" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="fluap-card">
          <h2 className="text-xl font-semibold mb-4">Erros por Categoria</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { categoria: '400', erros: 45 },
              { categoria: '401', erros: 12 },
              { categoria: '403', erros: 8 },
              { categoria: '404', erros: 67 },
              { categoria: '500', erros: 23 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="erros" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-fluap mb-fluap">
        <Link href="/api-keys" className="fluap-card hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">API Keys</h3>
              <p className="text-sm text-gray-600">Gerencie suas chaves de API</p>
            </div>
            <div className="p-3 rounded-fluap bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
              <Key size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
            Ver todas <ArrowUpRight size={16} className="ml-1" />
          </div>
        </Link>

        <Link href="/webhooks" className="fluap-card hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Webhooks</h3>
              <p className="text-sm text-gray-600">Configure seus endpoints</p>
            </div>
            <div className="p-3 rounded-fluap bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
              <Webhook size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
            Ver todos <ArrowUpRight size={16} className="ml-1" />
          </div>
        </Link>
      </div>

      {/* Recent Requests */}
      <div className="fluap-card">
        <h2 className="text-xl font-semibold mb-4">Últimas Requisições</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Endpoint</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Horário</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Latência</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{req.endpoint}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      req.status === 200 || req.status === 201
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{req.time}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{req.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

