# Autenticación con JWT y Bcrypt

Este proyecto implementa un sistema de autenticación básico utilizando **Node.js**, **Express**, **JSON Web Tokens (JWT)** y **Bcrypt** para el hashing de contraseñas. Los datos de los usuarios se almacenan de forma persistente en un archivo JSON.

## 🚀 Requisitos previos

- Node.js (v14 o superior).
- npm (gestor de paquetes).

## 🛠️ Instalación y Configuración

1. Clonar o extraer el proyecto en una carpeta.
2. Instalar las dependencias necesarias:
   ```bash
   npm install
   ```
3. Crear un archivo .env en la raíz del proyecto basado en el archivo `.env.example`:

Fragmento de código
- PORT=3000
- JWT_SECRET=tu_clave_secreta_aqui
- JWT_EXPIRES=15m

## 🏃 Ejecución
Para iniciar el servidor en modo desarrollo (usando nodemon):
    ```bash
    npm run dev
    ```
**El servidor estará disponible en** `http://localhost:3000`

## 📌 Endpoints de la API
1. Registro de Usuario
- **Ruta:** `POST /auth/register`

- **Cuerpo (JSON):**
  ```js
  {
  "email": "user@mail.com",
  "password": "password123"
  }
  ```
2. Login de Usuario (Emisión de Token)
- **Ruta:** `POST /auth/login`

- **Cuerpo (JSON):** Las mismas credenciales del registro.

- **Respuesta:** Devuelve un `token` JWT válido por 15 minutos.

3. Perfil (Ruta Protegida)
- **Ruta:** `GET /api/perfil`

- **Seguridad:** Requiere cabecera `Authorization: Bearer <token>`.

- **Descripción:** Devuelve los datos del usuario si el token es válido.

## 🛡️ Seguridad Implementada
- **Hashing:** Las contraseñas no se guardan en texto plano, se encriptan con `bcryptjs`.
- **Middleware:** Se utiliza un middleware de autoría propia para interceptar y validar el token JWT antes de permitir el acceso a rutas privadas.
- **Persistencia:** Los usuarios se guardan en `usuarios.json` mediante el módulo `fs/promises`.

---

## 👩🏻‍💻 Autora
Jenoveva Quijada
