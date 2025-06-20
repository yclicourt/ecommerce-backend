# Ecommerce Backend

Backend del proyecto ecommerce desarrollado con NestJS.

## 🛠️ Stack

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/) (o tu base de datos preferida)
- [PrismaORM](https://prisma.io/)
- [Jest](https://jestjs.io/) para testing
- [PayPal](https://www.paypal.com/) (integración para pagos)
- [Gmail](https://mail.google.com/) (envío de mensajes de confirmación de pagos)

## Instalación

1. Clona el repositorio:
  ```bash
  git clone https://github.com/tu-usuario/ecommerce-backend.git
  cd ecommerce-backend
  ```

2. Instala las dependencias:
  ```bash
  npm install
  ```

3. Configura las variables de entorno en un archivo `.env`.

```
  DATABASE_URL="postgresql://username:password@host:port/db?schema=public"
  JWT='secret'
  PORT=4000
  PAYPAL_API_SECRET=''
  PAYPAL_API_CLIENT= ""
  PAYPAL_API = 'https://api-m.sandbox.paypal.com'
  ORIGIN_CLIENT= ''
  BRAND_NAME = Application Name
  SMTP_HOST=
  SMTP_PORT=
  SMTP_USER=
  SMTP_PASSWORD=
  SMTP_FROM_EMAIL=

```

4. Ejecuta las migraciones (si aplica):
  ```bash
    npx prisma init
  ```
  ```bash
    npx prisma migrate dev --name init
  ```

5. Inicia el servidor:
  ```bash
    npm run start:dev
  ```


## Documentación de la API

  La documentación de la API está disponible mediante Swagger. Una vez iniciado el servidor, accede a `http://IP-HOST:PORT/api/v1/docs` para ver la documentación interactiva.

  ![Swagger API Documentation](./uploads/doc_back_swagger.png)


## Test

  Ejecuta los tests con:

  ```bash
  npm run test
  ```

  Para ver la cobertura de tests:

  ```bash
  npm run test:cov
  ```
