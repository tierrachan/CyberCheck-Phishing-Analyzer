# CyberCheck-Phishing-Analyzer
Prototipo web para la identificación y análisis léxico-heurístico de señales de riesgo en enlaces web potencialmente fraudulentos (phishing). Proyecto de Grado - Ingeniería de Sistemas (UNAD).
# 🛡️ Analizador de Señales de Riesgo en Enlaces Web (Prototipo)

Prototipo de interfaz web desarrollado en el marco del proyecto aplicado de grado: **"Desarrollo de una herramienta tecnológica para la identificación y análisis de señales de riesgo en enlaces web potencialmente fraudulentos"**, para el programa de Ingeniería de Sistemas de la Universidad Nacional Abierta y a Distancia (UNAD).

## 📌 Acerca del proyecto

El *phishing* y la suplantación de sitios web representan una de las amenazas más frecuentes en entornos digitales. Este prototipo plantea una herramienta preventiva basada en el **análisis léxico y heurístico de direcciones URL**, diseñada para evaluar la estructura sintáctica de un enlace y alertar al usuario sobre posibles riesgos **sin necesidad de visitar ni cargar el contenido del sitio de destino**.

El proyecto se rige bajo la iniciativa de ingeniería **CDIO** (*Concebir, Diseñar, Implementar y Operar*). Esta versión corresponde a la **Fase 4 (Práctica Simulada)**, enfocada en el diseño visual interactivo de la interfaz y el control de versiones del código frontend.

## ✨ Funcionalidades simuladas en la interfaz

- **Ingreso de enlaces:** Campo principal para pegar y verificar direcciones URL sospechosas.
- **Semáforo y puntaje de riesgo:** Indicador visual de nivel de riesgo (**Bajo**, **Medio** o **Alto**) con puntaje ponderado de 0 a 100.
- **Reporte explicable de señales:** Listado detallado de las reglas heurísticas activadas (como marca fuera del dominio, palabras sensibles, uso de IP, guiones excesivos o esquema HTTP sin cifrado) y su peso en el puntaje.
- **Descomposición sintáctica:** Visualización estructurada de los componentes de la URL (*esquema, subdominio, dominio registrable, ruta y parámetros*) sin conexión de red.

## 🛠️ Tecnologías utilizadas

- **Diseño UI/UX:** Figma
- **Frontend:** React + TypeScript
- **Empaquetador:** Vite
- **Gestor de paquetes:** pnpm
- **Control de versiones:** Git / GitHub

  👥 Autores
Danny Yosip Quimbaya Anaya

Jhonatan Martínez Méndez

Institución: Universidad Nacional Abierta y a Distancia (UNAD)

Escuela: Ciencias Básicas, Tecnología e Ingeniería (ECBTI)

Curso: Proyecto de Grado (202016907)

## 🚀 Ejecución en entorno local

Para visualizar el prototipo en tu equipo, asegúrate de tener instalado [Node.js](https://nodejs.org/) y [pnpm](https://pnpm.io/), y ejecuta los siguientes comandos:

```bash
# 1. Clonar el repositorio
git clone <URL_DE_TU_REPOSITORIO>

# 2. Entrar a la carpeta del proyecto
cd <NOMBRE_DE_LA_CARPETA>

# 3. Instalar dependencias
pnpm install

# 4. Iniciar el servidor de desarrollo
pnpm run dev
