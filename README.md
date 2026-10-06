# User Registration (React + TypeScript + Node.js)

Projeto de portfólio: cadastro de usuários que aparecem na tela assim que são registrados.

## Tecnologias
- **Frontend:** React 18, TypeScript (TSX), Vite
- **Backend:** Node.js, Express (dados salvos em `backend/users.json`)

## Como rodar

Abra dois terminais.

```bash
# Terminal 1 - API (http://localhost:3001)
cd backend
npm install
npm run dev
```

```bash
# Terminal 2 - Frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Acesse http://localhost:5173

## Endpoints
| Método | Rota             | Descrição          |
|--------|------------------|--------------------|
| GET    | /api/users       | Lista usuários     |
| POST   | /api/users       | Cria usuário       |
| DELETE | /api/users/:id   | Remove usuário     |

## Próximos passos (para evoluir o projeto)
- Trocar o JSON por banco real (SQLite/PostgreSQL com Prisma)
- Adicionar senha com hash (bcrypt) e login com JWT
- Validação com Zod nos dois lados
- Testes com Vitest e Supertest
- Deploy: Vercel (front) + Render (API)

## Deploy (Render, front + back juntos)
1. Suba o projeto no GitHub.
2. No Render: New > Web Service > conecte o repositório.
3. Build Command: `npm run build`
4. Start Command: `npm start`
5. Deploy. O Express serve a API em `/api` e o React compilado em `/`.

Atenção: no plano gratuito o disco é temporário e `users.json` é apagado a cada deploy/reinício.
Para dados permanentes, use um banco (ex.: PostgreSQL gratuito do Neon/Supabase) ou um disco persistente com `DB_FILE=/data/users.json`.
