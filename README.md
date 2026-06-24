# To-Do Personal - Semanal

Organizador de tarefas para a semana.

- Link OFICIAL: https://diogo-barboza.github.io/ToDo/

## Branch dev

A branch `dev` foi criada para implementação das features e testes em ambiente de deploy. Usando a VERCEL. 
- Link de Desenvolvimento: https://to-do-rosy-five.vercel.app/

## Estrutura de Arquivos

```
src/
├── components/
│   ├── Kanban/
│   │   ├── KanbanBoard.tsx      (Orquestrador, drag & drop)
│   │   ├── Column.tsx            (Container por dia)
│   │   ├── TaskCard.tsx          (Item draggable)
│   │   ├── TaskForm.tsx          (Modal criar tarefa)
│   │   └── EditTaskForm.tsx      (Modal editar tarefa)
│   ├── Auth/
│   │   └── LoginPage.tsx         (Tela de login)
│   ├── UI/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── Badge.tsx
│   └── Layout/
│       └── AppLayout.tsx         (Header, tema)
├── hooks/
│   └── useTasks.ts              (Abstrai store + loading)
├── stores/
│   ├── taskStore.ts             (Zustand - estado das tarefas)
│   └── userStore.ts             (Zustand - estado do usuário)
├── contexts/
│   └── AuthContext.tsx          (React Context - autenticação)
├── services/
│   └── storage/
│       ├── IStorageAdapter.ts   (Interface)
│       ├── LocalStorageAdapter.ts
│       └── SupabaseAdapter.ts
├── types/
│   └── task.ts                  (Tipos Task, Priority, etc)
├── utils/
│   └── ...                      (Utilitários)
├── styles/
│   ├── global.css               (CSS variables, tema)
│   └── *.module.css             (CSS Modules por componente)
├── App.tsx                      (Router, contextos globais)
└── main.tsx                     (Entry point)
```

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                    APRESENTAÇÃO (React)                         │
│  ┌─────────────┬──────────────┬─────────────────┬────────────┐  │
│  │ AppLayout   │ KanbanBoard  │  Column         │ TaskCard   │  │
│  │ (Header)    │ (Orquestrador)│ (Drop zone)    │ (Draggable)│  │
│  └─────────────┴──────────────┴─────────────────┴────────────┘  │
│                              △                                   │
│                              │                                   │
│                         (Props & Events)                         │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                        HOOKS CUSTOMIZADOS                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  useTasks() - Abstrai complexidade do store              │  │
│  │  • loadTasks(userId)                                     │  │
│  │  • addTask(input)                                        │  │
│  │  • updateTask(taskId, input)                             │  │
│  │  • deleteTask(taskId)                                    │  │
│  │  • reorderTasks(srcId, destId, day, order)               │  │
│  │  • getTasksByDay(dayOfWeek)                              │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                     GERENCIAMENTO DE ESTADO                      │
│  ┌──────────────────────┬────────────────────────────────────┐  │
│  │ Zustand Store        │ AuthContext                         │  │
│  │ (taskStore)          │ (Contexto de Autenticação)         │  │
│  │                      │                                    │  │
│  │ • tasks: Task[]      │ • user: User | null               │  │
│  │ • isLoading          │ • session: Session | null         │  │
│  │ • error              │ • login(email, password)          │  │
│  │ • initialized        │ • logout()                        │  │
│  └──────────────────────┴────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                   CAMADA DE PERSISTÊNCIA                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         Interface IStorageAdapter                          │ │
│  │  ┌─────────────┬──────────────┬──────────────────────┐    │ │
│  │  │ LocalStorage│  Supabase    │  Custom Adapters     │    │ │
│  │  │ (Fallback)  │  (Backend)   │  (Extensível)        │    │ │
│  │  └─────────────┴──────────────┴──────────────────────┘    │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                      CAMADA DE DADOS                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Persistência de Dados                           ││
│  │  • Browser LocalStorage (desenvolvimento)                   ││
│  │  • Supabase PostgreSQL (produção)                           ││
│  │  • Supabase Auth (autenticação)                             ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```