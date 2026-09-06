# Portal Unificado de Materiales de Apoyo Professional

Este proyecto centraliza y organiza en una **Web Principal (Landing Page & Dashboard)** todos tus materiales profesionales como **Workshops**, **Presentaciones** y **Proyectos**.

---

## 🔑 Credenciales de Acceso

La aplicación cuenta con autenticación ligera local:

- **Correos Autorizados**:
  - `rodrigomontero89@gmail.com`
  - `rodrigomonteroduran@gmail.com`
- **Contraseña Inicial**: `Materiales2026!`

> **Nota**: Puedes cambiar la contraseña en cualquier momento usando el botón **"Contraseña"** en la barra superior del portal. La nueva contraseña se guardará en la sesión local de tu navegador (`localStorage`).

---

## 📁 Estructura del Proyecto

```
Materiales/
├── index.html                # Web Principal (Landing Page & Autenticación)
├── styles.css                # Sistema de Diseño Oscuro & Glassmorphism
├── app.js                    # Lógica de Login, Filtros, Búsqueda y Modales
├── README.md                 # Guía de Uso y Despliegue
└── Workshops/
    └── WorkHQ/               # Workshop Existente SS&C WorkHQ
        ├── index.html
        ├── app.js
        └── styles.css
```

---

## 🌐 Cómo Hospedar de Manera Gratuita

Dado que la aplicación está desarrollada exclusivamente con **HTML5, CSS3 y JavaScript puro (Vanilla)** sin dependencias complejas ni servidores Node.js, puede alojarse gratis de forma inmediata.

### Opcion 1: GitHub Pages (Recomendado - Gratis en 1 Clic)

1. Sube esta carpeta `Materiales` a un repositorio público o privado en **GitHub**.
2. Ve a la pestaña **Settings** (Configuración) de tu repositorio en GitHub.
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En **Source** (Fuente), selecciona la rama `main` (o `master`) y la carpeta `/ (root)`.
5. Haz clic en **Save** (Guardar).
6. ¡Listo! En 1 minuto GitHub te entregará un enlace URL público del tipo `https://tu-usuario.github.io/materiales/`.

---

### Opcion 2: Firebase Hosting (Gratis con Google Firebase)

Si deseas utilizar Firebase Hosting:

1. Instala la herramienta de Firebase en tu consola (solo la primera vez):
   ```bash
   npm install -g firebase-tools
   ```
2. Inicia sesión en Firebase:
   ```bash
   firebase login
   ```
3. En la raíz de esta carpeta `Materiales`, inicializa Firebase:
   ```bash
   firebase init hosting
   ```
   - Selecciona tu proyecto de Firebase.
   - Cuando pregunte *What do you want to use as your public directory?*, escribe `.` (el directorio actual).
   - Responde `N` a *Configure as a single-page app*.
4. Despliega la web:
   ```bash
   firebase deploy --only hosting
   ```
5. Firebase te entregará un dominio gratuito como `https://tu-proyecto.web.app`.

---

## ➕ Cómo Agregar Nuevas Secciones o Materiales

Puedes agregar nuevos materiales de 2 formas sencillas:

1. **Desde la Interfaz de la Web (Dinámico)**:
   - Haz clic en el botón **"+ Nuevo Material"** en el panel principal.
   - Ingresa el título, categoría (Workshop, Presentación o Proyecto), la ruta o URL (ej: `./Workshops/MiNuevoWorkshop/index.html`) y las etiquetas.

2. **Edición Directa en `app.js` (Permanente)**:
   - Abre `app.js` y añade una nueva entrada dentro de la constante `DEFAULT_MATERIALS`:
   ```javascript
   {
     id: 'mi-nuevo-workshop',
     title: 'Mi Nuevo Workshop',
     category: 'workshops',
     description: 'Descripción del workshop...',
     url: './Workshops/MiNuevoWorkshop/index.html',
     tags: ['Tag1', 'Tag2'],
     bannerBg: 'linear-gradient(135deg, #0ea5e9, #6366f1)'
   }
   ```
