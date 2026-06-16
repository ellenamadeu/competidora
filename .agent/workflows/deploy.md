---
description: Como realizar o deploy do projeto via FTP
---

Este workflow descreve os passos para enviar os arquivos do projeto para o servidor de produção utilizando o script automatizado.

### Pré-requisitos
1. Certifique-se de que as informações no arquivo `.env` estão corretas (Host, Usuário, Porta).
2. Você precisará da senha do FTP.

### Passo 1: Configurar a Senha (Opcional)
Você tem duas opções para a senha:
- **Opção A (Mais Segura):** Deixe `FTP_PASS=SUA_SENHA_AQUI` no arquivo `.env`. O script solicitará a senha toda vez que for executado e não a salvará em texto claro.
- **Opção B (Automática):** Substitua `SUA_SENHA_AQUI` pela sua senha real no arquivo `.env`. **Cuidado:** A senha ficará visível no arquivo (embora o `.env` esteja no `.gitignore`).

### Passo 2: Executar o Deploy
Abra o terminal na pasta raiz do projeto e execute o comando abaixo:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy.ps1
```

### O que o script faz:
- Ignora pastas desnecessárias como `.git`, `.agent` e o próprio arquivo `.env`.
- Cria as pastas necessárias no servidor.
- Sobe todos os arquivos da pasta raiz e da pasta `app/` para o diretório `/www/` no servidor.

---
**Nota:** Se encontrar erros de conexão, verifique se o seu IP não está bloqueado pelo firewall do servidor e se a porta 21 está aberta.
