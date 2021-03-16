# Bancos de Dados

## PostgreSQL

**Client: Beekeeper-Studio**

host: localhost
port: 5432
username: postgres
password: docker
database: gostack_gobarber

## MongoDB

**Client: MongoDB Compass Community ou Mongood**

Connection: mongodb://localhost:27017

# Email

## Como gerar credenciais da Amazon ( AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY )

1 - Acessar o IAM da amazon
2 - Usuários
3 - Adicionar usuário
4.1 - Colocar um nome para o usuário
4.2 - Selecionar "Acesso programático"
4.3 - Clicar em "Próximo: Permissões"
5.1 - Clicar em "Anexar políticas existentes de forma direta"
5.2 - Pesquisar e selecionar "AmazonSESFullAccess"
5.3 - Clicar em "Próximo: Tags"
6 - Clicar em "Próximo: Revisar"
7 - Clicar em "Criar usuário"
8 - Nesta tela serão exibidos os dados do usuário
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AWS_ACCESS_KEY_ID = ID da chave de acesso
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AWS_SECRET_ACCESS_KEY = Chave de acesso secreta)

## Conta de e-mail

-   É necessário habilitar uma conta de e-mail para enviar e-mail (inicialmente somente ela poderá receber e-mails também)
-   Para utilizar em produção deve <a href="https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html">desabilizar o sandbox</a> (permitir envio para qualquer e-mail)

# Storage


## Permissões

1 - Acessar IAM
2 - Usuários
3 - Selecionar o mesmo usuário do e-mail
4 - Adicionar permissões
5 - "Anexar políticas existentes de forma direta"
6 - "AmazonS3FullAccess" (não é ideal, é possível definir buckets especificos para acesso)
7 - Próximo
8 - Adicionar Permissões

## Bucket

1 - Criar bucket
2 - Colocar o nome do bucket no .env

# Funcionalidades

## Recuperação de senha

**Requisitos Funcionais**

-   O usuário deve poder recuperar sua senha informando o seu e-mail;
-   O usuário deve receber um e-mail com instruções de recuperação de senha;
-   O usuário deve poder resetar sua senha;

**Requisitos NÃO Funcionais**

-   Utilizar Mailtrap para testar envios em ambiente de dev;
-   Utilizar Amazon SES para envios em produção;
-   O envio de e-mails deve acontecer em segundo plano (background job);

**Regras de Negócio**

-   O link enviado por email para resetar senha, deve expirar em 2h;
-   O usuário precisa confirmar a nova senha ao resetar sua senha;

## Atualização do perfil

**Requisitos Funcionais**

-   O usuário deve poder atualizar seu nome, email e senha;

**Regras de Negócio**

-   O usuário não pode alterar seu email para um email já utilizado;
-   Para atualizar sua senha, o usuário deve informar a senha antiga;
-   Para atualizar sua senha, o usuário precisa confirmar a nova senha;

## Painel do prestador

**Requisitos Funcionais**

-   O usuário deve poder listar seus agendamentos de um dia específico;
-   O prestador deve receber uma notificação sempre que houver um novo agendamento;
-   O prestador deve poder visualizar as notificações não lidas;

**Requisitos NÃO Funcionais**

-   Os agendamentos do prestador no dia devem ser armazenados em cache;
-   As notificações do prestador devem ser armazenadas no MongoDB;
-   As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;

**Regras de Negócio**

-   A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar;

## Agendamento de serviços

**Requisitos Funcionais**

-   O usuário deve poder listar todos prestadores de serviço cadastrados;
-   O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
-   O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
-   O usuário deve poder realizar um novo agendamento com um prestador;

**Requisitos NÃO Funcionais**

-   A listagem de prestadores deve ser armazenada em cache;

**Regras de Negócio**

-   Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro às 8h, último às 17h);
-   O usuário não pode agendar em um horário que já passou;
-   O usuário não pode agendar serviços consigo mesmo;
-   Cada agendamento deve durar 1h exatamente;
-   O usuário não pode agendar em um horário já ocupado;
