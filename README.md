# KiroGaming Store

Replica del sitio KiroGaming con panel de administración, construido con Next.js 14, Tailwind CSS y TypeScript.

## 🚀 Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🔐 Panel Admin

Ruta: [http://localhost:3000/admin](http://localhost:3000/admin)  
Contraseña por defecto: **admin123**

Para cambiar la contraseña, crea un archivo `.env.local`:
```
NEXT_PUBLIC_ADMIN_PASSWORD=tu_nueva_contraseña
```

## 📦 Despliegue en Vercel

1. Sube el proyecto a GitHub
2. Importa en [vercel.com](https://vercel.com)
3. Agrega la variable de entorno `NEXT_PUBLIC_ADMIN_PASSWORD` en Vercel Dashboard > Settings > Environment Variables
4. Deploy!

## ✨ Funcionalidades

### Sitio público
- Hero/Banner con slider automático
- Sección "Destacados" con scroll horizontal
- Sección "Añadidos Recientemente"
- Sección Indie con tarjetas horizontales
- Catálogo con filtros por: precio, plataforma, categorías, tipo de cuenta
- Búsqueda en tiempo real
- Paginación
- Chat widget de WhatsApp
- FAQ
- Footer con métodos de pago y redes sociales

### Panel Admin (`/admin`)
- **Dashboard**: estadísticas de la tienda
- **Juegos**: crear, editar, eliminar juegos. Configurar precio, descuento, imágenes, badges, categorías
- **Banners**: gestionar los banners del hero, activar/desactivar, ordenar

## 💾 Persistencia de datos

Los datos se guardan en `localStorage` del navegador. Esto significa:
- Los cambios que hagas en el admin se guardan en tu navegador
- Son persistentes entre sesiones
- Para un entorno de producción multi-usuario, considera integrar [Supabase](https://supabase.com) (gratuito)

## 🎨 Tecnologías

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **TypeScript**
- **lucide-react** (iconos)
- **localStorage** (persistencia)
