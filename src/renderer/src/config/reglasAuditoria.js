export const reglasAuditoria = {
  conclusionesPredefinidas: {
    obj1: {
      positiva: 'Se constató que los equipos de cómputo evaluados operan bajo condiciones óptimas de rendimiento y mantenimiento. La infraestructura física y de hardware demuestra estar alineada con las necesidades operativas de la organización, garantizando la continuidad del negocio y asegurando que el personal cuenta con las herramientas tecnológicas adecuadas para el desempeño eficiente de sus funciones.',
      negativa: 'Se determinó que una parte significativa del parque tecnológico y los equipos de cómputo evaluados presenta obsolescencia de hardware y falta de planes de mantenimiento preventivo. Esta situación limita el rendimiento operativo de los usuarios, eleva la tasa de fallos técnicos y representa un riesgo inminente para la continuidad de las actividades diarias debido a la falta de soporte técnico de los fabricantes.'
    },
    obj2: {
      positiva: 'La auditoría confirmó que la organización cuenta con mecanismos sólidos de respaldo, control de acceso y almacenamiento que resguardan eficazmente los activos de información. Los datos críticos no solo se mantienen íntegros frente a modificaciones no autorizadas, sino que su alta disponibilidad garantiza que los procesos clave de la empresa fluyan sin interrupciones y con total confiabilidad.',
      negativa: 'La evaluación reveló debilidades críticas en los controles de acceso y en las políticas de respaldo, comprometiendo la integridad y la disponibilidad de los activos de información. La ausencia de redundancia en el almacenamiento y la falta de un plan formal de recuperación ante desastres exponen a la organización a pérdidas de datos irreversibles e interrupciones prolongadas en sus operaciones clave.'
    },
    obj3: {
      positiva: 'Si bien se identificaron áreas de oportunidad naturales en cualquier entorno tecnológico dinámico, la infraestructura de TI demuestra una postura de seguridad proactiva y resiliente. La disposición de la organización para detectar estas vulnerabilidades de manera oportuna refleja un fuerte compromiso con la mejora continua y la mitigación de riesgos, sentando las bases para robustecer aún más las defensas perimetrales y lógicas.',
      negativa: 'La auditoría identificó vulnerabilidades críticas y riesgos de alto impacto en la infraestructura de TI, incluyendo sistemas operativos sin actualizar, falta de segmentación de red y un perímetro de seguridad expuesto. La ausencia de un sistema de gestión de riesgos proactivo sitúa a la organización en un estado de alta vulnerabilidad frente a incidentes de seguridad, accesos no autorizados o ataques cibernéticos.'
    }
  },
  
  evaluacionPorArea: [
    {
      id: 'estado_fisico',
      nombre: 'Estado físico',
      riesgo: 'Medio',
      resultadoGeneral: 'Equipos encontrados con deficiencias o sin licencias, mostrando un descuidado en los bienes de trabajo que perjudican el trabajo y la información.',
      resultadoGeneralPositivo: 'Equipos hallados en óptimas condiciones de operatividad, y mantenimiento, se garantiza la continuidad del trabajo y la integridad de la información.',
      hallazgosPredeterminados: [
        {
          campoAsociado: 'tieneDanos', seccion: 4, valoresInseguros: ['si'], nivel_riesgo: 'Medio',
          hallazgo: 'Equipos (PCs, laptops, monitores, teclados o ratones) encontrados con deficiencias y/o en mal estado físico.',
          efecto: 'Riesgo de falla inminente de hardware, causando pérdida de disponibilidad de las estaciones de trabajo.',
          criterio: 'A.7.12 Mantenimiento de equipos: La norma exige que los equipos se mantengan correctamente para asegurar su disponibilidad e integridad.',
          recomendacion: 'Establecer un programa formal de mantenimiento preventivo y correctivo para los equipos físicos. Así como una repación o cambio del producto defectuoso de manera imperativa'
        }
      ]
    },
    {
      id: 'software',
      nombre: 'Software',
      riesgo: 'Alto',
      resultadoGeneral: 'Uso de software sin licencia válida, el cual puede comprometer la seguridad de la información e incumplimiento de propiedad intelectual.',
      resultadoGeneralPositivo: 'Uso exclusivo de software con licencias válidas, vigentes las normativas de propiedad intelectual y robusteciendo la seguridad de la información.',
      hallazgosPredeterminados: [
        {
          campoAsociado: 'tieneLicencias', seccion: 5, valoresInseguros: ['no', 'parcial'], nivel_riesgo: 'Medio',
          hallazgo: 'Los programas instalados no tienen licencia legal y activa.',
          efecto: 'El uso de software sin licencia válida puede exponer a la organización a sanciones legales, multas y problemas derivados del incumplimiento de los derechos de propiedad intelectual. Esta situación puede afectar la estabilidad de los sistemas, comprometer la seguridad de la información y generar interrupciones en las operaciones de la organización.',
          criterio: 'A.5.31 Cumplimiento de requisitos legales y contractuales: La norma exige que todos los requisitos legales, estatutarios, regulatorios y contractuales relevantes para la seguridad de la información deben estar explícitamente identificados y mantenerse actualizados.\n\nA.5.32 Evaluación de seguridad de la información: La norma exige que la organización implemente procedimientos adecuados para asegurar el cumplimiento de los requisitos legales y contractuales relacionados con los derechos de propiedad intelectual.',
          recomendacion: 'Se recomienda a la organización regularizar de forma inmediata todas las licencias de software instaladas, garantizando que cada aplicación utilizada cuente con su licencia válida, vigente y debidamente documentada. Para ello, es necesario implementar un inventario centralizado de software, donde se registre el estado de cada licencia, su fecha de adquisición, vencimiento y responsable asignado. Se recomienda restringir la instalación de programas solo al personal autorizado del departamento de informática y habilitar mecanismos de control que impidan el uso de aplicaciones no aprobadas o sin licencia.'
        }
      ]
    },
    {
      id: 'roles_responsabilidades',
      nombre: 'Roles y Responsabilidades',
      riesgo: 'Alto',
      resultadoGeneral: 'Ausencia de una gestión adecuada de roles y políticas, causando incidentes de seguridad y uso inadecuado de activos.',
      resultadoGeneralPositivo: 'Definición, asignación y formalización clara de roles, mitigando incidentes de seguridad y promoviendo el uso correcto de activos.',
      hallazgosPredeterminados: [
        {
          campoAsociado: 'r6_1_resp_asignado', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'No todos los equipos (PCs o Laptops) tienen un responsable o dueño asignado.',
          efecto: 'La ausencia de un responsable asignado para cada estación de trabajo dificulta la rendición de cuentas sobre el uso y resguardo de los equipos. Esto puede ocasionar que incidentes de seguridad, daños, pérdidas de información o configuraciones no autorizadas no puedan ser atribuidos a una persona específica, retrasando la identificación de causas y la aplicación de medidas correctivas',
          criterio: 'A.5.2 Roles y responsabilidades de seguridad de la información: Este control establece que la estructura de seguridad de una empresa no funciona si la responsabilidad recae solo en "el departamento de sistemas".\n\nA.5.9 Inventario de información: Exige que cada uno de los activos de la organización debe tener un propietario o custodio designado encargado de decidir su uso y protección.',
          recomendacion: 'Se recomienda a la organización designar formalmente un responsable para cada estación de trabajo, asegurando que todos los activos físicos y lógicos cuenten con un propietario o custodio claramente identificado y comunicado. Esta designación debe quedar documentada y ser comunicada a los usuarios, de manera que exista claridad respecto a quién es el encargado de autorizar accesos, reportar incidentes, supervisar el uso adecuado del equipo y coordinar actividades de mantenimiento o actualización.'
        },
        {
          campoAsociado: 'r6_1_reconoce', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'El usuario (dueño) no reconoce sus responsabilidades de uso.',
          efecto: 'El desconocimiento de las responsabilidades asociadas al uso de los recursos tecnológicos puede provocar incumplimientos de las políticas de seguridad de la información y aumento de errores humanos que comprometan la confidencialidad de la información.',
          criterio: 'A.5.10 Uso aceptable de información y otros activos: La organización debe definir reglas para el uso aceptable de la tecnología.\n\nA.6.3 Concienciación, educación y capacitación: La norma exige que el personal reciba concienciación sobre la política de seguridad y los requisitos de su puesto.',
          recomendacion: 'Se recomienda implementar un programa formal de concienciación y capacitación en seguridad de la información, con el objetivo de garantizar que todos los usuarios comprendan claramente sus responsabilidades en el uso de los activos tecnológicos y de la información. Este programa debe incluir sesiones de inducción para nuevos usuarios y capacitaciones periódicas para el personal existente, abordando temas como el uso adecuado de los equipos, protección de credenciales, manejo de información sensible y reporte de incidentes de seguridad.'
        },
        {
          campoAsociado: 'r6_1_politicas', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'No existen políticas escritas sobre seguridad del equipo.',
          efecto: 'La ausencia de políticas escritas sobre seguridad de los equipos genera falta de estandarización en las prácticas de protección de los activos tecnológicos, provocando que cada usuario actúe según su propio criterio.',
          criterio: 'A.5.1 Políticas de seguridad de la información: Este control establece que la dirección de una organización debe definir un conjunto de políticas de seguridad, aprobarlas y comunicarlas formalmente a todos los empleados y partes interesadas relevantes (como proveedores o contratistas).',
          recomendacion: 'Se recomienda desarrollar, aprobar e implementar formalmente políticas de seguridad de la información relacionadas con el uso y protección de los equipos informáticos, estableciendo directrices claras sobre el manejo de las estaciones de trabajo, control de acceso, instalación de software, uso de dispositivos externos, protección de la información y reporte de incidentes de seguridad. \n\nEstas políticas deben ser documentadas por escrito, revisadas y aprobadas por la dirección de la organización, garantizando que reflejen las necesidades operativas y los riesgos asociados a los activos tecnológicos.'
        }
      ]
    },
    {
      id: 'seguridad_personal',
      nombre: 'Seguridad del Personal',
      riesgo: 'Medio',
      resultadoGeneral: 'Incumplimiento en cuanto a la formación del personal.',
      resultadoGeneralPositivo: 'Cumplimiento óptimo en los planes de formación y capacitación continua.',
      hallazgosPredeterminados: [
        {
          campoAsociado: 'r6_2_formacion', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Medio',
          hallazgo: 'Los usuarios (dueños) no recibieron formación en seguridad.',
          efecto: 'La falta de formación en seguridad de la información incrementa el riesgo de que los usuarios cometan errores que comprometan los activos tecnológicos y la información de la organización. Esto puede traducirse en prácticas inseguras, como el uso inadecuado de contraseñas, la apertura de archivos maliciosos, la divulgación accidental de información sensible o el incumplimiento de las políticas de seguridad establecidas',
          criterio: 'A.6.3 Concienciación, educación y capacitación en seguridad de la información: Exige que el personal reciba actualizaciones periódicas sobre la política de seguridad.\n\nA.5.10 Uso aceptable de información: Define reglas para el uso de activos.',
          recomendacion: 'Se recomienda diseñar e implementar un programa formal de capacitación y concienciación en seguridad de la información, dirigido a todos los responsables y usuarios de las estaciones de trabajo. Dicho programa debe abordar temas relacionados con el uso seguro de los equipos, protección de credenciales, identificación de amenazas informáticas, manejo adecuado de la información, prevención de malware, ingeniería social y procedimientos para el reporte de incidentes de seguridad.'
        },
        {
          campoAsociado: 'r6_2_acuerdo', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Medio',
          hallazgo: 'Los empleados (usuarios o dueños) no han firmado acuerdos de confidencialidad relacionados con el acceso y manejo de la información.',
          efecto: 'En caso de una fuga de información sensible o propiedad intelectual por parte de un empleado, la organización carece de un respaldo legal vinculante para sancionar al responsable, exigir responsabilidades o emprender acciones legales, quedando expuesta a daños reputacionales y pérdida de ventajas competitivas sin posibilidad de reclamación.',
          criterio: '• A.5.32 Evaluación de seguridad de la información: La norma exige que la organización implemente procedimientos adecuados para asegurar el cumplimiento de los requisitos legales, reglamentarios y contractuales relacionados con los derechos de propiedad intelectual y el uso de productos de software patentados.\n\n\tB. Protección Externa: Resguardar la propiedad intelectual propia, si tu organización desarrolla software, bases de datos, diseños técnicos, manuales o metodologías comerciales, el control exige protegerlos para que no sean robados por competidores o filtrados por los mismos empleados:\n\n\t\t▪ Acuerdos de Confidencialidad y Propiedad: Asegurar que en los contratos de trabajo de los empleados y en los acuerdos con proveedores de tecnología (como programadores externos) existan cláusulas que estipulen que todo el código o contenido creado para la empresa pertenece exclusivamente a la organización.',
          recomendacion: 'Se recomienda a la organización establecer e implementar de manera formal acuerdos de confidencialidad (NDA) para todos los empleados, contratistas, consultores y terceros que tengan acceso a información sensible, sistemas informáticos, documentación técnica o cualquier otro activo de información de la empresa. Estos acuerdos deben ser firmados antes de conceder acceso a los recursos organizacionales y deben permanecer vigentes durante la relación laboral y, cuando corresponda, después de su finalización.'
        }
      ]
    },
    {
      id: 'gestion_activos',
      nombre: 'Gestión de Activos',
      riesgo: 'Alto',
      resultadoGeneral: 'Deficiente gestión de los equipos de cómputo y clasificación.',
      resultadoGeneralPositivo: 'Gestión e inventario óptimo de los equipos de cómputo y clasificación rigurosa.',
      hallazgosPredeterminados: [
        {
          campoAsociado: 'r6_3_registrados', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'No todos los equipos (PCs, laptops, monitores, teclados, o ratones) están registrados en el inventario.',
          efecto: 'El problema es que la organización pierde visibilidad y control sobre sus activos tecnológicos, lo que impide rastrear software no autorizado, aplicar parches de seguridad críticos en esos equipos o detectar robos, aumentando drásticamente el riesgo de brechas de seguridad no monitoreadas y dificultando la respuesta ante incidentes.',
          criterio: 'A.5.9 Inventario de información: Exige que la organización identifique formalmente los sistemas y dispositivos de almacenamiento, y mantenga un inventario actualizado de ellos.',
          recomendacion: 'Se recomienda a la organización realizar un levantamiento completo de los activos tecnológicos, identificando y registrando todas las estaciones de trabajo, equipos portátiles, servidores, dispositivos de almacenamiento y demás recursos que procesen o almacenen información. Este inventario debe contener información relevante de cada activo, como identificación del equipo, ubicación física, usuario responsable, características técnicas, estado operativo y fecha de incorporación.'
        },
        {
          campoAsociado: 'r6_3_clasificados', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'Los datos no están clasificados por nivel de sensibilidad.',
          efecto: 'El problema es que la organización aplica los mismos controles de seguridad a toda la información por igual, lo que provoca que los datos altamente confidenciales queden desprotegidos y expuestos a accesos no autorizados o fugas, mientras que los datos públicos reciben una sobreprotección innecesaria que eleva los costos y dificulta la eficiencia operativa.',
          criterio: 'A.5.12 Clasificación de la información: El estándar exige que la organización establezca un esquema para clasificar sus datos en diferentes niveles.\n\nA.5.15 Control de acceso: Exige implementar una política de control basada en requisitos del negocio.',
          recomendacion: 'Se recomienda implementar de forma inmediata una política formal de clasificación de la información, que permita categorizar los datos según su nivel de sensibilidad, criticidad y valor para el negocio. Esta clasificación puede incluir niveles como información pública, interna, confidencial y altamente confidencial, de manera que se establezcan criterios claros para su tratamiento, almacenamiento, acceso y distribución. \n\nSe aconseja que dicha política esté acompañada de procedimientos operativos que definan cómo los usuarios deben etiquetar, manejar y proteger la información de acuerdo con su clasificación.'
        }
      ]
    },
    {
      id: 'control_acceso',
      nombre: 'Control de Acceso',
      riesgo: 'Muy Alto',
      resultadoGeneral: 'Ausencia de contraseñas seguras, cuentas individuales y privilegios mínimos.',
      resultadoGeneralPositivo: 'Implementación rigurosa de políticas de contraseñas y asignación de cuentas.',
      hallazgosPredeterminados: [
        {
          campoAsociado: 'r6_4_password', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'Los equipos (PCs o laptops) se encuentran desprotegidos al no contar con autenticación mediante contraseña.',
          efecto: 'Cualquier persona con acceso físico o remoto a las instalaciones puede ingresar libremente a los equipos, lo que permite la consulta, alteración o robo de información confidencial sin que quede un registro de quién cometió la acción.',
          criterio: 'A.5.15 Control de acceso: El estándar exige que la organización establezca, documente e implemente una política de control de acceso.',
          recomendacion: 'Se recomienda implementar de manera obligatoria mecanismos de control de acceso en todas las estaciones de trabajo, estableciendo contraseñas de usuario seguras como requisito mínimo para el inicio de sesión. Estas contraseñas deben cumplir con criterios de complejidad, incluyendo longitud adecuada, combinación de caracteres alfanuméricos y renovación periódica, con el fin de reducir el riesgo de accesos no autorizados.'
        },
        {
          campoAsociado: 'r6_4_password_fuerte', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'Las contraseñas de los equipos (PCs o laptops) son debiles, no cumplen con criterios de robustez ni diversidad.',
          efecto: 'Los sistemas quedan altamente vulnerables a ataques automatizados de fuerza bruta o adivinación simple, lo que permite a atacantes comprometer las cuentas en cuestión de minutos para robar información o desplegar malware.',
          criterio: 'A.5.16 Gestión de credenciales de autenticación: Exige un proceso estructurado para gestionar el ciclo de vida de las credenciales.\n\nA.5.17 Información de autenticación: Control mediante proceso formal.',
          recomendacion: 'Se recomienda establecer e implementar una política de gestión de contraseñas seguras, que obligue al uso de credenciales robustas en todas las estaciones de trabajo. Estas contraseñas deben cumplir con criterios mínimos de seguridad, tales como longitud adecuada, combinación de letras mayúsculas y minúsculas, números y caracteres especiales, así como la prohibición de contraseñas comunes o fácilmente predecibles.'
        },
        {
          campoAsociado: 'r6_4_bloqueo', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'Los equipos (PCs o Laptops) no cuentan con mecanismo de bloqueo automático por inactividad.',
          efecto: 'Si un usuario se ausenta de su puesto de trabajo dejando la sesión abierta, cualquier tercero malintencionado o personal no autorizado puede manipular el equipo directamente, accediendo a sistemas corporativos, alterando datos o enviando comunicaciones a nombre del usuario legítimo sin dejar rastro del verdadero perpetrador.',
          criterio: 'A.5.15 Control de acceso: La organización debe implementar una política de control de acceso.',
          recomendacion: 'Se recomienda a la organización configurar de manera obligatoria el bloqueo automático de sesión por inactividad en todas las estaciones de trabajo, estableciendo un tiempo de espera definido según el nivel de sensibilidad de la información manejada. Esta medida debe garantizar que, al no detectarse actividad del usuario durante un periodo determinado, el sistema bloquee automáticamente el acceso, solicitando autenticación para su reingreso.'
        },
        {
          campoAsociado: 'r6_4_cuenta_ind', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'Los equipos no cuentan con cuentas de usuario individuales (uso compartido).',
          efecto: 'Se pierde por completo el principio de no repudio y la trazabilidad de las acciones. Si se altera una configuración o se comete un fraude, es imposible identificar con certeza qué empleado fue el responsable.',
          criterio: 'A.5.15Control de acceso: El estándar exige que la organización establezca, documente e implemente una política de control de acceso basada en los requisitos del negocio y en la gestión de riesgos de seguridad de la información. \n\nA.5.16 Gestión de credenciales de autenticación: El estándar exige que la organización establezca un proceso estructurado para gestionar todo el ciclo de vida de las credenciales de autenticación, desde el momento en que un empleado ingresa a la empresa hasta que se retira o cambia de rol',
          recomendacion: 'Se recomienda implementar de forma inmediata un esquema de cuentas de usuario individuales para cada persona que utilice una estación de trabajo, eliminando progresivamente el uso de cuentas compartidas. Cada usuario debe contar con credenciales únicas que permitan identificar de manera precisa sus acciones dentro del sistema, garantizando así la trazabilidad, responsabilidad y control de los accesos.'
        },
        {
          campoAsociado: 'r6_4_priv_min', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'Los equipos no cuentan con configuración de privilegios mínimos para los usuarios.',
          efecto: 'Al operar todos los usuarios con permisos de administrador, cualquier empleado puede instalar software no autorizado, desactivar las defensas de seguridad o modificar configuraciones críticas del sistema; asimismo, si un equipo es infectado por malware o ransomware, este se ejecutará con máximos privilegios, propagándose rápidamente por toda la red de la organización y magnificando el impacto del ataque.',
          criterio: 'A.5.18 Derechos de acceso: La norma establece que los derechos de acceso a la información y otros activos asociados deben ser asignados, revisados, modificados y eliminados de acuerdo con la política de control de acceso de la organización y las necesidades específicas del negocio.',
          recomendacion: 'Se recomienda implementar de forma inmediata el principio de privilegio mínimo en todas las estaciones de trabajo y sistemas asociados, de manera que cada usuario únicamente disponga de los permisos estrictamente necesarios para desempeñar sus funciones laborales. Esto implica restringir el uso de cuentas con privilegios administrativos a casos justificados y debidamente autorizados por el área de Informática'
        }
      ]
    },
    {
      id: 'criptografia',
      nombre: 'Criptografía',
      riesgo: 'Muy Alto',
      resultadoGeneral: 'Falta de cifrado en discos, archivos y dispositivos externos.',
      resultadoGeneralPositivo: 'Implementación exhaustiva de políticas de cifrado robusto.',
      hallazgosPredeterminados: [
        {
          campoAsociado: 'r6_5_disco_cifrado', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'Los equipos no tienen el disco cifrado.',
          efecto: 'Ante un escenario de robo, pérdida o acceso físico no autorizado a los equipos de cómputo, un tercero puede extraer el disco duro e instalarlo en otra máquina o utilizar un sistema de arranque alterno para leer, copiar o modificar de manera directa toda la información confidencial de la organización, evadiendo por completo las contraseñas del sistema operativo.',
          criterio: 'A.8.24 Uso de criptografía: la norma establece que se deben implementa mecanismos criptográficos para proteger la confidencialidad e integridad de la información almacenada.\n\nA.8.12 Prevención de fuga de datos: La norma exige que se apliquen medidas de prevención de fuga de datos a los sistemas, redes y cualquier otro dispositivo que procese, almacene o transmita información confidencial.',
          recomendacion: 'Se recomienda implementar de manera obligatoria el cifrado completo de discos duros en todas las estaciones de trabajo y dispositivos que almacenen información institucional. Esta medida permite proteger la confidencialidad e integridad de los datos, asegurando que, en caso de pérdida, robo o acceso físico no autorizado del equipo, la información no pueda ser leída ni manipulada sin las credenciales correspondientes.'
        },
        {
          campoAsociado: 'r6_5_usb_cifrado', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'Los equipos (PCs o laptops) no cuentan con protocolos de restricción o cifrado para dispositivos USB.',
          efecto: 'La organización queda expuesta a una fuga masiva de información confidencial mediante la extracción descontrolada de datos en unidades de almacenamiento portátiles; asimismo, se incrementa drásticamente el riesgo de infecciones por malware o ransomware, ya que cualquier usuario puede introducir dispositivos externos contaminados que se ejecuten automáticamente y comprometan la integridad de toda la red local.',
          criterio: 'A.8.12 Prevención de fuga de datos: La norma exige que se apliquen medidas de prevención de fuga de datos a los sistemas, redes y cualquier otro dispositivo que procese, almacene o transmita información confidencial.\n\nA.8.7 Protección contra el malware: La norma exige que se implementen controles de detección, prevención y recuperación contra el malware, combinados con una concienciación adecuada de los usuarios.',
          recomendacion: 'Se recomienda establecer e implementar una política formal de control y restricción del uso de dispositivos USB y medios de almacenamiento externos, con el fin de evitar la transferencia no autorizada de información y reducir el riesgo de fuga de datos. Esta política debe definir claramente qué dispositivos están permitidos, en qué condiciones pueden utilizarse y qué niveles de autorización son necesarios para su conexión a las estaciones de trabajo. \n\nAsimismo, se aconseja aplicar controles técnicos como la deshabilitación de puertos USB no autorizados, el uso de listas blancas de dispositivos permitidos y la implementación de herramientas de cifrado obligatorio para aquellos dispositivos que sí estén autorizados.'
        },
        {
          campoAsociado: 'r6_5_arch_cifrados', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'Los equipos no cuentan con cifrado de archivos sensibles.',
          efecto: 'Si un atacante o un usuario no autorizado logra evadir las defensas perimetrales o del sistema operativo y accede al almacenamiento del equipo, podrá leer, copiar, modificar o filtrar la información confidencial de forma inmediata y en texto plano, lo que anula la última línea de defensa de los datos y genera un incumplimiento directo de las normativas de protección de datos.',
          criterio: 'A.8.24 Uso de criptografía: la norma establece que se deben implementar mecanismos criptográficos para proteger la confidencialidad e integridad de la información almacenada.\n\nA.8.12 Prevención de fuga de datos:  La norma exige que se apliquen medidas de prevención de fuga de datos a los sistemas, redes y cualquier otro dispositivo que procese, almacene o transmita información confidencial.',
          recomendacion: 'Se recomienda implementar de forma obligatoria mecanismos de cifrado a nivel de archivos o carpetas para toda aquella información clasificada como sensible, confidencial o crítica. Esta medida debe garantizar que los datos solo puedan ser accedidos por usuarios autorizados, incluso si el archivo es copiado, transferido o extraído del entorno original. Se aconseja establecer una política de clasificación de información vinculada al cifrado, de manera que los archivos sean identificados según su nivel de sensibilidad y se apliquen automáticamente los controles de protección correspondientes. Esto puede complementarse con herramientas de cifrado transparente o soluciones de gestión de derechos digitales (DRM), que permitan controlar el acceso, modificación y distribución de la información.'
        }
      ]
    },
    {
      id: 'seguridad_fisica_equipos',
      nombre: 'Seguridad física de Equipos',
      riesgo: 'Alto',
      resultadoGeneral: 'Condiciones de seguridad ineficaces y deficiencias en mecanismos antirrobo.',
      resultadoGeneralPositivo: 'Implementación estricta de condiciones de seguridad perimetral.',
      hallazgosPredeterminados: [
        {
          campoAsociado: 'r6_6_1_segura', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'El área donde se encuentran los equipos (PCs o laptops) no cuenta con condiciones de seguridad física adecuadas.',
          efecto: 'Los activos críticos de información quedan expuestos a accesos físicos no autorizados que permiten el robo de hardware, sabotajes directos o la manipulación de las conexiones de red; asimismo, la falta de controles ambientales (como sistemas contra incendios o climatización) aumenta el riesgo de pérdida total de los datos y la interrupción prolongada de las operaciones debido a daños por sobrecalentamiento o siniestros.',
          criterio: 'A.7.1 Perímetros de seguridad física: La norma exige que se definan y utilicen perímetros de seguridad para proteger las áreas que contienen información y activos de información críticos o sensibles.\n\nA.7.3 Aseguramiento de oficinas, salas e instalaciones: La norma exige que se diseñe e implemente la seguridad física para las oficinas, salas e instalaciones donde se almacena, procesa o maneja información sensible, basándose en la evaluación de riesgos de la organización.',
          recomendacion: 'Se recomienda a la organización establecer y reforzar un perímetro de seguridad física claramente definido para las áreas donde se encuentran las estaciones de trabajo y demás activos de información. Este perímetro debe delimitar los espacios críticos mediante controles físicos como puertas de acceso restringido, cerraduras de seguridad y señalización adecuada que indique las zonas autorizadas únicamente para personal pertinente. \n\nSe recomienda a su vez fortalecer la seguridad de las instalaciones mediante medidas de diseño y protección ambiental, como la reubicación de equipos en áreas seguras, la instalación de vigilancia y la reducción del acceso no supervisado a los espacios de trabajo.'
        },
        {
          campoAsociado: 'r6_6_1_acceso_ctrl', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'No existe control de acceso al espacio físico donde se encuentran los equipos.',
          efecto: 'Cualquier persona, sea personal ajeno al área, visitantes o terceros malintencionados, puede ingresar libremente al lugar sin dejar registro de su entrada, lo que facilita el robo de componentes de hardware, la desconexión intencional de cables de red, el sabotaje directo de los sistemas o la extracción física de datos confidenciales sin posibilidad de identificar al responsable.',
          criterio: 'A.7.2 Controles de acceso físico: La norma exige que las áreas protegidas estén resguardadas por controles de acceso adecuados para garantizar que solo se permita el ingreso a personal autorizado.',
          recomendacion: 'Se recomienda a la organización implementar de manera inmediata un sistema formal de control de acceso físico en las áreas donde se encuentran los equipos y activos de información. Este sistema debe garantizar que únicamente el personal autorizado pueda ingresar a dichas instalaciones, mediante mecanismos como credenciales de identificación, tarjetas de proximidad, cerraduras electrónicas o registros manuales de acceso.'
        },
        {
          campoAsociado: 'r6_6_1_mecanismos', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'No se evidencian mecanismos antirrobo en las áreas de equipos de cómputo.',
          efecto: 'La organización queda altamente expuesta a la pérdida material de sus activos tecnológicos debido a hurtos o saqueos facilitados por la falta de barreras físicas (como guayas de seguridad, anclajes o mobiliario con llave), lo que no solo genera un impacto económico directo por la reposición del hardware, sino también la pérdida irreversible de datos locales no respaldados y la interrupción prolongada de las operaciones del área afectada.',
          criterio: 'A.7.5 Protección contra las amenazas físicas y/o ambientales: La norma exige que se diseñe e implemente protección contra desastres naturales y amenazas físicas o ambientales en las áreas donde se ubiquen los activos de información, tomando en cuenta la ubicación geográfica y los riesgos del entorno.',
          recomendacion: 'Se recomienda a la organización implementar de manera inmediata mecanismos de protección física contra robo o sustracción de equipos, especialmente en aquellas áreas donde se encuentren activos de información críticos. Estas medidas pueden incluir el uso de candados de seguridad para equipos, anclajes físicos (cables de seguridad tipo Kensington), mobiliario reforzado y sistemas de fijación que dificulten el traslado no autorizado de los dispositivos. \n\nDe igual manera, se aconseja complementar estas medidas con la instalación de sistemas de videovigilancia (CCTV) en las áreas de trabajo,'
        }
      ]
    },
    {
      id: 'seguridad_fisica_infraestructura',
      nombre: 'Seguridad física de Infraestructura',
      riesgo: 'Muy Alto',
      resultadoGeneral: 'Infraestructura de servidores sin protección física ni ambiental.',
      resultadoGeneralPositivo: 'Buena implementación de controles, sistemas contra incendios y monitoreo ambiental.',
      hallazgosPredeterminados: [
        {
          campoAsociado: 'r6_6_2_acceso', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'No existe control de acceso al área dedicada para servidores.',
          efecto: 'El núcleo de la infraestructura tecnológica de la organización queda completamente vulnerable a sabotajes, apagados malintencionados o robos de discos duros por parte de cualquier persona que ingrese al lugar; asimismo, la falta de una barrera de acceso expone a la red interna a la conexión física de dispositivos espía (como keyloggers o enrutadores no autorizados), comprometiendo de forma irreversible la confidencialidad, integridad y continuidad absoluta de todo el negocio.',
          criterio: 'A.7.1 Perímetros de seguridad física: La norma exige que se definan y utilicen perímetros de seguridad para proteger las áreas que contienen información y activos de información críticos o sensibles. \n\nA.5.15 Control de acceso: El estándar exige que la organización establezca, documente e implemente una política de control de acceso basada en los requisitos del negocio y en la gestión de riesgos de seguridad de la información.',
          recomendacion: 'Se recomienda a la organización implementar de manera inmediata un sistema estricto de control de acceso físico para la sala de servidores, debido a la criticidad de los activos de información alojados en dicha infraestructura. Este control debe garantizar que únicamente el personal autorizado pueda ingresar al área, mediante mecanismos de autenticación física como tarjetas de acceso, cerraduras electrónicas, sistemas biométricos o combinación de credenciales. \n\nSe aconseja establecer un registro formal de entradas y salidas, donde quede documentado cada acceso al área de servidores, incluyendo fecha, hora, identidad del usuario y motivo de ingreso.'
        },
        {
          campoAsociado: 'r6_6_2_cctv', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'El área de servidores no cuenta con sistema de videovigilancia (CCTV).',
          efecto: 'En caso de ocurrir un incidente de seguridad, sabotaje, robo de componentes o acceso no autorizado dentro de la sala de servidores, la organización no dispondrá de evidencia visual ni registros cronológicos para realizar una investigación forense efectiva, lo que impide identificar a los responsables, determinar la magnitud exacta de la manipulación física de los sistemas y aplicar las sanciones o acciones legales correspondientes.',
          criterio: 'A.7.4 Monitoreo de la seguridad física: Las instalaciones deben ser monitoreadas continuamente.',
          recomendacion: 'Se recomienda a la organización implementar un sistema de videovigilancia (CCTV) en la sala de servidores y sus áreas de acceso, con el objetivo de garantizar el monitoreo continuo de la seguridad física de las instalaciones. Este sistema debe cubrir los puntos de entrada y salida, así como los espacios donde se encuentren ubicados los equipos críticos, permitiendo la detección oportuna de accesos no autorizados o actividades sospechosas.'
        },
        {
          campoAsociado: 'r6_6_2_ups', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'La sala de servidores no cuenta con respaldo de energía (UPS / Planta).',
          efecto: 'Ante cualquier fluctuación de voltaje o corte imprevisto del suministro eléctrico, los servidores se apagarán de forma abrupta, lo que provoca la interrupción inmediata y no planificada de todos los servicios digitales y operaciones de la empresa, además de generar un riesgo crítico de corrupción de bases de datos, pérdida irreversible de información en tránsito y daños de hardware físico por sobretensiones al retornar la energía.',
          criterio: 'A.7.3 Aseguramiento de oficinas, salas e instalaciones: La norma exige que se diseñe e implemente la seguridad física para las oficinas, salas e instalaciones donde se almacena, procesa o maneja información sensible, basándose en la evaluación de riesgos de la organización.',
          recomendacion: 'Se recomienda a la organización implementar de manera inmediata un sistema de respaldo de energía eléctrica (UPS y/o planta eléctrica) para la sala de servidores, con el objetivo de garantizar la continuidad operativa de la infraestructura tecnológica ante interrupciones del suministro eléctrico. \n\nEl sistema UPS debe dimensionarse adecuadamente para soportar la carga crítica de los equipos durante el tiempo necesario para el encendido de una planta eléctrica o para realizar un apagado controlado de los sistemas, evitando la pérdida de información o daños en los dispositivos.'
        },
        {
          campoAsociado: 'r6_6_2_sobretension', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'El área de servidores no cuenta con protección (protectores) contra sobretensiones.',
          efecto: 'Ante una descarga atmosférica, un rayo o un pico de voltaje imprevisto en la red pública, la energía residual impactará directamente las fuentes de poder de los servidores y equipos de comunicación, provocando la quema y destrucción física e inmediata de los componentes de hardware, lo que se traduce en altos costos de reposición, pérdida de datos almacenados localmente y un tiempo de inactividad operativa prolongado y catastrófico para la organización.',
          criterio: 'A.7.5 Protección contra las amenazas físicas y ambientales: La norma exige que se diseñe e implemente protección contra desastres naturales y amenazas físicas o ambientales en las áreas donde se ubiquen los activos de información, tomando en cuenta la ubicación geográfica y los riesgos del entorno.',
          recomendacion: 'Se recomienda a la organización implementar de manera inmediata sistemas de protección contra sobretensiones eléctricas, tales como reguladores de voltaje, supresores de picos y sistemas de acondicionamiento eléctrico, especialmente en la sala de servidores donde se encuentran los activos críticos de información. Estos mecanismos deben instalarse en la línea de alimentación principal de los equipos, garantizando la estabilidad del suministro eléctrico y evitando daños ocasionados por fluctuaciones de voltaje, descargas eléctricas o eventos atmosféricos.'
        },
        {
          campoAsociado: 'r6_6_2_aire', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Medio',
          hallazgo: 'El área no tiene aire acondicionado dedicado a los servidores.',
          efecto: 'La concentración de calor generada por el funcionamiento continuo de los equipos provocará un escenario de sobrecalentamiento térmico constante, lo que reduce drásticamente la vida útil del hardware, causa reinicios inesperados o apagados automáticos de emergencia por seguridad, y eleva críticamente el riesgo de fallas físicas permanentes o cortocircuitos que interrumpan la disponibilidad de los servicios de la organización.',
          criterio: 'A.7.3 Aseguramiento de oficinas, salas e instalaciones: La norma exige que se diseñe e implemente la seguridad física para las oficinas, salas e instalaciones donde se almacena, procesa o maneja información sensible, basándose en la evaluación de riesgos de la organización.',
          recomendacion: 'Se recomienda a la organización implementar un sistema de climatización dedicado para la sala de servidores, con el fin de mantener condiciones ambientales adecuadas para el funcionamiento continuo y seguro de los equipos tecnológicos. Este sistema debe estar diseñado específicamente para operar de forma constante, garantizando una temperatura estable que evite el sobrecalentamiento de los dispositivos; se aconseja que la solución de aire acondicionado sea independiente del sistema general de la institución, ya que los equipos de servidores requieren condiciones más estrictas de temperatura y ventilación que las áreas administrativas comunes. Esto contribuye a prolongar la vida útil del hardware y a reducir el riesgo de fallas por condiciones térmicas inadecuadas.'
        },
        {
          campoAsociado: 'r6_6_2_temp', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Medio',
          hallazgo: 'La sala de servidores no cuenta con monitoreo de temperatura ambiental.',
          efecto: 'Si el sistema de climatización principal es inexistente, la temperatura de la sala se elevará en algún momento de forma descontrolada sin que el personal técnico reciba una alerta temprana, lo que provocará el colapso térmico de los componentes, apagados de emergencia imprevistos que interrumpen los servicios y, en el peor de los casos, daños estructurales permanentes en el hardware por acumulación de calor extremo.',
          criterio: 'A.7.3 Aseguramiento de oficinas, salas e instalaciones: La norma exige que se diseñe e implemente la seguridad física para las oficinas, salas e instalaciones donde se almacena, procesa o maneja información sensible, basándose en la evaluación de riesgos de la organización.',
          recomendacion: 'Se recomienda implementar un sistema de monitoreo continuo de temperatura y humedad en la sala de servidores, con el objetivo de asegurar condiciones ambientales adecuadas para el correcto funcionamiento de la infraestructura tecnológica. Este sistema debe permitir la supervisión en tiempo real de las variaciones térmicas, así como la generación de alertas ante valores fuera de los rangos establecidos. Se recomienda también establecer procedimientos de revisión periódica de los registros de temperatura, a fin de identificar patrones de riesgo y aplicar medidas correctivas oportunas cuando sea necesario.'
        },
        {
          campoAsociado: 'r6_6_2_extintores', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Medio',
          hallazgo: 'La sala de servidores no cuenta con extintores vigentes o adecuados.',
          efecto: 'Ante el inicio de un conato de incendio o cortocircuito dentro del área, el personal no dispondrá de los medios correctos (como un extintor de CO2 o agente limpio) para sofocar el fuego de inmediato, lo que provocará la propagación rápida e incontrolable de las llamas, resultando en la pérdida total de la infraestructura de servidores, la destrucción irreversible de los datos de la organización y un peligro crítico para la integridad física del personal, además de un probable daño colateral a los equipos si se intenta apagar con agua o químicos inadecuados.',
          criterio: 'A.7.5 Protección contra las amenazas físicas y ambientales: La norma exige que se diseñe e implemente protección contra desastres naturales y amenazas físicas o ambientales en las áreas donde se ubiquen los activos de información, tomando en cuenta la ubicación geográfica y los riesgos del entorno. \n\n\tProtección contra Incendios (Fuego): Está estrictamente prohibido usar agua para apagar fuegos en equipos eléctricos activos. Se deben implementar sistemas basados en gases limpios',
          recomendacion: 'Se recomienda a la organización dotar de manera inmediata la sala de servidores con extintores adecuados, vigentes y certificados, específicamente diseñados para riesgos eléctricos, tales como extintores de CO2 (dióxido de carbono) o agentes limpios, evitando el uso de agua u otros agentes que puedan dañar gravemente los equipos en caso de incendio. \n\nSe tiene que establecer un plan de mantenimiento y verificación periódica de los extintores, garantizando que se encuentren dentro de su fecha de vigencia, correctamente ubicados, señalizados y en condiciones operativas óptimas para su uso en situaciones de emergencia.'
        }
      ]
    },
    {
      id: 'seguridad_operacional',
      nombre: 'Seguridad Operacional',
      riesgo: 'Alto',
      resultadoGeneral: 'Antivirus inexistente y sistemas desactualizados vulnerables a explotación.',
      resultadoGeneralPositivo: 'Sistemas con protección EDR centralizada y políticas de parcheo rigurosas.',
      hallazgosPredeterminados: [
        {
          campoAsociado: 'r6_7_antivirus', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'Los equipos (PCs o laptops) no cuentan con antivirus instalado.',
          efecto: 'Esas estaciones de trabajo se convierten en los puntos más débiles de la infraestructura, quedando totalmente vulnerables a la ejecución de código  malicioso, spyware, ransomware o troyanos; asimismo, al carecer de una barrera defensiva activa, estos equipos pueden ser utilizados como puentes por los atacantes para infectar de forma silenciosa el resto de las computadoras y servidores conectados a la red local.',
          criterio: 'A.8.7 Protección contra el malware: La norma exige que se implementen controles de detección, prevención y recuperación contra el malware, combinados con una concienciación adecuada de los usuarios. \n\nA.8.8 Gestión de vulnerabilidades técnicas: La norma exige que se obtenga información sobre las vulnerabilidades técnicas de los sistemas de información en uso de forma oportuna, se evalúe la exposición de la organización a estas vulnerabilidades y se tomen las medidas adecuadas para abordar el riesgo asociado.',
          recomendacion: 'Se recomienda a la organización implementar de manera inmediata una solución centralizada de antivirus en todas las estaciones de trabajo, garantizando que ningún equipo opere sin protección activa contra malware. Esta solución debe ser administrada de forma centralizada para asegurar su actualización constante, monitoreo en tiempo real y respuesta automática ante amenazas detectadas. Se deberían establecer políticas obligatorias que impidan la desinstalación o desactivación del antivirus por parte de los usuarios, asegurando así la integridad del sistema de protección en todos los equipos.'
        },
        {
          campoAsociado: 'r6_7_so_act', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Medio',
          hallazgo: 'El sistema operativo de los equipos se encuentra desactualizado.',
          efecto: 'Los equipos quedan expuestos a vulnerabilidades de seguridad conocidas y no corregidas, las cuales son explotadas activamente por atacantes para tomar el control remoto de los sistemas, desplegar malware o robar información confidencial sin necesidad de interacción del usuario; asimismo, la falta de actualizaciones provoca problemas de inestabilidad, incompatibilidad con software moderno y la pérdida del soporte técnico oficial del fabricante.',
          criterio: 'A.8.8 Gestión de vulnerabilidades técnicas: La norma exige que se obtenga información sobre las vulnerabilidades técnicas de los sistemas de información en uso de forma oportuna, se evalúe la exposición de la organización a estas vulnerabilidades y se tomen las medidas adecuadas para abordar el riesgo asociado. \n\nA.8.9 Gestión de la configuración: La norma exige que se establezcan, documenten, implementen, monitoreen y revisen las configuraciones de seguridad, incluidas las configuraciones por defecto, de los componentes de hardware, software, servicios y redes.',
          recomendacion: 'Se recomienda a la organización implementar un proceso formal de gestión de actualizaciones que garantice que todos los sistemas operativos de las estaciones de trabajo se mantengan en sus versiones más recientes y con los parches de seguridad aplicados oportunamente. Este proceso debe ser centralizado y supervisado por el área de TI, estableciendo frecuencias de actualización y validación de cumplimiento. \n\nAsimismo, se aconseja configurar políticas automáticas de actualización en los sistemas operativos, de manera que las correcciones de seguridad críticas se instalen sin intervención manual del usuario, reduciendo así la exposición a vulnerabilidades conocidas.'
        },
        {
          campoAsociado: 'r6_7_software_aut', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'El software instalado en los equipos no cuenta con licencias válidas o no está debidamente autorizado.',
          efecto: 'La organización queda expuesta a graves sanciones legales, multas económicas considerables y auditorías coercitivas por parte de los fabricantes debido a la violación de derechos de autor; asimismo, el uso de programas pirateados que incrementa drásticamente el riesgo de seguridad, ya que estos archivos suelen contener troyanos o malware oculto que compromete la red, al tiempo que priva a los usuarios de recibir actualizaciones críticas de seguridad y soporte técnico oficial.',
          criterio: 'A.5.31 Cumplimiento de requisitos legales y contractuales: La norma exige que todos los requisitos legales, estatutarios, regulatorios y contractuales relevantes para la seguridad de la información, así como el enfoque de la organización para cumplirlos, deben estar explícitamente identificados, documentados y mantenerse actualizados. \n\nA.5.32 Evaluación de seguridad de la información: La norma exige que la organización implemente procedimientos adecuados para asegurar el cumplimiento de los requisitos legales, reglamentarios y contractuales relacionados con los derechos de propiedad intelectual y el uso de productos de software patentados. \n\n\tA. Protección Interna: No infringir derechos de terceros (Evitar Software Pirata)',
          recomendacion: 'Se recomienda a la organización implementar de manera inmediata un proceso formal de gestión de licenciamiento de software, que permita identificar, documentar y controlar todos los programas instalados en los equipos de la institución, asegurando que cada uno cuente con su respectiva licencia válida y vigente. \n\nSe recomienda establecer mecanismos de control que impidan la instalación de software no autorizado por parte de los usuarios, mediante restricciones de permisos y el uso de listas blancas de aplicaciones aprobadas por el área de Informática.'
        }
      ]
    },
    {
      id: 'gestion_backups',
      nombre: 'Gestión de Backups',
      riesgo: 'Medio',
      resultadoGeneral: 'Ausencia de políticas y aplicación de respaldos causando posible pérdida de información.',
      resultadoGeneralPositivo: 'Aplicación eficaz de respaldos periódicos y probados (Regla 3-2-1).',
      hallazgosPredeterminados: [
        {
          campoAsociado: 'r6_7_1_politica', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'El área no cuenta con una política formal de respaldos de información.',
          efecto: 'La generación de copias de seguridad queda sujeta a la improvisación o al criterio individual del personal, lo que da lugar a respaldos incompletos, inconsistentes o inexistentes; esto deja una situación de vulnerabilidad extrema al no garantizar la frecuencia, el almacenamiento seguro ni las pruebas de recuperación necesarias.',
          criterio: 'A.8.13 Copia de seguridad de la información: La norma exige que se mantengan copias de seguridad de la información, el software y las imágenes de los sistemas, y que estas se prueben periódicamente de acuerdo con la política de copias de seguridad definida.',
          recomendacion: 'Se recomienda a la organización desarrollar, aprobar e implementar una política formal de copias de seguridad gque establezca los lineamientos para la protección, almacenamiento y recuperación de la información institucional. Esta política debe definir claramente qué información debe respaldarse, la frecuencia de los respaldos, los responsables del proceso, los medios de almacenamiento utilizados y los tiempos de retención de las copias. \n\nSe aconseja que los respaldos sean realizados de forma periódica y automatizada cuando sea posible, garantizando la protección de la información crítica frente a incidentes como fallas de hardware, errores humanos, ataques informáticos, corrupción de datos o desastres físicos.'
        },
        {
          campoAsociado: 'r6_7_1_conocen', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'Los usuarios desconocen las políticas de respaldo de información establecidas.',
          efecto: 'Aunque la organización cuente con normativas diseñadas, estas se vuelven completamente ineficaces si en la práctica los empleados omiten el respaldo de sus archivos críticos, almacenen información valiosa únicamente en discos locales expuestos a fallas, o utilicen métodos y plataformas de almacenamiento en la nube no autorizados.',
          criterio: 'A.6.3 Concienciación, educación y capacitación en seguridad de la información: La norma exige que el personal de la organización reciba concienciación, educación y capacitación apropiadas, junto con actualizaciones periódicas sobre la política de seguridad de la información y los requisitos específicos de su puesto. \n\nA.6.9 Información sobre eventos de seguridad de la información: La norma exige que se definan e implementen políticas y medidas de seguridad específicas para mitigar los riesgos asociados con el uso de dispositivos de usuario final que acceden, procesan o almacenan información de la organización.',
          recomendacion: 'Se recomienda a la organización desarrollar un programa de divulgación, capacitación y concienciación orientado a garantizar que todos los usuarios conozcan las políticas y procedimientos relacionados con las copias de seguridad de la información. Estas actividades deben explicar la importancia de los respaldos, las responsabilidades de cada usuario y los procedimientos a seguir para proteger la información institucional. \n\nAsimismo, se aconseja que las políticas de respaldo sean comunicadas formalmente mediante manuales, procedimientos, correos institucionales, sesiones de capacitación y otros mecanismos internos que permitan asegurar su comprensión y aplicación por parte del personal.'
        },
        {
          campoAsociado: 'r6_7_1_aplica', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'Las políticas de respaldo no se aplican en las estaciones auditadas.',
          efecto: 'La falta de aplicación operativa de estas directrices anula por completo la efectividad de la estrategia de seguridad de la organización, dejando a las estaciones de trabajo desprotegidas ante cualquier eventualidad; esto significa que, ante un borrado accidental, un fallo físico del disco duro o una infección por malware.',
          criterio: 'A.8.13 Copia de seguridad de la información: La norma exige que se mantengan copias de seguridad de la información, el software y las imágenes de los sistemas, y que estas se prueben periódicamente de acuerdo con la política de copias de seguridad definida.',
          recomendacion: 'Se recomienda a la organización garantizar la implementación efectiva de las políticas de respaldo en todas las estaciones de trabajo auditadas, asegurando que los procedimientos definidos no permanezcan únicamente documentados, sino que sean ejecutados de manera consistente y verificable en cada equipo que procese o almacene información institucional. \n\nSe aconseja establecer mecanismos de supervisión y control que permitan verificar periódicamente la realización de los respaldos, incluyendo revisiones técnicas, auditorías internas y registros de ejecución que evidencien el cumplimiento de la política establecida.'
        },
        {
          campoAsociado: 'r6_7_1_pruebas', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Medio',
          hallazgo: 'No se realizan pruebas de restauración de los respaldos periódicamente.',
          efecto: 'La falta de aplicación operativa de estas directrices anula por completo la efectividad de la estrategia de seguridad de la organización, dejando a las estaciones de trabajo desprotegidas ante cualquier eventualidad; esto significa que, ante un borrado accidental, un fallo físico del disco duro o una infección por malware.',
          criterio: 'A.8.13 Copia de seguridad de la información: La norma exige que se mantengan copias de seguridad de la información, el software y las imágenes de los sistemas, y que estas se prueben periódicamente de acuerdo con la política de copias de seguridad definida.',
          recomendacion: 'Se recomienda a la organización garantizar la implementación efectiva de las políticas de respaldo en todas las estaciones de trabajo auditadas, asegurando que los procedimientos definidos no permanezcan únicamente documentados, sino que sean ejecutados de manera consistente y verificable en cada equipo que procese o almacene información institucional. \n\nSe aconseja establecer mecanismos de supervisión y control que permitan verificar periódicamente la realización de los respaldos, incluyendo revisiones técnicas, auditorías internas y registros de ejecución que evidencien el cumplimiento de la política establecida.'
        }
      ]
    },
    {
      id: 'seguridad_comunicaciones',
      nombre: 'Seguridad en las comunicaciones',
      riesgo: 'Muy Alto',
      resultadoGeneral: 'Inexistencia de redes seguras o firewalls exponiendo el tráfico corporativo.',
      resultadoGeneralPositivo: 'Implementación eficaz de arquitecturas de red segmentadas, firewalls y VPNs.',
      hallazgosPredeterminados: [
        {
          campoAsociado: 'r6_8_red_segura', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'La organización no utiliza una red segura para la transmisión de información.',
          efecto: 'Todos los datos y credenciales viajan expuestos a través de la infraestructura, permitiendo que un atacante intercepte el tráfico mediante técnicas de escucha.',
          criterio: 'A.8.20 Seguridad de redes: Las redes deben estar diseñadas, gestionadas y protegidas para evitar accesos no autorizados.',
          recomendacion: 'Se recomienda a la organización implementar una arquitectura de red segura, diseñada para proteger la información institucional frente a accesos no autorizados, ataques informáticos y posibles interceptaciones de datos. Para ello, es necesario realizar una evaluación de la infraestructura actual con el fin de identificar vulnerabilidades y aplicar las medidas de protección correspondientes. Establecer mecanismos de segmentación de red que permitan separar los recursos críticos de las áreas de acceso general, reduciendo la posibilidad de que una amenaza se propague a través de toda la infraestructura tecnológica. Esta segmentación debe complementarse con controles de acceso adecuados y monitoreo constante del tráfico de red.'
        },
        {
          campoAsociado: 'r6_8_firewall', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'Los equipos auditados no cuentan con un firewall activo.',
          efecto: 'Las estaciones de trabajo quedan desprovistas de su primera línea de defensa a nivel de red, permitiendo que cualquier puerto de comunicación permanezca expuesto y sin filtrado; esto facilita que un atacante dentro de la red local realice escaneos de puertos exitosos, explote servicios vulnerables para acceder de forma remota a los equipos.',
          criterio: 'A.8.20 Seguridad de redes: Las redes deben estar diseñadas, gestionadas y protegidas para evitar accesos no autorizados.',
          recomendacion: 'Se recomienda a la organización habilitar e implementar de manera inmediata firewalls en todas las estaciones de trabajo y dispositivos que formen parte de la infraestructura tecnológica, con el fin de controlar y monitorear el tráfico de red entrante y saliente, reduciendo el riesgo de accesos no autorizados, ataques externos y propagación de amenazas informáticas. Se sugiere configurar reglas de seguridad adecuadas según las necesidades operativas de la organización, permitiendo únicamente las conexiones y servicios estrictamente necesarios para el desempeño de las actividades laborales.'
        },
        {
          campoAsociado: 'r6_8_vpn', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Muy Alto',
          hallazgo: 'Los equipos no disponen de acceso mediante VPN para conexiones remotas seguras.',
          efecto: 'Si los usuarios necesitan acceder a los recursos internos de la organización desde redes externas sin cifrado adecuado; facilitará que atacantes intercepten las credenciales de acceso, realicen ataques de fuerza bruta contra los puertos expuestos y logren infiltrarse en la red corporativa.',
          criterio: 'A.8.21 Seguridad de los servicios de red: La norma exige que los mecanismos de seguridad, los niveles de servicio y los requisitos de gestión de todos los servicios de red se identifiquen, implementen y monitoreen.',
          recomendacion: 'Se recomienda a la organización implementar una solución de Red Privada Virtual (VPN) que permita a los usuarios autorizados acceder de forma segura a los recursos institucionales cuando se conecten desde ubicaciones externas a la red corporativa. Se sugiere que el acceso mediante VPN esté restringido únicamente al personal autorizado y que se complemente con mecanismos de autenticación seguros, preferiblemente mediante autenticación multifactor (MFA), con el fin de reducir el riesgo de accesos no autorizados.'
        },
        {
          campoAsociado: 'r6_8_cifrado', seccion: 6, valoresInseguros: ['no'], nivel_riesgo: 'Alto',
          hallazgo: 'La red y los servicios utilizados no emplean conexiones cifradas (HTTPS).',
          efecto: 'Todas las interacciones con los sistemas web, el envío de formularios y los inicios de sesión se realizan a través del protocolo HTTP en texto plano, lo que permite que cualquier atacante posicionado en la red pueda capturar fácilmente contraseñas, tokens de sesión y datos confidenciales mediante técnicas de escucha de tráfico.',
          criterio: 'A.8.24 Uso de criptografía: La norma exige que se establezca e implemente una política sobre el uso de controles criptográficos para la protección de la información.',
          recomendacion: 'Se recomienda implementar el uso obligatorio de protocolos seguros de comunicación basados en HTTPS (HyperText Transfer Protocol Secure) para todos los servicios web, aplicaciones internas, portales institucionales y sistemas que transmitan información a través de la red. Esta medida permitirá proteger la confidencialidad e integridad de los datos durante su transmisión entre usuarios y servidores.'
        }
      ]
    }
  ]
}

