# 🎓 NovaTech Portal - Sistema de Gestión Educativa

> **Estado:** Desarrollo Activo | **Versión:** 1.0.0 | **Stack:** Angular + TypeScript + SCSS

Una plataforma integral de gestión académica diseñada para conectar a administradores, profesores y estudiantes en un entorno digital moderno, seguro y eficiente. Este proyecto destaca por su arquitectura modular escalable y una interfaz de usuario premium ("University Palette").

---

## 🚀 Características Principales

### 🛡️ Seguridad y Control de Acceso
* **Autenticación Robusta:** Sistema de Login con simulación de JWT e interceptores HTTP.
* **Guards Inteligentes:** Protección de rutas mediante `AuthGuard` y `RoleGuard` para segregar accesos según el rol (Admin, Profesor, Estudiante).
* **Directivas Personalizadas:** Control de visibilidad de elementos UI granular con `*appHasRole`.

### 📊 Dashboard Dinámico por Roles
El sistema adapta la experiencia de usuario completamente según el perfil autenticado:
* **Administradores:** KPIs financieros, gestión de usuarios, auditoría de logs y CRUD de cursos.
* **Profesores:** Gestión de clases, listado de alumnos, creación de evaluaciones y seguimiento de asistencia.
* **Estudiantes:** Visualización de avance curricular, promedios ponderados, estado financiero y matrícula en línea.

### 🎨 UI/UX System (Custom Design)
* **Diseño "Pixel-Perfect":** Estilos escritos en SCSS puro sin depender de librerías pesadas como Bootstrap.
* **Feedback al Usuario:** Sistema de notificaciones `ToastService` reactivo.
* **Interactividad:** Modals animados, transiciones de carga y estados de interacción (hover/focus) pulidos.

---

## 🛠️ Stack Tecnológico

* **Core:** Angular 16+ (NgModule Architecture)
* **Lenguaje:** TypeScript 5.x
* **Estilos:** SCSS (Sass) con Variables CSS y Diseño Responsivo.
* **Gestión de Estado:** RxJS (BehaviorSubjects, Observables, ForkJoin).
* **Backend (Simulado):** JSON Server (REST API Mock).

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para levantar el entorno de desarrollo local.

### 1. Pre-requisitos
* Node.js (v18 o superior)
* Angular CLI (`npm install -g @angular/cli`)

### 2. Instalar dependencias
cd gestion-educativa
npm install

### 3. Configurar el Backend Simulado (JSON Server)
Este proyecto consume una API REST local.
npx json-server --watch db.json --port 3000

### 4. Ejecutar la Aplicación
ng serve
Abre tu navegador en http://localhost:4200/

## 📂 Arquitectura del Proyecto
src/
├── app/
│   ├── core/           # Servicios Singleton, Guards, Modelos e Interceptores.
│   ├── shared/         # Componentes reutilizables (Toast, Directivas, Pipes).
│   ├── features/       # Módulos funcionales con Lazy Loading.
│   │   ├── auth/       # Login y recuperación.
│   │   ├── dashboard/  # Contenedor principal.
│   │   │   ├── home/   # Landing interna (lógica por rol).
│   │   │   ├── courses/# Gestión académica.
│   │   │   └── users/  # Gestión de usuarios.
│   └── app.module.ts   # Orquestador principal.
└── styles.scss         # Sistema de diseño global.