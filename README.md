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


# Product Microservice




## DEV
1. clonar el repositorio
2. instalar dependencias
3. crear un archivo `.env` basado en el `.env.template`
4. Ejectur migracion de prisma `npx prisma migrate dev`
5. Ejecutar el microservice `npm run start:dev`