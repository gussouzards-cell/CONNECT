'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, XCircle, Settings } from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon: string
  status: 'active' | 'inactive' | 'not_installed'
  version: string
  author: string
}

const integrations: Integration[] = [
  {
    id: '1',
    name: 'Farmácias',
    description: 'Integração com principais redes de farmácias para gestão de produtos e pedidos',
    category: 'E-commerce',
    icon: '💊',
    status: 'active',
    version: '2.1.0',
    author: 'Fluap',
  },
  {
    id: '2',
    name: 'WhatsApp Business',
    description: 'Envio de mensagens, notificações e atendimento via WhatsApp',
    category: 'Comunicação',
    icon: '💬',
    status: 'active',
    version: '1.5.2',
    author: 'Fluap',
  },
  {
    id: '3',
    name: 'ERP TOTVS',
    description: 'Sincronização de dados com sistemas ERP TOTVS',
    category: 'ERP',
    icon: '📊',
    status: 'inactive',
    version: '3.0.1',
    author: 'Fluap',
  },
  {
    id: '4',
    name: 'Assinatura Digital',
    description: 'Integração com serviços de assinatura digital e certificação',
    category: 'Documentos',
    icon: '✍️',
    status: 'not_installed',
    version: '1.2.0',
    author: 'Fluap',
  },
  {
    id: '5',
    name: 'Pagamentos',
    description: 'Gateway de pagamentos com múltiplas formas de pagamento',
    category: 'Financeiro',
    icon: '💳',
    status: 'active',
    version: '4.2.1',
    author: 'Fluap',
  },
  {
    id: '6',
    name: 'Logística',
    description: 'Integração com transportadoras e serviços de entrega',
    category: 'Logística',
    icon: '🚚',
    status: 'not_installed',
    version: '2.0.0',
    author: 'Fluap',
  },
]

export default function Marketplace() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [integrationsList, setIntegrationsList] = useState<Integration[]>(integrations)
  const [filter, setFilter] = useState<string>('all')

  const handleToggleStatus = (id: string) => {
    setIntegrationsList(integrationsList.map(integration => {
      if (integration.id === id) {
        if (integration.status === 'active') {
          return { ...integration, status: 'inactive' as const }
        } else if (integration.status === 'inactive') {
          return { ...integration, status: 'active' as const }
        } else {
          return { ...integration, status: 'active' as const }
        }
      }
      return integration
    }))
  }

  const filteredIntegrations = filter === 'all'
    ? integrationsList
    : integrationsList.filter(i => {
        if (filter === 'active') return i.status === 'active'
        if (filter === 'inactive') return i.status === 'inactive'
        if (filter === 'not_installed') return i.status === 'not_installed'
        return true
      })

  return (
    <div className="p-fluap">
      <div className="mb-fluap">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-gray-600 mt-2">Descubra e ative integrações para expandir suas capacidades</p>
      </div>

      {/* Filters */}
      <div className="fluap-card mb-fluap">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filtrar:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-fluap text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-fluap text-sm font-medium transition-all ${
              filter === 'active'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ativas
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-fluap text-sm font-medium transition-all ${
              filter === 'inactive'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inativas
          </button>
          <button
            onClick={() => setFilter('not_installed')}
            className={`px-4 py-2 rounded-fluap text-sm font-medium transition-all ${
              filter === 'not_installed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Não Instaladas
          </button>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fluap">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className="fluap-card hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedIntegration(integration)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-4xl">{integration.icon}</div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                integration.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : integration.status === 'inactive'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {integration.status === 'active' ? 'Ativa' :
                 integration.status === 'inactive' ? 'Inativa' : 'Não Instalada'}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{integration.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{integration.category}</span>
              <span>v{integration.version}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-fluap p-fluap w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{selectedIntegration.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedIntegration.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">por {selectedIntegration.author}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedIntegration(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">{selectedIntegration.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Categoria:</span>
                  <span className="ml-2 font-medium">{selectedIntegration.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Versão:</span>
                  <span className="ml-2 font-medium">v{selectedIntegration.version}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className={`ml-2 font-medium ${
                    selectedIntegration.status === 'active' ? 'text-green-600' :
                    selectedIntegration.status === 'inactive' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {selectedIntegration.status === 'active' ? 'Ativa' :
                     selectedIntegration.status === 'inactive' ? 'Inativa' : 'Não Instalada'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Guia de Configuração</h3>
              <div className="bg-gray-50 rounded-fluap p-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Acesse as configurações da integração</li>
                  <li>Configure as credenciais necessárias</li>
                  <li>Teste a conexão</li>
                  <li>Ative a integração</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleToggleStatus(selectedIntegration.id)
                  setSelectedIntegration({
                    ...selectedIntegration,
                    status: selectedIntegration.status === 'active' ? 'inactive' :
                            selectedIntegration.status === 'inactive' ? 'active' : 'active'
                  })
                }}
                className={`flex-1 fluap-button flex items-center justify-center gap-2 ${
                  selectedIntegration.status === 'active'
                    ? 'fluap-button-secondary'
                    : 'fluap-button-primary'
                }`}
              >
                {selectedIntegration.status === 'active' ? (
                  <>
                    <XCircle size={20} />
                    Desativar
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    {selectedIntegration.status === 'not_installed' ? 'Ativar' : 'Reativar'}
                  </>
                )}
              </button>
              <button className="fluap-button-secondary flex items-center justify-center gap-2">
                <Settings size={20} />
                Configurar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

