'use client'

import { useState } from 'react'
import { Plus, Copy, Trash2, RotateCcw, Eye, EyeOff } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  expiresAt: string | null
  status: 'active' | 'revoked'
  createdAt: string
}

const mockKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Produção - Principal',
    key: 'sk_live_abc123def456ghi789',
    permissions: ['read', 'write'],
    expiresAt: null,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Desenvolvimento',
    key: 'sk_test_xyz789uvw456rst123',
    permissions: ['read'],
    expiresAt: '2024-12-31',
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Integração Externa',
    key: 'sk_live_mno456pqr789stu012',
    permissions: ['read', 'write', 'webhooks'],
    expiresAt: null,
    status: 'revoked',
    createdAt: '2024-01-05',
  },
]

export default function ApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>(mockKeys)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as string[],
    expiresAt: '',
  })

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisibleKeys(newVisible)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Chave copiada para a área de transferência!')
  }

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '•'.repeat(20) + key.substring(key.length - 4)
  }

  const handleCreate = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: formData.name,
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
      permissions: formData.permissions,
      expiresAt: formData.expiresAt || null,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    }
    setKeys([newKey, ...keys])
    setShowCreateModal(false)
    setFormData({ name: '', permissions: [], expiresAt: '' })
    alert('Nova chave criada! Guarde-a com segurança.')
  }

  const handleRevoke = (id: string) => {
    if (confirm('Tem certeza que deseja revogar esta chave?')) {
      setKeys(keys.map(k => k.id === id ? { ...k, status: 'revoked' as const } : k))
    }
  }

  const handleRegenerate = (id: string) => {
    if (confirm('Tem certeza? A chave atual será revogada e uma nova será gerada.')) {
      setKeys(keys.map(k => 
        k.id === id 
          ? { ...k, key: `sk_live_${Math.random().toString(36).substring(2, 15)}`, status: 'active' as const }
          : k
      ))
      alert('Chave regenerada com sucesso!')
    }
  }

  return (
    <div className="p-fluap">
      <div className="flex items-center justify-between mb-fluap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-600 mt-2">Gerencie suas chaves de API</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="fluap-button-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Criar nova Key
        </button>
      </div>

      <div className="fluap-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nome</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Chave</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Permissões</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Expiração</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{key.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-gray-700 font-mono">
                        {visibleKeys.has(key.id) ? key.key : maskKey(key.key)}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {visibleKeys.has(key.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(key.key)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {key.permissions.map((perm) => (
                        <span key={perm} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {key.expiresAt || 'Nunca'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      key.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {key.status === 'active' ? 'Ativa' : 'Revogada'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRegenerate(key.id)}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded"
                        title="Regenerar"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={() => handleRevoke(key.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Revogar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-fluap p-fluap w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Criar nova API Key</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-fluap focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: Produção - Principal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissões
                </label>
                <div className="space-y-2">
                  {['read', 'write', 'webhooks', 'admin'].map((perm) => (
                    <label key={perm} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, permissions: [...formData.permissions, perm] })
                          } else {
                            setFormData({ ...formData, permissions: formData.permissions.filter(p => p !== perm) })
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 capitalize">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiração (opcional)
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-fluap focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
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
                className="flex-1 fluap-button-primary"
              >
                Criar Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

