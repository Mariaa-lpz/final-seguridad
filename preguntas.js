/*
  ============================================================
  PREGUNTAS OFICIALES — TEST DE VERDADERO O FALSO
  ============================================================
  Añade aquí cada pregunta con esta estructura:

  {
    pregunta:  "Enunciado de la pregunta",
    respuesta: true,          // true = Verdadero · false = Falso
    explicacion: "Explicación oficial de por qué es verdadero/falso"
  }

  Importante: respuesta debe ser true o false (sin comillas).
  El número de preguntas es ilimitado: la web se adapta sola.
  ============================================================
*/

window.PREGUNTAS = [
  // ⚠️ EJEMPLOS — sustitúyelos cuando me pases las preguntas reales
  {
    pregunta: "El cifrado AES-256 se considera seguro para proteger datos en reposo.",
    respuesta: true,
    explicacion: "AES-256 utiliza claves de 256 bits y, hoy por hoy, no existe un ataque práctico que lo rompa. Por eso se usa de forma habitual para cifrar discos, ficheros y comunicaciones."
  },
  {
    pregunta: "Una contraseña larga y complicada siempre es mejor que una frase de contraseña corta.",
    respuesta: false,
    explicacion: "La longitud pesa más que la complejidad. Una frase de contraseña de 4 palabras aleatorias es más difícil de adivinar —y mucho más fácil de recordar— que una corta llena de símbolos."
  },
  {
    pregunta: "El phishing consiste en engañar al usuario para que entregue sus credenciales en un sitio falso.",
    respuesta: true,
    explicacion: "El phishing suplida a una entidad de confianza (banco, correo, empresa) para que la víctima introduzca sus datos en una página o mensaje fraudulento."
  }
];
