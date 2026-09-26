# Cadastro de usuários

O projeto tem dois aplicativos: a API Express em `Node` e a interface React em `React`. A API conecta ao MongoDB usando `MONGODB_URI`; o navegador acessa o banco somente por meio da API.

## Publicação

### 1. Publicar a API no Render

1. Envie o repositório para o GitHub e, no Render, crie um Blueprint usando esse repositório. O arquivo `render.yaml` configura a API como serviço pago `starter`, que não suspende por inatividade.
2. No formulário de criação do Blueprint, preencha `MONGODB_URI` com a connection string do MongoDB Atlas. Cadastre `FRONTEND_URL` como a origem do GitHub Pages, por exemplo `https://seu-usuario.github.io` (sem o caminho do repositório).
3. Após o deploy, copie a URL pública da API fornecida pelo Render, por exemplo `https://user-registration-api.onrender.com`.

### 2. Configurar o frontend no GitHub Pages

1. No GitHub, abra **Settings > Secrets and variables > Actions > Variables** e crie a variável `VITE_API_URL` com a URL pública da API, sem `/users` no final.
2. Execute novamente o workflow **Deploy React app to GitHub Pages** em **Actions**, ou envie um novo commit para `main`.
3. O workflow interrompe o build se `VITE_API_URL` não estiver configurada; isso evita publicar o frontend apontando para `localhost`.

### 3. Executar localmente

Copie `Node/.env.example` para `Node/.env`, informe `MONGODB_URI` e inicie a API com `npm start` dentro de `Node`. O arquivo `.env` é ignorado pelo Git. Em outro terminal, execute `npm run dev` dentro de `React`; a interface usa `http://localhost:3333` por padrão.

Se a senha do MongoDB já foi publicada no repositório, troque-a no Atlas antes de configurar `MONGODB_URI` no Render.
