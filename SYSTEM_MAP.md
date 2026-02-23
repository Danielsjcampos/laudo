# LaudoDigital - System Overview

## 1. O que é o LaudoDigital?

LaudoDigital é uma plataforma médica focada na área de Teleradiologia e exames de imagem. O sistema permite que clínicas solicitem laudos de exames, médicos radiologistas aceitem e realizem esses laudos e, ao final, o paciente (ou clínica) tenha acesso ao laudo digital através de uma interface web com um visualizador de imagens DICOM integrado.

O sistema também inclui funcionalidades de marketplace (onde exames ficam disponíveis para qualquer médico qualificado avaliar), histórico clínico, chat, emissão de segundas opiniões, e gestão de faturamento e agendas.

## 2. Arquitetura do Sistema

O sistema é dividido em três blocos principais:

### 2.1 Backend (Node.js + Express + Prisma)

- API central responsável por toda a lógica de negócios, banco de dados e comunicação.
- **Banco de Dados:** PostgreSQL (hospedado no Neon), acessado via Prisma ORM.
- **Armazenamento:** Os dados de exames e arquivos DICOM devem ser processados (através do proxy de DICOM) ou guardados num banco de dados / storage apropriado (como o Supabase Storage ou S3, ainda sendo configurado conforme a necessidade do clinico).
- **Autenticação:** Baseada em JWT, com suporte a diferentes papéis de usuário (Admin, Médico, Clínica, Paciente).
- **Integrações (ex: CRM, OCR):** Módulos que permitem checar o CRM de médicos em sites de conselhos via Puppeteer ou similares, ou ainda processar textos dos laudos.

### 2.2 Frontend (React + Vite + Tailwind CSS)

- Aplicação Single Page Application (SPA), focada num design "Premium" em modo escuro (Dark Mode).
- **Dashboards Diferenciados:**
  - Admin (Gestão de médicos, clínicas, finanças, leads, templates).
  - Médico (Caixa de entrada de exames, laudos pendentes/concluídos, finanças, perfil, criação de laudos com modelos).
  - Clínica (Acompanhamento do status dos exames solicitados, finanças, criação de solicitações).
  - Paciente (Acesso simplificado aos exames logando com seu CPF).
- **Editor de Laudos Embutido:** Permite escolher formatos predefinidos de laudo por especialidade/região do corpo.

### 2.3 OHIF Viewer (Cornerstone)

- Um visualizador universal (Open Health Imaging Foundation Viewer) acoplado ou utilizado para abrir, analisar e medir arquivos DICOM (estudos de imagem médica).
- Conectado em paralelo para interagir com os exames recebidos, permitindo ao radiologista fazer análise precisa e detalhada diretamente na web.

## 3. Fluxo Principal (Core Workflow)

1. A **Clínica** faz login e "Solicita um Novo Exame", preenchendo os dados do paciente, que tipo de laudo é esperado e anexando o histórico/arquivos DICOM.
2. O exame vai para um estado de **"Disponível no Marketplace"**.
3. O **Médico** que entra na plataforma pode ver os exames que aguardam laudo. Ele aceita o exame, que passa a ser exclusivamente da sua "Caixa de Entrada".
4. O Médico pode abrir o **Viewer (OHIF)** para ver a imagem radiológica em alta resolução, ferramentas de zoom e medição.
5. Em seguida, o Médico digita ou dita o laudo dentro da plataforma LaudoDigital, usando **Templates** (modelos de texto rápidos para exames normais ou com achados típicos).
6. Após assinar/enviar, o laudo fica com status **"Concluído"**.
7. O sistema notifica a **Clínica** (e possivelmente o Paciente, se tiver acesso liberado ou PDF exposto).
8. A funcionalidade **Financeira** atua contabilizando os créditos ou faturas correspondentes a ambas as partes.

## 4. Estado Atual e Estrutura Docker

Atualmente, iniciamos uma infraestrutura com Docker para possibilitar que a aplicação seja rodada localmente e implementada em **VPS (Virtual Private Servers)** como via Portainer. Estão disponíveis os seguintes mapeamentos básicos:

- `backend/Dockerfile`: Usa uma imagem Node fina (`node:20-bookworm-slim`) com instalação de dependências como Chromium (para eventuais consultas com Puppeteer) e compila o código via TypeScript para rodar a versão distribuível da API do Express.
- `frontend/Dockerfile`: Usa multistage build. Compila o React SPA usando Node e depois disponibiliza a pasta `dist` rodando num servidor Nginx embutido, muito leve e pronto para ambientes de produção.
- `ohif/Dockerfile`: Visualizador DICOM também customizado.

## 5. Passos Seguintes (Próximos Milestones)

- Lançar tudo na estrutura Docker Compose ou Portainer na VPS do usuário.
- Mapeamento e testes finais de conexão entre os nós conteinerizados.
- Ajuste final do DICOM Proxy para lidar com armazenamento seguro e de alta performance.
