'use client'

import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Filter } from 'lucide-react'

const usageData = [
  { time: '00:00', chamadas: 120 },
  { time: '04:00', chamadas: 180 },
  { time: '08:00', chamadas: 320 },
  { time: '12:00', chamadas: 450 },
  { time: '16:00', chamadas: 380 },
  { time: '20:00', chamadas: 290 },
]

const latencyData = [
  { time: '00:00', latencia: 120 },
  { time: '04:00', latencia: 145 },
  { time: '08:00', latencia: 180 },
  { time: '12:00', latencia: 165 },
  { time: '16:00', latencia: 150 },
  { time: '20:00', latencia: 135 },
]

const errorData = [
  { categoria: '400 Bad Request', erros: 45 },
  { categoria: '401 Unauthorized', erros: 12 },
  { categoria: '403 Forbidden', erros: 8 },
  { categoria: '404 Not Found', erros: 67 },
  { categoria: '500 Internal', erros: 23 },
]

export default function Monitoring() {
  const [selectedKey, setSelectedKey] = useState('all')
  const [dateRange, setDateRange] = useState('today')

  return (
    <div className="p-fluap">
      <div className="flex items-center justify-between mb-fluap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitoramento</h1>
          <p className="text-gray-600 mt-2">Acompanhe o desempenho das suas APIs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="fluap-card mb-fluap">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-600" />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Key
              </label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-fluap focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Todas as Keys</option>
                <option value="key1">Produção - Principal</option>
                <option value="key2">Desenvolvimento</option>
                <option value="key3">Integração Externa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-fluap focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="today">Hoje</option>
                <option value="week">Última semana</option>
                <option value="month">Último mês</option>
                <option value="year">Último ano</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Chart */}
      <div className="fluap-card mb-fluap">
        <h2 className="text-xl font-semibold mb-4">Gráfico de Uso</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="chamadas" 
              stroke="#2563eb" 
              strokeWidth={2}
              name="Chamadas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Latency Chart */}
      <div className="fluap-card mb-fluap">
        <h2 className="text-xl font-semibold mb-4">Latência</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={latencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="latencia" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Latência (ms)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Errors Chart */}
      <div className="fluap-card">
        <h2 className="text-xl font-semibold mb-4">Erros por Categoria</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={errorData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="categoria" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="erros" fill="#ef4444" name="Erros" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

