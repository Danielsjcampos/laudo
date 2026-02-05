
# Plano de Reestruturação do LaudoDigital

Este plano detalha a migração do projeto monolítico atual para uma arquitetura robusta de Frontend e Backend separados, visando escalabilidade, segurança e suporte a múltiplos desenvolvedores.

## 1. Nova Estrutura de Diretórios

O projeto será dividido em dois diretórios principais na raiz:

- `/frontend`: Aplicação React/Vite existente.
- `/backend`: Nova aplicação Node.js/Express + Prisma.

```
/
├── frontend/          # Código React (movido da raiz)
│   ├── src/           # Componentes, Páginas, Contextos
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/           # API Node.js (novo)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── prisma/        # Schema e Migrations (movido de ./prisma)
│   ├── package.json
│   └── ...
└── README.md
```

## 2. Configuração do Backend (Node.js + Express + Prisma)

- **Tecnologias**: Express, TypeScript, Prisma, Helmet, Cors, Zod (validação).
- **Segurança**:
    - `iron-session` ou `jsonwebtoken` para autenticação.
    - Senhas com hash (bcryptjs).
    - Headers de segurança (Helmet).
- **Banco de Dados**: Migração do schema atual para a pasta `/backend/prisma`.

## 3. Configuração do Frontend (Refatoração)

- **API Client**: Criação de `src/services/api.ts` usando Axios para comunicar com o backend.
- **Remoção de Mocks**: Substituição de `mockData.ts` por chamadas reais (`useQuery` ou `useEffect`).
- **Autenticação**: Ajuste do `LoginPage` para fazer POST em `/auth/login` e receber token/sessão.

## 4. Plano de Execução

### Fase 1: Movimentação (FileSystem)
1. Criar pasta `frontend`.
2. Mover arquivos do projeto Vite para `frontend`.
3. Criar pasta `backend`.
4. Inicializar projeto Backend.

### Fase 2: Configuração Backend
1. Instalar dependências (express, prisma, ts-node, etc).
2. Configurar `tsconfig.json` do backend.
3. Mover `prisma/` para `backend/prisma` e ajustar `schema.prisma`.
4. Criar servidor básico (`server.ts`).

### Fase 3: Implementação da API (Entidades Principais)
1. Rota de Auth (Login).
2. Rota de Dashboard (Dados globais).
3. CRUD de Exames (Listar, Criar, Atualizar status).
4. CRUD de Pacientes.

### Fase 4: Integração Frontend
1. Configurar proxy no Vite ou CORS no backend.
2. Atualizar `LoginPage` para usar API.
3. Atualizar `DashboardPage` para buscar dados reais.

## Aprovação do Usuário
- Executar imediatamente conforme solicitado ("manda bala").
