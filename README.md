<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:1e3a8a,100:0284c7&height=200&section=header&text=SEGURIDAD%20INFORMATICA&fontSize=42&fontColor=f8fafc&fontAlignY=38&desc=Plataforma%20de%20Autoevaluacion%20y%20Simulacion%20de%20Examenes&descSize=16&descColor=bae6fd&descAlignY=62" width="100%" alt="Cabecera Seguridad Informatica" />

  <br/>

  <a href="https://Mariaa-lpz.github.io/final-seguridad/">
    <img src="https://img.shields.io/badge/ACCEDER_AL_SIMULADOR_WEB-0284c7?style=for-the-badge&logo=githubpages&logoColor=white" alt="Acceder al Simulador Web" />
  </a>
  &nbsp;
  <a href="https://github.com/valentinVilla05/Guias-Basicas">
    <img src="https://img.shields.io/badge/REPOSITORIO_GUIAS_BASICAS-1e293b?style=for-the-badge&logo=github&logoColor=38bdf8" alt="Repositorio Guías Básicas" />
  </a>

  <br/><br/>

  <img src="https://img.shields.io/badge/Cobertura-Practicas_1_a_8-0f172a?style=flat-square&labelColor=334155" alt="Cobertura Prácticas 1 a 8" />
  <img src="https://img.shields.io/badge/Formato-40_Preguntas_|_30_Minutos-0f172a?style=flat-square&labelColor=334155" alt="Formato Examen" />
  <img src="https://img.shields.io/badge/Penalizacion-4_Fallos_Restan_1_Acierto-0f172a?style=flat-square&labelColor=334155" alt="Penalización" />
</div>

---

## 1. Descripción General

Este repositorio aloja una aplicación web interactiva diseñada para la preparación de pruebas teóricas y prácticas de la asignatura de **Seguridad Informática**. El sistema permite entrenar mediante cuestionarios tipo test que combinan **preguntas oficiales** con **cuestiones técnicas elaboradas a partir de los guiones de prácticas** (Prácticas 1 a 8).


> La plataforma está desplegada directamente mediante **GitHub Pages**, ofreciendo acceso inmediato desde cualquier navegador sin necesidad de instalación local.

---

## 2. Reglas y Parámetros del Simulador

El modo de simulación replica de forma estricta las condiciones reales de evaluación de la asignatura para entrenar la gestión del tiempo y el control del riesgo ante preguntas dudosas:

| Parámetro | Configuración | Descripción Operativa |
| :--- | :--- | :--- |
| **Volumen de preguntas** | `40 preguntas` | Selección aleatoria ponderada entre los bloques temáticos activos. |
| **Límite de tiempo** | `30 minutos` | Temporizador con envío automático al finalizar el tiempo reglamentario. |
| **Sistema de penalización** | `4 mal = -1 bien` | Cada respuesta incorrecta descuenta `0.25` puntos sobre el total de aciertos. |
| **Preguntas en blanco** | `0 puntos` | No suman ni restan en el cómputo global de la calificación. |

### Fórmula de Cálculo de Calificación

$$\text{Nota Final} = \max\left(0,\; \frac{\text{Aciertos} - \left(\frac{\text{Fallos}}{4}\right)}{40} \times 10\right)$$

---

## 3. Temario Cubierto (Prácticas 1 a 8)

El banco de preguntas se encuentra estructurado siguiendo el programa oficial de laboratorio:

| Bloque | Título de la Práctica |
| :---: | :--- |
| **Práctica 1** | Auditorías, Vulnerabilidades y Metasploit |
| **Práctica 2** | Criptografía Asimétrica, Firmas Digitales y GnuPG (OpenPGP) |
| **Práctica 3** | Criptografía Clásica, AES y Herramientas (CrypTool y Criptoclásicos) |
| **Práctica 4** | Criptografía Simétrica de Bloque (AES), Máquina Enigma y Funciones Hash |
| **Práctica 5** | Cifrado por Bloques (AES), Funciones Hash e Ingeniería Inversa |
| **Práctica 6** | Ingeniería Inversa, Análisis Binario y Depuración con OllyDbg |
| **Práctica 7** | Aleatoriedad, Entropía, Hashes de Contraseñas |
| **Práctica 8** | Sistemas de Detección de Intrusiones (IDS) y Análisis de Seguridad |

---

## 4. Ecosistema Complementario: Guías Básicas

Para reforzar la base teórica antes de enfrentarse a los cuestionarios cronometrados, este proyecto se complementa con el repositorio **[Guías Básicas](https://github.com/valentinVilla05/Guias-Basicas)**:

* **Documentación Estructurada:** Resúmenes técnicos, comandos de referencia y esquemas operativos de las herramientas empleadas en el laboratorio (Metasploit, GnuPG, CrypTool, OllyDbg, Snort/IDS, entre otras).
* **Simuladores Integrados:** Incluye módulos de evaluación independientes que operan bajo exactamente las **mismas condiciones de examen** (`40 preguntas`, `30 minutos` y penalización de `4 fallos restan 1 acierto`).

---

## 5. Arquitectura del Proyecto

```text
.
├── app.js                     # Lógica principal del temporizador, evaluación y cálculo de notas
├── banner.svg                 # Cabecera gráfica vectorial del repositorio
├── favicon.svg                # Icono vectorial de la aplicación web
├── index.html                 # Interfaz principal y estructura del simulador
├── preguntas.js               # Módulo integrador y gestión de selección de cuestionarios
├── preguntas-oficiales.js     # Banco de preguntas oficiales
├── preguntas-practicas-1.js   # Banco de preguntas técnicas del primer bloque de prácticas
├── preguntas-practicas-2.js   # Banco de preguntas técnicas del segundo bloque de prácticas
├── README.md                  # Documentación técnica del repositorio
└── styles.css                 # Hoja de estilos, diseño responsivo y temas visuales