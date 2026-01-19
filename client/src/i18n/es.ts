export const es = {
  app: {
    loading: "Cargando...",
  },
  seo: {
    landing: {
      title: "AI Resume Tailor - Mejora tu CV para pasar el ATS en Segundos",
      description:
        "Herramienta de análisis de CV con IA. Obtén puntaje de compatibilidad, palabras clave faltantes y sugerencias claras para optimizar tu CV para cualquier vacante. Sin registro.",
      keywords:
        "analizador de CV, ATS, optimizar CV, herramienta de CV con IA, postulación, palabras clave CV, revisar CV gratis, puntaje de compatibilidad",
      canonical: "https://airesumatailor.com",
    },
    analyze: {
      title: "Analiza tu CV - AI Resume Tailor",
      description:
        "Obtén un análisis con IA de tu CV contra cualquier vacante. Ve tu puntaje de compatibilidad, keywords faltantes y sugerencias de mejora en segundos.",
      keywords: "análisis de CV, ATS, puntaje ATS, revisar CV, compatibilidad con vacante, análisis con IA",
      canonical: "https://airesumatailor.com/analyze",
    },
  },
  language: {
    toggleLabel: "Idioma",
  },
  header: {
    logoAlt: "Logo de AI Resume Tailor",
    tagline: "Análisis de CV con IA",
    toasts: {
      signOutFailed: "No se pudo cerrar sesión",
      signedOut: "Sesión cerrada",
    },
    nav: {
      analyze: "Analizar CV",
      howItWorks: "Cómo funciona",
      docs: "Docs",
      privacy: "Privacidad",
      documentation: "Documentación",
    },
    auth: {
      signedIn: "Sesión iniciada",
      signIn: "Iniciar sesión",
      signOut: "Cerrar sesión",
    },
  },
  authDialog: {
    title: "Cuenta",
    description: "Inicia sesión para guardar tus análisis y obtener más créditos.",
    supabaseNotConfigured: "Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY.",
    tabs: {
      signIn: "Iniciar sesión",
      signUp: "Crear cuenta",
    },
    fields: {
      email: "Correo",
      password: "Contraseña",
    },
    actions: {
      signIn: "Iniciar sesión",
      signUp: "Crear cuenta",
    },
    status: {
      working: "Procesando...",
    },
    toasts: {
      signedIn: "Sesión iniciada",
      signInFailed: "No se pudo iniciar sesión",
      signUpConfirm: "Revisa tu correo para confirmar",
      signUpFailed: "No se pudo crear la cuenta",
    },
  },
  common: {
    clear: "Limpiar",
  },
  fileUpload: {
    extracting: "Extrayendo texto...",
    charactersExtracted: "caracteres extraídos",
    successMessage: "¡Texto del CV extraído exitosamente!",
    reviewHint: "Tu texto está listo abajo. Revísalo y edítalo antes de analizar.",
    failed: "Subida fallida",
    tryAgain: "Intentar de nuevo",
    uploadFile: "Sube un archivo",
    orDragDrop: "o arrastra y suelta",
    supportedFormats: "PDF o DOCX hasta 5MB",
    clear: "Quitar archivo",
    dropZoneLabel: "Subir archivo de CV",
    errors: {
      unsupportedFormat: "Por favor sube un archivo PDF o DOCX.",
      fileTooLarge: "El archivo es muy grande. Máximo 5MB.",
      emptyFile: "El archivo está vacío.",
      parseError: "No se pudo leer el archivo. Intenta copiar y pegar el texto de tu CV.",
    },
  },
  analyze: {
    heading: "AI Resume Tailor",
    subheading: "Analiza qué tan bien tu CV coincide con la vacante",
    selectRole: "¿No tienes CV a mano? Haz clic en un rol para cargar datos de ejemplo:",
    resumeLabel: "Tu CV",
    jobLabel: "Descripción del trabajo",
    resumePlaceholder: "Pega el texto de tu CV aquí (Ctrl+V). No te preocupes por el formato—nuestra IA maneja viñetas y columnas automáticamente.",
    jobPlaceholder: "Pega la vacante aquí...",
    characters: "caracteres",
    clear: "Limpiar texto",
    clearText: "Limpiar texto",
    pasteText: "Pegar",
    uploadFile: "Subir",
    extractedText: "Vista previa del texto extraído",
    extractionSuccess: "¡Texto del CV extraído exitosamente!",
    extractionHint: "Revisa tu texto abajo y haz ediciones antes de analizar.",
    analyzing: "Analizando...",
    pasteBothToStart: "Pega ambos textos para comenzar",
    analyzeMatch: "Analizar compatibilidad ahora",
    toasts: {
      freeLimitReachedTitle: "Análisis gratis usados",
      analysisCompleteTitle: "Análisis listo",
      analysisFailedTitle: "Falló el análisis",
    },
    messages: {
      freeLimitReached: "¡Usaste todos los {{total}} análisis gratis! Regístrate para más.",
      freeRemaining: "Análisis gratis restantes: {{remaining}} / {{total}}.",
      creditsRemaining: "Créditos restantes: {{remaining}} / {{total}}.",
      analysisFailedGeneric: "Falló el análisis. Inténtalo de nuevo.",
      requestTimedOut: "Se agotó el tiempo de la solicitud. Inténtalo de nuevo.",
    },
    results: {
      score: {
        excellent: "Coincidencia Excelente",
        good: "Buena Coincidencia",
        needsWork: "Necesita Mejoras",
        context: "Puntaje de Alineación con el Puesto",
      },
      keywords: {
        missingTitle: "Palabras Clave Faltantes",
        missingContext: "Agregar estos términos puede mejorar tu puntaje de alineación.",
        allFoundTitle: "¡Excelente!",
        allFoundDesc: "Encontramos todas las palabras clave críticas en tu CV.",
        missing: "Palabras Clave Faltantes",
        noMissing: "Ninguna - ¡Excelente trabajo!",
        found: "Palabras Clave Encontradas",
      },
      metrics: {
        hardSkills: "Presencia de Palabras Clave",
        semantic: "Alineación con el Puesto",
        tone: "Calidad del CV",
      },
      atsScan: "Resultados del Escaneo de Palabras Clave",
      missingKeywords: "Palabras Clave Faltantes",
      foundKeywords: "Palabras Clave Encontradas",
      noMissing: "Ninguna - ¡Excelente trabajo!",
      detailedScoring: "Desglose Detallado de Puntuación",
      optimizationPlan: "Plan de Optimización",
      noGapsTitle: "¡Coincidencia Excelente!",
      noGapsDescription: "Tu CV coincide fuertemente con los requisitos del trabajo. No se identificaron brechas críticas.",
    },
  },
  apiErrors: {
    AUTH_MISSING_BEARER_TOKEN: "No has iniciado sesión.",
    AUTH_INVALID_TOKEN: "Tu sesión expiró. Inicia sesión otra vez.",
    AUTH_VALIDATION_FAILED: "No pudimos validar tu sesión. Intenta de nuevo.",

    ANALYZE_NO_DATA: "Pega tu CV y la descripción de la vacante.",
    ANALYZE_RESUME_REQUIRED: "El texto del CV es obligatorio.",
    ANALYZE_JOB_REQUIRED: "La descripción de la vacante es obligatoria.",
    ANALYZE_RESUME_SUSPICIOUS: "Detecté contenido inválido en tu CV. Pega solo texto plano.",
    ANALYZE_JOB_SUSPICIOUS: "Detecté contenido inválido en la vacante. Pega solo texto plano.",
    ANALYZE_RESUME_TOO_SHORT: "El CV está muy corto (mínimo {{min_length}} caracteres).",
    ANALYZE_JOB_TOO_SHORT: "La vacante está muy corta (mínimo {{min_length}} caracteres).",
    ANALYZE_RESUME_TOO_LONG: "El CV está muy largo (máximo {{max_length}} caracteres).",
    ANALYZE_JOB_TOO_LONG: "La vacante está muy larga (máximo {{max_length}} caracteres).",
    ANALYZE_CREDITS_EXCEEDED_REGISTERED: "Ya usaste todos tus créditos.",
    ANALYZE_CREDITS_EXCEEDED_GUEST: "Ya usaste tu límite gratis. Crea una cuenta gratis para seguir.",

    INTERNAL_ERROR: "Error del servidor. Intenta de nuevo.",
  },
  landing: {
    hero: {
      badge: "Análisis con IA",
      headlinePrefix: "Haz que tu CV pase el",
      headlineAts: "ATS en Segundos",
      headlineSuffix: "",
      subheadlinePrefix: "El análisis con IA te muestra exactamente lo que los reclutadores quieren ver.",
      subheadlineEmphasis: "Sin registro.",
      cta: "Analizar mi CV gratis",
      socialProofPrefix: "Usado por",
      socialProofHighlight: "10,000+",
      socialProofSuffix: "personas buscando chamba",
      heroImageAlt: "Análisis profesional de CV",
      floatingBadgeMatch: "85% de match",
      floatingBadgeLabel: "Promedio",
    },
    problem: {
      heading: "¿Por qué no te están llamando a entrevistas?",
      subheading: "Hasta candidatos calificados se quedan atorados en el primer filtro",
      cards: {
        atsRejection: {
          title: "Rechazo por ATS",
          description:
            "El 75% de los CVs se rechaza automáticamente por sistemas ATS antes de que alguien los vea.",
        },
        missingKeywords: {
          title: "Faltan palabras clave",
          description:
            "Los reclutadores buscan términos específicos. Si no están, tu CV se va directo al \"no\".",
        },
        takesTooLong: {
          title: "Toma demasiado tiempo",
          description:
            "Ajustar tu CV para cada vacante te roba horas que podrías usar para hacer networking.",
        },
      },
    },
    features: {
      heading: "Tu coach de CV con IA",
      subheading: "Todo lo que necesitas para mejorar tu CV y conseguir más entrevistas",
      cards: {
        matchScore: {
          title: "Puntaje de compatibilidad al instante",
          description: "Sabe exactamente dónde estás con un puntaje de 0–100% en segundos.",
        },
        missingKeywords: {
          title: "Palabras clave faltantes",
          description: "Ve qué buscan los reclutadores, ordenado por prioridad.",
        },
        analysis3Part: {
          title: "Análisis en 3 partes",
          description: "Desglose claro: Keywords • Match semántico • Tono y estilo.",
        },
        smartSuggestions: {
          title: "Sugerencias inteligentes",
          description: "Recibe 3–5 tips accionables para mejorar tu CV al momento.",
        },
        private: {
          title: "100% privado",
          description: "No guardamos ni compartimos nada. Tu información se queda contigo.",
        },
        free: {
          title: "Siempre Disponible",
          description: "No se requiere tarjeta de crédito. No necesitas registrarte para el análisis básico.",
        },
      },
    },
    howItWorks: {
      heading: "Consigue chamba más rápido en 3 pasos",
      subheading: "De CV a listo para entrevista en menos de un minuto",
      steps: {
        step1: {
          nextStepTitle: "¿Listo para mejorar tu puntuación?",
          nextStepDesc: "Edita tu currículum basado en estas sugerencias y analiza nuevamente.",
          reportTitle: "Informe de Análisis",
        },
        step2: {
          title: "La IA analiza",
          description: "GPT-4 compara tu CV con los requisitos en segundos.",
        },
        step3: {
          title: "Aplica los cambios",
          description: "Agrega keywords faltantes y mejora con tips concretos.",
        },
      },
      cta: "Probarlo gratis",
    },
    stats: {
      resumesAnalyzed: "CVs analizados",
      averageMatchScore: "Match promedio",
      averageAnalysisTime: "Tiempo promedio de análisis",
      freeForever: "100% Privado y Seguro",
    },
    faq: {
      heading: "Preguntas frecuentes",
      subheading: "Todo lo que necesitas saber sobre AI Resume Tailor",
      items: {
        q1: {
          question: "¿Se almacenan o comparten mis datos?",
          answer: "Nunca. Procesamos tu currículum y la descripción del trabajo temporalmente para proporcionar el análisis y luego lo descartamos inmediatamente. No almacenamos tus datos y nunca los vendemos a terceros.",
        },
        q2: {
          question: "¿Qué modelo de IA impulsa esto?",
          answer: "Usamos GPT-4, el modelo de lenguaje líder en la industria, para asegurar que el análisis de tu currículum sea preciso, consciente del contexto y coincida con el nivel de comprensión humana de los requisitos del trabajo.",
        },
        q3: {
          question: "¿Funciona para todas las industrias?",
          answer: "Sí. Porque nuestra IA analiza el significado semántico de tu texto, funciona para todo, desde Ingeniería de Software y Marketing hasta Salud y Construcción.",
        },
        q4: {
          question: "¿Qué tan preciso es el análisis?",
          answer: "Nuestro sistema imita los algoritmos exactos de coincidencia de palabras clave utilizados por los modernos Sistemas de Seguimiento de Candidatos (ATS). Aunque ninguna herramienta garantiza una oferta de trabajo, alcanzar una puntuación de coincidencia alta aumenta significativamente tus posibilidades de ser visto por un reclutador humano.",
        },
        q5: {
          question: "¿Puedo analizar múltiples currículums?",
          answer: "Sí. Puedes ejecutar tantos análisis como necesites para adaptar tu currículum a diferentes solicitudes de trabajo.",
        },
        q6: {
          question: "¿Necesito crear una cuenta?",
          answer: "No. Solo pega tu currículum y la descripción del trabajo y obtén análisis instantáneo. Sin registro, sin correo electrónico requerido.",
        },
      },
    },
    finalCta: {
      badge: "Empieza tu búsqueda de chamba",
      heading: "¿Listo para conseguir el trabajo que quieres?",
      subheadlineLine1: "Analiza tu CV en segundos.",
      subheadlineLine2: "Es gratis, privado e instantáneo.",
      cta: "Analizar mi CV gratis",
      trustNoCreditCard: "Sin tarjeta",
      trustNoSignup: "Sin registro",
      trustPrivate: "100% privado",
    },
  },
  footer: {
    logoAlt: "Logo de AI Resume Tailor",
    tagline: "Análisis de CV con IA",
    columns: {
      product: "Producto",
      resources: "Recursos",
      legal: "Legal",
    },
    links: {
      analyze: "Analizar CV",
      howItWorks: "Cómo funciona",
      features: "Funciones",
      faq: "Preguntas frecuentes",
      documentation: "Documentación",
      resumeTips: "Tips para tu CV",
      atsGuide: "Guía ATS",
      github: "GitHub",
      privacy: "Aviso de privacidad",
      terms: "Términos del servicio",
      cookiePolicy: "Política de cookies",
      support: "Soporte",
    },
    copyright: "© {{year}} AI Resume Tailor. Todos los derechos reservados.",
  },
  docs: {
    nav: {
      index: "Índice",
      quickStart: "Inicio rápido",
      prd: "PRD",
      roadmap: "Roadmap",
      setup: "Instalación",
      security: "Seguridad",
      testing: "Testing",
      deployment: "Deployment",
      templateUsage: "Uso de plantilla",
      mobileResponsiveness: "Responsive móvil",
      codingPrinciples: "Principios de código",
      changelog: "Changelog",
      phase0: "Fase 0",
      phase2: "Fase 2",
    },
    loading: "Cargando documento...",
    errorPrefix: "Error: {{message}}",
    errors: {
      loadFailed: "No se pudo cargar {{filePath}}. Status: {{status}}",
      parsing: "Error al parsear el contenido markdown",
      unknown: "Ocurrió un error desconocido.",
      markdownExpectedHtml:
        "Se esperaba markdown pero se recibió HTML para {{filePath}}. Esto normalmente significa que el archivo no se está sirviendo (fallback de SPA). Reinicia el servidor de desarrollo para que /docs se sincronice en client/public/docs.",
    },
  },
  legal: {
    privacy: {
      title: "Aviso de privacidad",
    },
    terms: {
      title: "Términos del servicio",
    },
    lastUpdatedLabel: "Última actualización:",
    footer: {
      contact: "Si tienes preguntas sobre {{title}}, contáctanos.",
    },
  },
  markdown: {
    errors: {
      unknown: "Ocurrió un error desconocido.",
    },
    errorPrefix: "Error: {{message}}",
  },
  notFound: {
    title: "Página no encontrada",
    description: "Ups. La página que buscas no existe o se movió a otra ubicación.",
    actions: {
      goBack: "Regresar",
      returnHome: "Volver al inicio",
    },
    popular: {
      title: "Páginas populares",
      description: "Aquí hay algunas páginas que quizá estabas buscando",
      pages: {
        home: "Inicio",
        analyze: "Analizar",
        docs: "Documentación",
      },
    },
    search: {
      title: "¿Buscas algo en específico?",
      description: "Prueba buscando en la documentación",
      placeholder: "Buscar en la documentación...",
    },
  },
  testApi: {
    title: "Página de pruebas de API",
    description: "Prueba la conexión entre el frontend React y el backend Flask",
    health: {
      title: "Endpoint de salud",
      description: "Prueba GET /api/health para verificar que el backend está corriendo",
      action: "Probar endpoint de salud",
    },
    analyze: {
      title: "Endpoint de análisis",
      description: "Prueba POST /api/analyze con datos mock de CV",
      action: "Probar endpoint de análisis",
    },
    alerts: {
      errorTitle: "Error",
      successTitle: "¡Éxito!",
      backendResponded: "El backend respondió:",
      backendRunningHint: "Asegúrate de que Flask esté corriendo en el puerto 5000",
    },
    instructions: {
      title: "Instrucciones:",
      steps: {
        startBackend: "Inicia el backend Flask",
        startFrontend: "Inicia el frontend React",
        clickButtons: "Haz clic en los botones de arriba para probar los endpoints",
      },
    },
  },
  examples: {
    title: "Ejemplos de React Vite Tailwind",
    description: "Esta página demuestra varias funciones de la plantilla.",
    sections: {
      uiDemo: {
        title: "Demostración de componentes UI",
        description: "Este ejemplo muestra un componente reusable de React con props TypeScript y estilos Tailwind CSS.",
        exampleTitle: "Componente de ejemplo",
        exampleDescription: "Este es un componente de ejemplo con props TypeScript y estilos Tailwind",
      },
      apiSingle: {
        title: "Integración básica de API",
        description: "Este ejemplo demuestra obtener un usuario desde un endpoint mock usando MSW.",
        userProfile: "Perfil del usuario",
        id: "ID:",
        name: "Nombre:",
        loadingUser: "Cargando datos del usuario...",
      },
      apiTable: {
        title: "Tabla de datos con API mock",
        description: "Este ejemplo muestra cómo obtener y mostrar una colección de usuarios desde un endpoint mock.",
        loadingUsers: "Cargando usuarios...",
        headers: {
          id: "ID",
          name: "Nombre",
          email: "Correo",
          role: "Rol",
        },
      },
    },
    errorPrefix: "Error: {{message}}",
  },
};