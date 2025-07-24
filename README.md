### 📝 Table of Contents

# Instalaciones necesarias
```
npm i class-validator 
npm i class-transformer 
npm i dotenv
npm i joi 
npm i prisma --save-dev
npm i @prisma/client
npm i --save @nestjs/microservices
```



# Prisma 
```
npx prisma init
npx prisma migrate dev --name init

# La ultima palabra es el nombre de la migracion
# Cada que haces cambios en la base de datos, debes crear una nueva migracion
npx prisma migrate dev --name available


```