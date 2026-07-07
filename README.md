# Kanban — Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.16-5A29E4?logo=axios&logoColor=white)

Frontend de un tablero Kanban construido con **React 19** y **Vite**, con drag-and-drop de tarjetas (dnd-kit), autenticación JWT con refresh automático vía interceptores de Axios, y login con Google OAuth2. Consume el backend [Kanban-Spring](../Kanban-Spring).

## Stack

- React 19 + React Router 7
- Vite 8
- Axios (con interceptores para refresh de token JWT)
- dnd-kit (drag-and-drop de tarjetas entre columnas)
- Bootstrap 5

## Estructura

```
src/
├── api/            # Servicios de conexión al backend (axios)
├── componentes/    # Componentes reutilizables (Navbar, tarjetas, modales, formularios)
├── hooks/          # Custom hooks (useUser, useForm)
├── pages/          # Vistas (Login, Registro, Landing, Home, Board, OAuth callback)
└── App.jsx         # Rutas principales
```

## Requisitos

- Node.js 20+
- El backend [Kanban-Spring](../Kanban-Spring) corriendo (local o en un servidor)

## Puesta en marcha

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Crea tu archivo de variables de entorno:

   ```bash
   cp .env.example .env
   ```

3. Define la URL del backend en `.env`:

   ```
   VITE_API_URL=http://localhost:8082
   ```

   > **Importante:** esta variable se aplica en tiempo de **build**, no de runtime. Si cambias la URL del backend después de compilar, necesitas volver a correr `npm run build` (o `npm run dev` en desarrollo).

4. Levanta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Por defecto queda disponible en `http://localhost:5173`.

## Scripts disponibles

```bash
npm run dev       # servidor de desarrollo con hot reload
npm run build     # build de producción (genera carpeta dist/)
npm run preview   # sirve localmente el build de producción, para probarlo antes de desplegar
npm run lint      # revisa el código con ESLint
```

## Conexión con el backend

- Todas las peticiones pasan por `src/api/axiosConfig.js`, que agrega el token JWT automáticamente y maneja el refresh cuando expira.
- El login con Google redirige al backend, que maneja el flujo OAuth2 completo; el frontend solo recibe el resultado en `OAuthCallbackPage.jsx`.
- Si ves errores de CORS en la consola del navegador al conectar con el backend, revisa que `CORS_ALLOWED_ORIGINS` en el backend incluya el origen exacto desde el que corre este frontend (por ejemplo `http://localhost:5173`, o la URL del servicio donde lo despliegues).

## Despliegue

Al ser una SPA compilada a archivos estáticos, se puede desplegar en cualquier servicio de hosting estático (Vercel, Netlify, GitHub Pages, o un Nginx propio):

```bash
npm run build
```

Esto genera la carpeta `dist/`, lista para subir. Recuerda definir `VITE_API_URL` con la URL **pública** del backend antes de este paso — no puede apuntar a `localhost` si el backend no corre en la misma máquina que el usuario final.

## Seguridad

- El token JWT y el refresh token se guardan actualmente en `localStorage`. Es funcional para un proyecto académico/portafolio, pero conviene tenerlo presente: si en algún momento existe una vulnerabilidad XSS en el frontend, un script inyectado podría leer esos tokens. La alternativa más robusta (cookies `httpOnly` seteadas por el backend) implica cambios en ambos lados y queda como mejora futura.
- No hay credenciales ni API keys hardcodeadas en el código — la URL del backend se maneja vía variable de entorno (`VITE_API_URL`), y el flujo de Google OAuth2 nunca expone el client secret al frontend.
