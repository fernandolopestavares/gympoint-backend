
<p align="center">
  <img src="https://user-images.githubusercontent.com/54908803/71583546-b6295800-2aed-11ea-8235-5c80cc029783.png" />
</p>

<h1 align="center">
  Backend Gympoint
</h1>

<p align="center">
  Backend do aplicativo desenvolvido no treinamento aplicado pela Rocketseat, denominado GoStack, este desafio faz parte do projeto final do GoStack, no desenvolvimento do Gympoint, um gerenciador de academias.
</p>

<p align="center">
  <strong>Instruções</strong>
</p>

<p align="center">
  Em caso de download do projeto você precisará baixar as dependências: <br>
  Necessário: Yarn ou Npm, Git, PostgreSQL e Redis instalados no seu computador
  
  Durante o processo de desenvolvimento foi utilizado o Docker, portanto recomendo que você faça o uso para utiização dos bancos de dados, caso você optar pela utilização você pode utilizar a partir dos seguintes comandos:
  
  ```
# instalar a imagem do Redis 
docker run --name imageName -p 6379:6379 -d -t redis:alpine

# instalar a imagem do Postgres
docker run --name imagename -e POSTGRES_PASSWORD=yourPassword -p 5432:5432 -d postgres

- Comandos para execução dos serviços

# start Redis
docker start imageName

# start Postgres
docker start imageName
  
  ```
  
  Clonar o projeto e baixar as dependências:
  
  ```
  
  # Clonando o respositório
  git clone https://github.com/leoobarbosa2/gympoint-backend.git
  
  
  # Instalando as dependências
  npm install
  yarn
  
  # rodar as migrations migrations
yarn sequelize db:migrate

# rodar as  seeds
yarn sequelize db:seed:all
  
  ```
</p>

<p>
 Usuário admin
  
 para utilização da aplicação como admin você pode utilizar o seguinte usuário:
 
 ```
 email: admin@gympoint.com
 senha: 123456
 ````
 
</p>

<p>
 Exeutando o projeto
  
  ```
  yarn dev || npm run dev
  yarn queue || npm run queue
  ```
</p>
