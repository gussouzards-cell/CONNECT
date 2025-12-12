'use client'

import { useState } from 'react'
import { Plus, Trash2, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Webhook {
  id: string
  url: string
  events: string[]
  status: 'active' | 'inactive'
  secret: string
  createdAt: string
  lastDelivery?: {
    timestamp: string
    status: 'success' | 'failed'
    responseCode: number
  }
}

const mockWebhooks: Webhook[] = [
  {
    id: '1',
    url: 'https://api.exemplo.com/webhooks/orders',
    events: ['order.created', 'order.updated'],
    status: 'active',
    secret: 'whsec_abc123...',
    createdAt: '2024-01-15',
    lastDelivery: {
      timestamp: '2024-01-20T12:34:56Z',
      status: 'success',
      responseCode: 200,
    },
  },
  {
    id: '2',
    url: 'https://api.exemplo.com/webhooks/payments',
    events: ['payment.completed', 'payment.failed'],
    status: 'active',
    secret: 'whsec_xyz789...',
    createdAt: '2024-01-10',
    lastDelivery: {
      timestamp: '2024-01-20T12:30:12Z',
      status: 'failed',
      responseCode: 500,
    },
  },
  {
    id: '3',
    url: 'https://api.exemplo.com/webhooks/inventory',
    events: ['inventory.updated'],
    status: 'inactive',
    secret: 'whsec_mno456...',
    createdAt: '2024-01-05',
  },
]

const availableEvents = [
  'order.created',
  'order.updated',
  'order.cancelled',
  'payment.completed',
  'payment.failed',
  'payment.refunded',
  'inventory.updated',
  'inventory.low',
  'user.created',
  'user.updated',
]

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState<Webhook[]>(mockWebhooks)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    url: '',
    events: [] as string[],
  })

  const handleCreate = () => {
    const newWebhook: Webhook = {
      id: Date.now().toString(),
      url: formData.url,
      events: formData.events,
      status: 'active',
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setWebhooks([newWebhook, ...webhooks])
    setShowCreateModal(false)
    setFormData({ url: '', events: [] })
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este webhook?')) {
      setWebhooks(webhooks.filter(w => w.id !== id))
    }
  }

  const handleResend = (id: string) => {
    // Simular reenvio
    alert('Webhook reenviado com sucesso!')
  }

  const toggleEvent = (event: string) => {
    if (formData.events.includes(event)) {
      setFormData({ ...formData, events: formData.events.filter(e => e !== event) })
    } else {
      setFormData({ ...formData, events: [...formData.events, event] })
    }
  }

  return (
    <div className="p-fluap">
      <div className="flex items-center justify-between mb-fluap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Webhooks</h1>
          <p className="text-gray-600 mt-2">Configure endpoints para receber eventos em tempo real</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="fluap-button-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Criar Webhook
        </button>
      </div>

      <div className="space-y-fluap">
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="fluap-card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{webhook.url}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    webhook.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {webhook.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Secret: <code className="text-xs bg-gray-100 px-2 py-1 rounded">{webhook.secret}</code>
                </p>
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Eventos:</p>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((event) => (
                      <span key={event} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
                {webhook.lastDelivery && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      {webhook.lastDelivery.status === 'success' ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <XCircle size={16} className="text-red-600" />
                      )}
                      <span className="text-gray-600">
                        Última entrega: {new Date(webhook.lastDelivery.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      Status: {webhook.lastDelivery.responseCode}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {webhook.lastDelivery && (
                  <button
                    onClick={() => handleResend(webhook.id)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded"
                    title="Reenviar"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(webhook.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-fluap p-fluap w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Criar novo Webhook</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Endpoint
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-fluap focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://api.exemplo.com/webhooks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Eventos
                </label>
                <div className="border border-gray-300 rounded-fluap p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {availableEvents.map((event) => (
                      <label key={event} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={formData.events.includes(event)}
                          onChange={() => toggleEvent(event)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {formData.events.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {formData.events.length} evento(s) selecionado(s)
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 fluap-button-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!formData.url || formData.events.length === 0}
                className="flex-1 fluap-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

