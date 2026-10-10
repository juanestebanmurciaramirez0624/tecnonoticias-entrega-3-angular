# TecnoNoticias — Entrega 3

Aplicación web de noticias desarrollada con Angular como proyecto final del módulo de Front End. Esta versión migra a Angular el prototipo creado previamente con HTML, CSS y JavaScript.

## Funcionalidades

- Página de inicio con las tres noticias destacadas más recientes.
- Listado dinámico de noticias cargadas desde JSON y `localStorage`.
- Búsqueda por título, resumen o categoría y filtros por categoría.
- Paginación de noticias y favoritos, con nueve tarjetas por página.
- Vista detallada de cada noticia y noticias relacionadas.
- Gestión de favoritos mediante `localStorage` y contador en el encabezado.
- Formulario de contacto reactivo con validaciones, mensajes de error y envío mediante FormSubmit.
- Administración local para crear, editar y eliminar noticias.
- Validación de los datos del formulario de administración y confirmación antes de eliminar.
- Carga, validación y compresión de imágenes JPG, PNG o WEBP.
- Selección de noticias destacadas desde el formulario de administración.
- Tarjetas uniformes con límite visual de líneas para evitar que se descuadre el diseño.
- Navegación SPA mediante Angular Router.
- Diseño adaptable a computadores, tabletas y celulares.

## Tecnologías utilizadas

- Angular
- TypeScript
- HTML
- CSS
- Angular Router
- Formularios reactivos de Angular
- Signals
- JSON local
- `localStorage`

## Estructura principal

```text
src/
├── app/
│   ├── componentes/
│   │   ├── encabezado/
│   │   ├── pie-pagina/
│   │   └── tarjeta-noticia/
│   ├── modelos/
│   │   └── noticia.ts
│   ├── paginas/
│   │   ├── administrar/
│   │   ├── contacto/
│   │   ├── detalle/
│   │   ├── favoritos/
│   │   ├── inicio/
│   │   └── noticias/
│   ├── servicios/
│   │   └── noticias.ts
│   ├── app.routes.ts
│   └── app.ts
├── index.html
├── main.ts
└── styles.css

public/
├── assets/images/
├── data/noticias.json
└── favicon.svg
```

## Requisitos

- Node.js compatible con Angular 22.
- npm.

## Instalación

Después de clonar el repositorio, instala las dependencias:

```bash
npm install
```

## Ejecución local

Inicia el servidor de desarrollo:

```bash
npm start
```

Abre `http://localhost:4200` en el navegador. La aplicación se actualizará automáticamente al modificar el código fuente.

## Compilación

Genera la versión optimizada:

```bash
npm run build
```

Los archivos compilados se guardan en `dist/tecnonoticias/browser`.

## Rutas de la aplicación

- `/`: página de inicio.
- `/noticias`: listado y búsqueda de noticias.
- `/noticias/:id`: detalle de una noticia.
- `/favoritos`: noticias guardadas por el usuario.
- `/administrar`: gestión local de noticias.
- `/contacto`: formulario e información de contacto.

## Almacenamiento local

Las noticias creadas y los identificadores de las noticias favoritas se guardan en el navegador mediante `localStorage`. Por esta razón la información puede variar entre navegadores o dispositivos y se pierde si se borran los datos del sitio.

## Formulario de contacto

El formulario valida todos los campos antes de enviarlos, los mensajes se reciben mediante el servicio gratuito FormSubmit, por lo que el proyecto no necesita almacenar contraseñas ni credenciales privadas en el código fuente. La primera vez que se configura una dirección de correo, FormSubmit puede solicitar su confirmación.

## Despliegue

La aplicación se despliega en GitHub Pages.

- URL del repositorio: https://github.com/juanestebanmurciaramirez0624/tecnonoticias-entrega-3-angular
- URL de la aplicación desplegada: https://juanestebanmurciaramirez0624.github.io/tecnonoticias-entrega-3-angular/

## Proyecto académico

Entrega 3 del módulo Desarrollo de Front End. La aplicación evidencia el uso de componentes reutilizables, rutas, formularios reactivos, servicios, y persistencia local en Angular.
