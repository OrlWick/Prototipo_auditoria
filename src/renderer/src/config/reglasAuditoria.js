export const reglasAuditoria = {
  conclusionesPredefinidas: {
    obj1: {
      positiva: "Se constató que los equipos de cómputo evaluados operan bajo condiciones óptimas de rendimiento y mantenimiento. La infraestructura física y de hardware demuestra estar alineada con las necesidades operativas de la organización, garantizando la continuidad del negocio y asegurando que el personal cuenta con las herramientas tecnológicas adecuadas para el desempeño eficiente de sus funciones.",
      negativa: "Se determinó que una parte significativa del parque tecnológico y los equipos de cómputo evaluados presenta obsolescencia de hardware y falta de planes de mantenimiento preventivo. Esta situación limita el rendimiento operativo de los usuarios, eleva la tasa de fallos técnicos y representa un riesgo inminente para la continuidad de las actividades diarias debido a la falta de soporte técnico de los fabricantes."
    },
    obj2: {
      positiva: "La auditoría confirmó que la organización cuenta con mecanismos sólidos de respaldo, control de acceso y almacenamiento que resguardan eficazmente los activos de información. Los datos críticos no solo se mantienen íntegros frente a modificaciones no autorizadas, sino que su alta disponibilidad garantiza que los procesos clave de la empresa fluyan sin interrupciones y con total confiabilidad.",
      negativa: "La evaluación reveló debilidades críticas en los controles de acceso y en las políticas de respaldo, comprometiendo la integridad y la disponibilidad de los activos de información. La ausencia de redundancia en el almacenamiento y la falta de un plan formal de recuperación ante desastres exponen a la organización a pérdidas de datos irreversibles e interrupciones prolongadas en sus operaciones clave."
    },
    obj3: {
      positiva: "Si bien se identificaron áreas de oportunidad naturales en cualquier entorno tecnológico dinámico, la infraestructura de TI demuestra una postura de seguridad proactiva y resiliente. La disposición de la organización para detectar estas vulnerabilidades de manera oportuna refleja un fuerte compromiso con la mejora continua y la mitigación de riesgos, sentando las bases para robustecer aún más las defensas perimetrales y lógicas.",
      negativa: "La auditoría identificó vulnerabilidades críticas y riesgos de alto impacto en la infraestructura de TI, incluyendo sistemas operativos sin actualizar, falta de segmentación de red y un perímetro de seguridad expuesto. La ausencia de un sistema de gestión de riesgos proactivo sitúa a la organización en un estado de alta vulnerabilidad frente a incidentes de seguridad, accesos no autorizados o ataques cibernéticos."
    }
  },
  evaluacionPorArea: [
    {
      id: "estado_fisico",
      nombre: "Estado físico",
      camposDesencadenantes: [{ seccion: 4, campo: "tieneDanos", valoresInseguros: ["si"] }],
      riesgo: "Medio",
      resultadoGeneral: "Equipos encontrados con deficiencias y/o en mal estado, mostrando un descuidado en los bienes de trabajo que perjudican el trabajo y la información",
      resultadoGeneralPositivo: "Equipos hallados en óptimas condiciones de operatividad, y mantenimiento, se garantiza la continuidad del trabajo y la integridad de la información",
      hallazgosPredeterminados: [
        {
          hallazgo: "Equipos encontrados con deficiencias y/o en mal estado físico",
          criterio: "A.7.12 - Mantenimiento de equipos: La norma exige que los equipos se mantengan correctamente para asegurar su disponibilidad e integridad.",
          efecto: "Riesgo de falla inminente de hardware, causando pérdida de disponibilidad de las estaciones de trabajo.",
          recomendacion: "Establecer un programa formal de mantenimiento preventivo y correctivo para los equipos físicos."
        }
      ]
    },
    {
      id: "software",
      nombre: "Software",
      camposDesencadenantes: [{ seccion: 5, campo: "tieneLicencias", valoresInseguros: ["no", "parcial"] }],
      riesgo: "Alto",
      resultadoGeneral: "Uso de software sin licencia válida, el cual puede comprometer la seguridad de la información e incumplimiento de propiedad intelectual.",
      resultadoGeneralPositivo: "Uso exclusivo de software con licencias válidas, vigentes las normativas de propiedad intelectual y robusteciendo la seguridad de la información",
      hallazgosPredeterminados: [
        {
          hallazgo: "El software de los equipos no está autorizado o no tienen licencia válida",
          criterio: "A.5.32 - Evaluación de seguridad: Evitar infringir derechos de terceros y asegurar cumplimiento legal del software.",
          efecto: "Exposición a multas legales por piratería de software y riesgo de infecciones por software de orígenes dudosos o alterados.",
          recomendacion: "Realizar una auditoría de licencias, desinstalar el software no autorizado y adquirir licenciamiento oficial."
        }
      ]
    },
    {
      id: "roles_responsabilidades",
      nombre: "Roles y Responsabilidades",
      camposDesencadenantes: [
        { seccion: 6, campo: "r6_1_resp_asignado", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_1_reconoce", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_1_politicas", valoresInseguros: ["no"] }
      ],
      riesgo: "Alto",
      resultadoGeneral: "Ausencia de una gestión adecuada de roles, y políticas, causando incidentes de seguridad, falta de estandarización y uso inadecuado de activos informáticos.",
      resultadoGeneralPositivo: "Definición, asignación y formalización clara de roles, mitigando incidentes de seguridad, promoviendo el uso correcto y eficiente de los activos informáticos de la institución.",
      hallazgosPredeterminados: [
        {
          hallazgo: "Ausencia de definición de roles, responsables de equipos y falta de políticas escritas sobre la seguridad.",
          criterio: "A.5.2 Roles y responsabilidades / A.5.1 Políticas de seguridad de la información.",
          efecto: "Desconocimiento por parte de los usuarios sobre qué pueden y qué no pueden hacer con los equipos de la empresa.",
          recomendacion: "Formalizar la entrega de equipos mediante responsivas y definir políticas claras de uso aceptable."
        }
      ]
    },
    {
      id: "seguridad_personal",
      nombre: "Seguridad del Personal",
      camposDesencadenantes: [
        { seccion: 6, campo: "r6_2_formacion", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_2_acuerdo", valoresInseguros: ["no"] }
      ],
      riesgo: "Medio",
      resultadoGeneral: "Incumplimiento en cuanto a la formación del personal, el cual incrementa el riesgo de que el usuario cometa errores que comprometa la información de la empresa.",
      resultadoGeneralPositivo: "Cumplimiento óptimo en los planes de formación y capacitación continua del personal, reduciendo significativamente el riesgo de errores operativos.",
      hallazgosPredeterminados: [
        {
          hallazgo: "Los usuarios no recibieron formación en seguridad o no han firmado acuerdos de confidencialidad.",
          criterio: "A.6.3 Concienciación, educación y capacitación en seguridad de la información.",
          efecto: "Incrementa el riesgo de que los usuarios cometan errores que comprometan activos, como caer en phishing.",
          recomendacion: "Diseñar e implementar un programa formal de capacitación en ciberseguridad y firmar NDAs obligatorios."
        }
      ]
    },
    {
      id: "gestion_activos",
      nombre: "Gestión de Activos",
      camposDesencadenantes: [
        { seccion: 6, campo: "r6_3_registrados", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_3_dueno", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_3_clasificados", valoresInseguros: ["no"] }
      ],
      riesgo: "Alto",
      resultadoGeneral: "Deficiente gestión de los equipos de cómputo como en su clasificación dificultando la respuesta ante incidentes.",
      resultadoGeneralPositivo: "Gestión e inventario óptimo de los equipos de cómputo junto con una clasificación rigurosa de los activos.",
      hallazgosPredeterminados: [
        {
          hallazgo: "Equipos no registrados en el inventario o datos sin clasificación de sensibilidad.",
          criterio: "A.5.9 Inventario de información y A.5.12 Clasificación de la información.",
          efecto: "Pérdida de control sobre los activos físicos y exposición no intencional de información confidencial.",
          recomendacion: "Crear un inventario consolidado y etiquetar la información según su nivel de confidencialidad."
        }
      ]
    },
    {
      id: "control_acceso",
      nombre: "Control de Acceso",
      camposDesencadenantes: [
        { seccion: 6, campo: "r6_4_password", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_4_password_fuerte", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_4_bloqueo", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_4_cuenta_ind", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_4_priv_min", valoresInseguros: ["no"] }
      ],
      riesgo: "Muy Alto",
      resultadoGeneral: "Ausencia de contraseñas seguras, cuentas individuales y privilegios mínimos.",
      resultadoGeneralPositivo: "Implementación rigurosa de políticas de contraseñas seguras, asignación estricta de cuentas individuales e institucionales.",
      hallazgosPredeterminados: [
        {
          hallazgo: "Equipos desprotegidos, sin contraseñas robustas o usando cuentas compartidas con privilegios excesivos.",
          criterio: "A.5.15 Control de acceso y A.5.16 Gestión de credenciales de autenticación.",
          efecto: "Cualquier persona puede ingresar a los equipos, instalar malware o modificar datos sin registro de la acción.",
          recomendacion: "Implementar autenticación obligatoria, cuentas únicas por empleado y remover permisos de administrador local."
        }
      ]
    },
    {
      id: "criptografia",
      nombre: "Criptografía",
      camposDesencadenantes: [
        { seccion: 6, campo: "r6_5_disco_cifrado", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_5_usb_cifrado", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_5_arch_cifrados", valoresInseguros: ["no"] }
      ],
      riesgo: "Muy Alto",
      resultadoGeneral: "Falta de cifrado en discos, archivos y dispositivos externos.",
      resultadoGeneralPositivo: "Implementación exhaustiva de políticas de cifrado robusto en discos locales, almacenamiento y dispositivos extraíbles.",
      hallazgosPredeterminados: [
        {
          hallazgo: "Discos duros, archivos sensibles o dispositivos USB sin políticas de cifrado de protección.",
          criterio: "A.8.24 Uso de criptografía y A.8.12 Prevención de fuga de datos.",
          efecto: "Si un dispositivo es robado o extraviado, la información confidencial de la organización queda expuesta libremente.",
          recomendacion: "Habilitar BitLocker/FileVault en todos los equipos portátiles y restringir el uso de USB no cifrados."
        }
      ]
    },
    {
      id: "seguridad_fisica_equipos",
      nombre: "Seguridad física de Equipos",
      camposDesencadenantes: [
        { seccion: 6, campo: "r6_6_1_segura", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_6_1_acceso_ctrl", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_6_1_mecanismos", valoresInseguros: ["no"] }
      ],
      riesgo: "Alto",
      resultadoGeneral: "Condiciones de seguridad ineficaces, así como deficiencias en los mecanismos antirrobo de los equipos.",
      resultadoGeneralPositivo: "Implementación estricta de condiciones de seguridad perimetral, junto con mecanismos antirrobo eficaces.",
      hallazgosPredeterminados: [
        {
          hallazgo: "Área sin acceso controlado y carencia de mecanismos antirrobo en equipos críticos.",
          criterio: "A.7.2 Controles de acceso físico y A.7.3 Aseguramiento de oficinas.",
          efecto: "Riesgo alto de robo físico de los equipos y dispositivos de almacenamiento por personal no autorizado.",
          recomendacion: "Instalar guayas de seguridad (Kensington) en laptops y asegurar el perímetro de las áreas operativas."
        }
      ]
    },
    {
      id: "seguridad_fisica_infraestructura",
      nombre: "Seguridad física de Infraestructura",
      camposDesencadenantes: [
        { seccion: 6, campo: "r6_6_2_acceso", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_6_2_cctv", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_6_2_ups", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_6_2_sobretension", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_6_2_aire", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_6_2_temp", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_6_2_extintores", valoresInseguros: ["no"] }
      ],
      riesgo: "Muy Alto",
      resultadoGeneral: "Infraestructura sin protección contra amenazas físicas ya sean humanas o ambientales de cualquier tipo.",
      resultadoGeneralPositivo: "Buena implementación de controles de seguridad, sistemas de supresión de incendios y monitoreo ambiental.",
      hallazgosPredeterminados: [
        {
          hallazgo: "El cuarto de servidores no cuenta con protecciones ambientales (UPS, Clima) ni control de acceso estricto.",
          criterio: "A.7.5 Protección contra las amenazas físicas y ambientales y A.7.4 Monitoreo.",
          efecto: "Posibilidad de daños irreparables en servidores por factores térmicos, eléctricos o acceso malintencionado.",
          recomendacion: "Adecuar el área de TI con UPS, control de acceso biométrico, CCTV y extintores vigentes (preferible CO2)."
        }
      ]
    },
    {
      id: "seguridad_operacional",
      nombre: "Seguridad Operacional",
      camposDesencadenantes: [
        { seccion: 6, campo: "r6_7_antivirus", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_7_antivirus_act", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_7_so_act", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_7_software_aut", valoresInseguros: ["no"] }
      ],
      riesgo: "Alto",
      resultadoGeneral: "Antivirus inexistente o incompleto y sistemas desactualizados causando que sean propensos los equipos a ser vulnerados o explotados.",
      resultadoGeneralPositivo: "Antivirus centralizados y políticas rigurosas de gestión de parches, garantizando que todos los sistemas estén actualizados.",
      hallazgosPredeterminados: [
        {
          hallazgo: "Equipos con antivirus inactivos o desactualizados y falta de parcheo en los Sistemas Operativos.",
          criterio: "A.8.7 Protección contra el malware y A.8.8 Gestión de vulnerabilidades técnicas.",
          efecto: "Alto riesgo de infección por ransomware y explotación de vulnerabilidades técnicas conocidas.",
          recomendacion: "Implementar un EDR centralizado y forzar las actualizaciones críticas del SO periódicamente."
        }
      ]
    },
    {
      id: "gestion_backups",
      nombre: "Gestión de Backups",
      camposDesencadenantes: [
        { seccion: 6, campo: "r6_7_1_politica", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_7_1_conocen", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_7_1_aplica", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_7_1_pruebas", valoresInseguros: ["no"] }
      ],
      riesgo: "Medio",
      resultadoGeneral: "Ausencia de políticas y aplicación de respaldos lo que da cabida a pérdida permanente de información en caso de emergencia.",
      resultadoGeneralPositivo: "Aplicación eficaz de políticas de respaldo de información, garantizando la ejecución periódica y automatizada de copias.",
      hallazgosPredeterminados: [
        {
          hallazgo: "Falta de política de respaldos automatizados o nulas pruebas de restauración.",
          criterio: "A.8.13 Copia de seguridad de la información.",
          efecto: "Imposibilidad de recuperar datos corporativos ante un fallo físico o ataque de cifrado masivo.",
          recomendacion: "Diseñar e implementar copias de seguridad bajo la regla 3-2-1 y programar simulacros de recuperación."
        }
      ]
    },
    {
      id: "seguridad_comunicaciones",
      nombre: "Seguridad en las comunicaciones",
      camposDesencadenantes: [
        { seccion: 6, campo: "r6_8_red_segura", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_8_firewall", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_8_vpn", valoresInseguros: ["no"] },
        { seccion: 6, campo: "r6_8_cifrado", valoresInseguros: ["no"] }
      ],
      riesgo: "Muy Alto",
      resultadoGeneral: "Inexistencia de redes seguras o firewalls no funcionales, causando que atacantes fuera de la red tengan acceso a la información.",
      resultadoGeneralPositivo: "Implementación eficaz de arquitecturas de red seguras, segmentación de subredes y cortafuegos, previniendo intrusiones.",
      hallazgosPredeterminados: [
        {
          hallazgo: "Infraestructura de red sin protección perimetral activa (firewall) y tráfico no cifrado.",
          criterio: "A.8.20 Seguridad de redes y A.8.21 Seguridad de los servicios de red.",
          efecto: "Exposición directa de la red interna hacia internet y posibilidad de ataques de intercepción de tráfico.",
          recomendacion: "Configurar firewall perimetral NGFW, bloquear puertos innecesarios y exigir VPN para accesos remotos."
        }
      ]
    }
  ]
};

/**
 * Función que evalúa los datos del Wizard contra las reglas.
 */
export function evaluarAuditoria(datosWizard) {
  const resultadosPorArea = [];
  const hallazgosGenerados = [];

  reglasAuditoria.evaluacionPorArea.forEach(area => {
    let esConforme = true;

    // Verificar cada campo desencadenante
    area.camposDesencadenantes.forEach(condicion => {
      const datosSeccion = datosWizard[condicion.seccion] || {};
      const valorRespuesta = datosSeccion[condicion.campo];
      
      // Si la respuesta coincide con algún valor inseguro (ej. "no")
      if (valorRespuesta && condicion.valoresInseguros.includes(valorRespuesta)) {
        esConforme = false;
      }
    });

    resultadosPorArea.push({
      id: area.id,
      nombre: area.nombre,
      conforme: esConforme,
      riesgo: esConforme ? "En cumplimiento" : area.riesgo,
      resultadoGeneral: esConforme ? area.resultadoGeneralPositivo : area.resultadoGeneral
    });

    if (!esConforme) {
      // Agregar los hallazgos predeterminados de esta área
      area.hallazgosPredeterminados.forEach(h => {
        hallazgosGenerados.push({
          area: area.nombre,
          nivel_riesgo: area.riesgo.toLowerCase(),
          problema: h.hallazgo,
          criterio: h.criterio,
          efecto: h.efecto,
          recomendacion: h.recomendacion
        });
      });
    }
  });

  // Generar Conclusiones
  // Objetivo 1: Evaluacion equipos (Depende de Estado Fisico)
  const estadoFisicoConforme = resultadosPorArea.find(a => a.id === "estado_fisico")?.conforme ?? true;
  const conclusionObj1 = estadoFisicoConforme ? reglasAuditoria.conclusionesPredefinidas.obj1.positiva : reglasAuditoria.conclusionesPredefinidas.obj1.negativa;

  // Objetivo 2: Integridad y Disponibilidad (Depende de Gestion Activos o Backups)
  const activosConforme = resultadosPorArea.find(a => a.id === "gestion_activos")?.conforme ?? true;
  const backupsConforme = resultadosPorArea.find(a => a.id === "gestion_backups")?.conforme ?? true;
  const conclusionObj2 = (activosConforme && backupsConforme) ? reglasAuditoria.conclusionesPredefinidas.obj2.positiva : reglasAuditoria.conclusionesPredefinidas.obj2.negativa;

  // Objetivo 3: Vulnerabilidades e Infraestructura (Depende de Seg Fis Equipos, Infraestructura y Operacional)
  const sfEqConforme = resultadosPorArea.find(a => a.id === "seguridad_fisica_equipos")?.conforme ?? true;
  const sfInfraConforme = resultadosPorArea.find(a => a.id === "seguridad_fisica_infraestructura")?.conforme ?? true;
  const soConforme = resultadosPorArea.find(a => a.id === "seguridad_operacional")?.conforme ?? true;
  const conclusionObj3 = (sfEqConforme && sfInfraConforme && soConforme) ? reglasAuditoria.conclusionesPredefinidas.obj3.positiva : reglasAuditoria.conclusionesPredefinidas.obj3.negativa;

  return {
    resultadosPorArea,
    hallazgosGenerados,
    conclusionesSugeridas: [conclusionObj1, conclusionObj2, conclusionObj3]
  };
}