export function evaluarAuditoria(datosWizard) {
  const resultadosPorArea = []
  const hallazgosGenerados = []

  reglasAuditoria.evaluacionPorArea.forEach((area) => {
    let esConforme = true
    let mayorRiesgo = 'bajo'
    const nivelesRiesgo = { 'bajo': 1, 'medio': 2, 'alto': 3, 'muy alto': 4 }

    // Evaluamos específicamente cada hallazgo mapeado en la zona
    area.hallazgosPredeterminados.forEach((h) => {
      const datosSeccion = datosWizard[h.seccion] || {}
      const valorRespuesta = datosSeccion[h.campoAsociado]

      if (valorRespuesta && h.valoresInseguros.includes(valorRespuesta)) {
        esConforme = false
        
        // Registrar el hallazgo individualmente con TODO el texto detallado
        hallazgosGenerados.push({
          area: area.nombre,
          nivel_riesgo: h.nivel_riesgo.toLowerCase(),
          problema: h.hallazgo,
          criterio: h.criterio,
          efecto: h.efecto,
          recomendacion: h.recomendacion
        })

        // Calcular cuál es el riesgo tope para catalogar el Área General
        const riesgoActual = h.nivel_riesgo.toLowerCase()
        if (nivelesRiesgo[riesgoActual] > (nivelesRiesgo[mayorRiesgo] || 0)) {
          mayorRiesgo = riesgoActual
        }
      }
    })

    resultadosPorArea.push({
      id: area.id,
      nombre: area.nombre,
      conforme: esConforme,
      riesgo: esConforme ? 'En cumplimiento' : (mayorRiesgo !== 'bajo' ? mayorRiesgo : area.riesgo.toLowerCase()),
      resultadoGeneral: esConforme ? area.resultadoGeneralPositivo : area.resultadoGeneral
    })
  })

  // Generar Conclusiones
  const estadoFisicoConforme = resultadosPorArea.find((a) => a.id === 'estado_fisico')?.conforme ?? true
  const conclusionObj1 = estadoFisicoConforme ? reglasAuditoria.conclusionesPredefinidas.obj1.positiva : reglasAuditoria.conclusionesPredefinidas.obj1.negativa

  const activosConforme = resultadosPorArea.find((a) => a.id === 'gestion_activos')?.conforme ?? true
  const backupsConforme = resultadosPorArea.find((a) => a.id === 'gestion_backups')?.conforme ?? true
  const conclusionObj2 = activosConforme && backupsConforme ? reglasAuditoria.conclusionesPredefinidas.obj2.positiva : reglasAuditoria.conclusionesPredefinidas.obj2.negativa

  const sfEqConforme = resultadosPorArea.find((a) => a.id === 'seguridad_fisica_equipos')?.conforme ?? true
  const sfInfraConforme = resultadosPorArea.find((a) => a.id === 'seguridad_fisica_infraestructura')?.conforme ?? true
  const soConforme = resultadosPorArea.find((a) => a.id === 'seguridad_operacional')?.conforme ?? true
  const conclusionObj3 = sfEqConforme && sfInfraConforme && soConforme ? reglasAuditoria.conclusionesPredefinidas.obj3.positiva : reglasAuditoria.conclusionesPredefinidas.obj3.negativa

  return {
    resultadosPorArea,
    hallazgosGenerados,
    conclusionesSugeridas: [conclusionObj1, conclusionObj2, conclusionObj3]
  }
}