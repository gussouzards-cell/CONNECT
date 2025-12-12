'use client'

import { useState } from 'react'
import { Play, Copy, Check } from 'lucide-react'

interface Endpoint {
  method: string
  path: string
  description: string
  parameters?: Array<{ name: string; type: string; required: boolean; description: string }>
  requestBody?: { type: string; example: any }
  responses: Array<{ code: number; description: string; example: any }>
}

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/products',
    description: 'Lista todos os produtos disponíveis',
    parameters: [
      { name: 'page', type: 'integer', required: false, description: 'Número da página' },
      { name: 'limit', type: 'integer', required: false, description: 'Itens por página' },
    ],
    responses: [
      {
        code: 200,
        description: 'Lista de produtos',
        example: {
          data: [
            { id: 1, name: 'Produto 1', price: 99.99 },
            { id: 2, name: 'Produto 2', price: 149.99 },
          ],
          pagination: { page: 1, limit: 10, total: 2 },
        },
      },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/orders',
    description: 'Cria um novo pedido',
    requestBody: {
      type: 'application/json',
      example: {
        customer_id: 123,
        items: [
          { product_id: 1, quantity: 2 },
          { product_id: 2, quantity: 1 },
        ],
      },
    },
    responses: [
      {
        code: 201,
        description: 'Pedido criado com sucesso',
        example: {
          id: 456,
          status: 'pending',
          total: 349.97,
          created_at: '2024-01-20T12:00:00Z',
        },
      },
      {
        code: 400,
        description: 'Dados inválidos',
        example: { error: 'Invalid request data' },
      },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/orders/{id}',
    description: 'Busca um pedido específico',
    parameters: [
      { name: 'id', type: 'integer', required: true, description: 'ID do pedido' },
    ],
    responses: [
      {
        code: 200,
        description: 'Detalhes do pedido',
        example: {
          id: 456,
          customer_id: 123,
          status: 'pending',
          items: [],
          total: 349.97,
        },
      },
      {
        code: 404,
        description: 'Pedido não encontrado',
        example: { error: 'Order not found' },
      },
    ],
  },
]

export default function Documentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const generateCodeExample = (endpoint: Endpoint, language: 'curl' | 'javascript' | 'python') => {
    const baseUrl = 'https://api.fluap.com'
    const apiKey = 'YOUR_API_KEY'

    if (language === 'curl') {
      let curl = `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}" \\\n`
      curl += `  -H "Authorization: Bearer ${apiKey}" \\\n`
      curl += `  -H "Content-Type: application/json"`
      if (endpoint.requestBody) {
        curl += ` \\\n  -d '${JSON.stringify(endpoint.requestBody.example, null, 2)}'`
      }
      return curl
    }

    if (language === 'javascript') {
      let js = `const response = await fetch('${baseUrl}${endpoint.path}', {\n`
      js += `  method: '${endpoint.method}',\n`
      js += `  headers: {\n`
      js += `    'Authorization': 'Bearer ${apiKey}',\n`
      js += `    'Content-Type': 'application/json'\n`
      js += `  }`
      if (endpoint.requestBody) {
        js += `,\n  body: JSON.stringify(${JSON.stringify(endpoint.requestBody.example, null, 2)})`
      }
      js += `\n});\nconst data = await response.json();`
      return js
    }

    if (language === 'python') {
      let py = `import requests\n\n`
      py += `response = requests.${endpoint.method.toLowerCase()}(\n`
      py += `    '${baseUrl}${endpoint.path}',\n`
      py += `    headers={\n`
      py += `        'Authorization': 'Bearer ${apiKey}',\n`
      py += `        'Content-Type': 'application/json'\n`
      py += `    }`
      if (endpoint.requestBody) {
        py += `,\n    json=${JSON.stringify(endpoint.requestBody.example, null, 2)}`
      }
      py += `\n)\ndata = response.json()`
      return py
    }

    return ''
  }

  return (
    <div className="p-fluap">
      <div className="mb-fluap">
        <h1 className="text-3xl font-bold text-gray-900">Documentação da API</h1>
        <p className="text-gray-600 mt-2">Documentação completa e playground interativo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-fluap">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="fluap-card sticky top-fluap">
            <h2 className="text-lg font-semibold mb-4">Endpoints</h2>
            <div className="space-y-2">
              {endpoints.map((endpoint, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedEndpoint(endpoint)}
                  className={`w-full text-left p-3 rounded-fluap transition-all ${
                    selectedEndpoint === endpoint
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                      endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                      endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="text-sm font-mono">{endpoint.path}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-fluap">
          {selectedEndpoint ? (
            <>
              <div className="fluap-card">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    selectedEndpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                    selectedEndpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                    selectedEndpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedEndpoint.method}
                  </span>
                  <code className="text-lg font-mono text-gray-900">{selectedEndpoint.path}</code>
                </div>
                <p className="text-gray-700 mb-6">{selectedEndpoint.description}</p>

                {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Parâmetros</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 text-sm font-semibold">Nome</th>
                            <th className="text-left py-2 px-3 text-sm font-semibold">Tipo</th>
                            <th className="text-left py-2 px-3 text-sm font-semibold">Obrigatório</th>
                            <th className="text-left py-2 px-3 text-sm font-semibold">Descrição</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEndpoint.parameters.map((param, idx) => (
                            <tr key={idx} className="border-b border-gray-100">
                              <td className="py-2 px-3 text-sm font-mono">{param.name}</td>
                              <td className="py-2 px-3 text-sm text-gray-600">{param.type}</td>
                              <td className="py-2 px-3 text-sm">
                                {param.required ? (
                                  <span className="text-red-600 font-medium">Sim</span>
                                ) : (
                                  <span className="text-gray-500">Não</span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-600">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedEndpoint.requestBody && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Request Body</h3>
                    <div className="bg-gray-50 rounded-fluap p-4">
                      <pre className="text-sm overflow-x-auto">
                        {JSON.stringify(selectedEndpoint.requestBody.example, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-3">Respostas</h3>
                  <div className="space-y-4">
                    {selectedEndpoint.responses.map((response, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-fluap p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            response.code >= 200 && response.code < 300
                              ? 'bg-green-100 text-green-700'
                              : response.code >= 400 && response.code < 500
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {response.code}
                          </span>
                          <span className="text-sm text-gray-700">{response.description}</span>
                        </div>
                        <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                          {JSON.stringify(response.example, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Playground */}
              <div className="fluap-card">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Play size={20} />
                  Playground
                </h2>
                <div className="space-y-4">
                  {(['curl', 'javascript', 'python'] as const).map((lang) => {
                    const code = generateCodeExample(selectedEndpoint, lang)
                    const codeId = `${selectedEndpoint.path}-${lang}`
                    return (
                      <div key={lang}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-gray-700 capitalize">{lang}</h3>
                          <button
                            onClick={() => copyCode(code, codeId)}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600"
                          >
                            {copiedCode === codeId ? (
                              <>
                                <Check size={16} />
                                Copiado!
                              </>
                            ) : (
                              <>
                                <Copy size={16} />
                                Copiar
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-fluap overflow-x-auto text-sm">
                          <code>{code}</code>
                        </pre>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="fluap-card">
              <p className="text-gray-600 text-center py-12">
                Selecione um endpoint na barra lateral para ver a documentação
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

