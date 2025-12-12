'use client'

import { useState } from 'react'
import { Search, Filter, ChevronDown, ChevronRight, Clock, Globe } from 'lucide-react'

interface Log {
  id: string
  endpoint: string
  method: string
  status: number
  responseTime: number
  timestamp: string
  apiKey: string
  ip: string
  details?: {
    headers: Record<string, string>
    body: string
    response: string
  }
}

const mockLogs: Log[] = [
  {
    id: '1',
    endpoint: '/api/v1/products',
    method: 'GET',
    status: 200,
    responseTime: 120,
    timestamp: '2024-01-20T12:34:56Z',
    apiKey: 'sk_live_abc123...',
    ip: '192.168.1.1',
  },
  {
    id: '2',
    endpoint: '/api/v1/orders',
    method: 'POST',
    status: 201,
    responseTime: 145,
    timestamp: '2024-01-20T12:34:52Z',
    apiKey: 'sk_live_abc123...',
    ip: '192.168.1.2',
  },
  {
    id: '3',
    endpoint: '/api/v1/users',
    method: 'GET',
    status: 200,
    responseTime: 98,
    timestamp: '2024-01-20T12:34:48Z',
    apiKey: 'sk_test_xyz789...',
    ip: '192.168.1.3',
  },
  {
    id: '4',
    endpoint: '/api/v1/payments',
    method: 'POST',
    status: 400,
    responseTime: 234,
    timestamp: '2024-01-20T12:34:45Z',
    apiKey: 'sk_live_abc123...',
    ip: '192.168.1.1',
  },
  {
    id: '5',
    endpoint: '/api/v1/inventory',
    method: 'GET',
    status: 200,
    responseTime: 167,
    timestamp: '2024-01-20T12:34:40Z',
    apiKey: 'sk_live_mno456...',
    ip: '192.168.1.4',
  },
]

export default function Logs() {
  const [logs] = useState<Log[]>(mockLogs)
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({
    status: 'all',
    endpoint: '',
    dateFrom: '',
    dateTo: '',
  })

  const toggleLogDetails = (id: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedLogs(newExpanded)
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-700'
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-700'
    if (status >= 500) return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-blue-100 text-blue-700',
      POST: 'bg-green-100 text-green-700',
      PUT: 'bg-yellow-100 text-yellow-700',
      DELETE: 'bg-red-100 text-red-700',
      PATCH: 'bg-purple-100 text-purple-700',
    }
    return colors[method] || 'bg-gray-100 text-gray-700'
  }

  const filteredLogs = logs.filter(log => {
    if (filters.status !== 'all' && log.status.toString() !== filters.status) return false
    if (filters.endpoint && !log.endpoint.includes(filters.endpoint)) return false
    return true
  })

  return (
    <div className="p-fluap">
      <div className="mb-fluap">
        <h1 className="text-3xl font-bold text-gray-900">Logs das Requisições</h1>
        <p className="text-gray-600 mt-2">Histórico completo de todas as chamadas à API</p>
      </div>

      {/* Filters */}
      <div className="fluap-card mb-fluap">
        <div className="flex items-center gap-4 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-fluap focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="200">200 OK</option>
              <option value="201">201 Created</option>
              <option value="400">400 Bad Request</option>
              <option value="401">401 Unauthorized</option>
              <option value="404">404 Not Found</option>
              <option value="500">500 Internal Error</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endpoint
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.endpoint}
                onChange={(e) => setFilters({ ...filters, endpoint: e.target.value })}
                placeholder="Buscar endpoint..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-fluap focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial
            </label>
            <input
              type="datetime-local"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-fluap focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Final
            </label>
            <input
              type="datetime-local"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-fluap focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="fluap-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 w-8"></th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Endpoint</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Método</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tempo</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Horário</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogs.has(log.id)
                return (
                  <>
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleLogDetails(log.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-mono">{log.endpoint}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(log.method)}`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{log.responseTime}ms</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="py-4 px-4 bg-gray-50">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">API Key:</p>
                              <code className="text-xs text-gray-600">{log.apiKey}</code>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">IP:</p>
                              <code className="text-xs text-gray-600">{log.ip}</code>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">Detalhes da Requisição:</p>
                              <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                                {JSON.stringify({
                                  method: log.method,
                                  endpoint: log.endpoint,
                                  timestamp: log.timestamp,
                                }, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

