# To-Do Kanban Semanal

Um aplicativo minimalista e fluido para gerenciar tarefas semanais em estilo Kanban, com drag-and-drop entre dias.

## 🎯 Características

- **Layout Kanban**: 7 colunas fixas (Segunda a Domingo)
- **Design Minimalista**: Interface limpa inspirada em Notion e Linear
- **Drag & Drop**: Movimente tarefas entre dias de forma fluida
- **Dark Mode**: Suporte automático a tema escuro
- **Persistência Local**: Seus dados são salvos no navegador
- **Individualizado**: Cada usuário vê apenas suas tarefas
- **Arquitetura Flexível**: Pronta para migração futura para Supabase

## 🚀 Quick Start

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

### Build para Produção

```bash
npm run build
```

### Deploy no GitHub Pages

1. Atualize a URL `homepage` em `package.json` com seu repositório
2. Execute:

```bash
npm run deploy
```

## 📋 Estrutura de Arquivos

```
src/
├── components/
│   ├── Kanban/          # Componentes do board
│   ├── UI/              # Componentes reutilizáveis (Button, Badge, Modal)
│   └── Layout/          # Layout principal
├── stores/              # Zustand stores (estado)
├── services/storage/    # Adapter de persistência (LocalStorage/Supabase)
├── types/               # Tipos TypeScript
├── hooks/               # Hooks customizados
├── utils/               # Utilitários e constantes
└── styles/              # Estilos globais
```

## 🔄 Arquitetura de Persistência

A aplicação usa um padrão **Adapter** para persistência:

### LocalStorage (Padrão)
```typescript
const adapter = new LocalStorageAdapter()
await adapter.addTask(userId, { title, time, description, priority, dayOfWeek })
```

### Para Supabase (Futuro)
Substitua a instância em `src/stores/taskStore.ts`:
```typescript
const storageAdapter = new SupabaseAdapter()
```

Ambos os adapters implementam `IStorageAdapter`.

## 💾 Persistência de Dados

- **Local**: Armazenado em `localStorage` com chave `kanban_tasks_{userId}`
- **Identificação**: Cada usuário recebe um UUID gerado na primeira visita
- **Sincronização**: Automática ao adicionar, atualizar ou deletar tarefas

## 🎨 Customização

### Cores e Tema
Edite as variáveis CSS em `src/styles/global.css`:
```css
:root {
  --accent: #3b82f6;
  --priority-high: #ef4444;
  --priority-medium: #f59e0b;
  --priority-low: #10b981;
}
```

### Estrutura da Tarefa
Veja `src/types/task.ts` para adicionar campos personalizados.

## 📦 Dependências Principais

- **React 18**: Framework UI
- **Vite**: Build tool e dev server
- **TypeScript**: Type safety
- **Zustand**: State management
- **dnd-kit**: Drag & drop
- **UUID**: Geração de IDs únicos

## 🔐 Segurança

- Dados são armazenados apenas localmente
- Não há envio de dados sem consentimento
- Totalmente offline-ready

## 📝 Licença

MIT
