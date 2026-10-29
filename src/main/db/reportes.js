import { getDb } from './init.js'

export function getHistorialPredictivo(auditorId, isAdmin) {
  const db = getDb()
  const auditorias = isAdmin
    ? db.prepare('SELECT organizacion, area FROM auditorias').all()
    : db.prepare('SELECT organizacion, area FROM auditorias WHERE auditor_id = ?').all(auditorId)
  const organizaciones = [...new Set(auditorias.map((a) => a.organizacion).filter(Boolean))]
  const areas = [...new Set(auditorias.map((a) => a.area).filter(Boolean))]
  return { organizaciones, areas }
}

export function getMetricasGlobales(auditorId, isAdmin) {
  const db = getDb()
  const auditorias = isAdmin
    ? db.prepare('SELECT * FROM auditorias').all()
    : db.prepare('SELECT * FROM auditorias WHERE auditor_id = ?').all(auditorId)

  const stats = {
    totalAuditorias: auditorias.length,
    auditoriasPorMes: [],
    equiposSanos: 0,
    equiposDanados: 0,
    topSistemasOperativos: {}
  }

  const meses = {}
  auditorias.forEach((a) => {
    const mes = (a.fecha_inicio || '').substring(0, 7)
    if (mes) meses[mes] = (meses[mes] || 0) + 1
  })
  stats.auditoriasPorMes = Object.keys(meses)
    .map((m) => ({ mes: m, cantidad: meses[m] }))
    .sort((a, b) => a.mes.localeCompare(b.mes))

  let secciones
  if (isAdmin) {
    secciones = db
      .prepare(
        `SELECT s.auditoria_id, s.seccion, s.datos FROM secciones_data s JOIN auditorias a ON s.auditoria_id = a.id WHERE s.seccion IN (2,3)`
      )
      .all()
  } else {
    secciones = db
      .prepare(
        `SELECT s.auditoria_id, s.seccion, s.datos FROM secciones_data s JOIN auditorias a ON s.auditoria_id = a.id WHERE a.auditor_id = ? AND s.seccion IN (2,3)`
      )
      .all(auditorId)
  }

  secciones.forEach((row) => {
    try {
      const data = JSON.parse(row.datos)
      if (row.seccion === 2 && data.sistemasOperativos) {
        const soList = data.sistemasOperativos
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
        soList.forEach((so) => {
          stats.topSistemasOperativos[so] = (stats.topSistemasOperativos[so] || 0) + 1
        })
      } else if (row.seccion === 3) {
        const totalParams = secciones.find(
          (s) => s.auditoria_id === row.auditoria_id && s.seccion === 2
        )
        let total = totalParams ? parseInt(JSON.parse(totalParams.datos).totalEquipos) || 0 : 0
        const danados = parseInt(data.cantidadDanos) || 0
        stats.equiposDanados += danados
        if (total > danados) stats.equiposSanos += total - danados
      }
    } catch (e) {}
  })

  stats.topSistemasOperativos = Object.keys(stats.topSistemasOperativos)
    .map((key) => ({ nombre: key, cantidad: stats.topSistemasOperativos[key] }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5)

  return stats
}

export function generateCsvData(auditorId, isAdmin) {
  const db = getDb()
  const auditorias = isAdmin
    ? db.prepare('SELECT a.id, a.titulo, a.organizacion, a.area, a.estado FROM auditorias a').all()
    : db
        .prepare(
          'SELECT a.id, a.titulo, a.organizacion, a.area, a.estado FROM auditorias a WHERE a.auditor_id = ?'
        )
        .all(auditorId)
  let csv =
    'ID,Titulo,Organizacion,Area,Estado,Total Equipos,Tipo Equipo,SO,RAM,Procesador,Danos Reportados\n'

  for (const a of auditorias) {
    const s3 = db
      .prepare('SELECT datos FROM secciones_data WHERE auditoria_id = ? AND seccion = 3')
      .get(a.id)
    const s4 = db
      .prepare('SELECT datos FROM secciones_data WHERE auditoria_id = ? AND seccion = 4')
      .get(a.id)

    let d3 = {},
      d4 = {}
    if (s3)
      try {
        d3 = JSON.parse(s3.datos)
      } catch (e) {}
    if (s4)
      try {
        d4 = JSON.parse(s4.datos)
      } catch (e) {}

    const ram = Array.isArray(d3.ram) ? d3.ram.join('; ') : d3.ram || ''
    const proc = Array.isArray(d3.procesador) ? d3.procesador.join('; ') : d3.procesador || ''

    csv += `"${a.id}","${a.titulo}","${a.organizacion}","${a.area}","${a.estado}","${d3.totalEquipos || 0}","${d3.tipoEquipo || ''}","${d3.sistemasOperativos || ''}","${ram}","${proc}","${d4.cantidadDanos || 0}"\n`
  }
  return csv
}

export function generateExcelData(auditorId, isAdmin) {
  const db = getDb()
  const auditorias = isAdmin
    ? db
        .prepare(
          `SELECT a.*, u.nombre as auditor_nombre_usr FROM auditorias a LEFT JOIN usuarios u ON a.auditor_id = u.id ORDER BY a.fecha_inicio DESC`
        )
        .all()
    : db
        .prepare(
          `SELECT a.*, u.nombre as auditor_nombre_usr FROM auditorias a LEFT JOIN usuarios u ON a.auditor_id = u.id WHERE a.auditor_id = ? ORDER BY a.fecha_inicio DESC`
        )
        .all(auditorId)

  const rows = []
  for (const a of auditorias) {
    const secciones = db
      .prepare('SELECT seccion, datos FROM secciones_data WHERE auditoria_id = ? ORDER BY seccion')
      .all(a.id)
    const seccionesData = {}
    for (const s of secciones) {
      try {
        seccionesData[s.seccion] = JSON.parse(s.datos)
      } catch (e) {}
    }

    const d1 = seccionesData[1] || {},
      d2 = seccionesData[2] || {},
      d3 = seccionesData[3] || {},
      d4 = seccionesData[4] || {}
    const d5 = seccionesData[5] || {},
      d6 = seccionesData[6] || {},
      d7 = seccionesData[7] || {},
      d8 = seccionesData[8] || {}

    const ram = Array.isArray(d3.ram) ? d3.ram.join('; ') : d3.ram || ''
    const proc = Array.isArray(d3.procesador) ? d3.procesador.join('; ') : d3.procesador || ''
    const equiposDanadosList = (d4.equiposDanados || [])
      .map((eq, i) => `Equipo #${i + 1}: ${eq.descripcion || 'Sin descripción'}`)
      .join('\n')
    const hallazgosList = (d7.hallazgos || [])
      .map((h, i) => `Hallazgo #${i + 1} (${h.nivel_riesgo || 'N/A'}): ${h.problema || ''}`)
      .join('\n')
    const objetivosList = (d2.objetivos || []).join('\n')
    const conclusionesList = (d8.conclusiones || []).join('\n')

    rows.push({
      titulo: a.titulo,
      organizacion: d1.organizacion || '',
      area: d1.area || '',
      auditor: d1.auditor || '',
      estado: a.estado || '',
      fecha_programada: a.fecha_programada || '',
      fecha_inicio: a.fecha_inicio || '',
      fecha_completada: a.fecha_completada || '',
      total_equipos: d3.totalEquipos || '',
      tipo_equipo: d3.tipoEquipo || '',
      sistemas_operativos: d3.sistemasOperativos || '',
      disco_duro: d3.discoDuro || '',
      ram: ram,
      procesador: proc,
      equipos_danados: d4.tieneDanos === 'si' ? 'Sí' : 'No',
      cantidad_danados: d4.cantidadDanos || '',
      detalle_danos: equiposDanadosList,
      observaciones_fisicas: d4.observacionesGenerales || '',
      programas_instalados: d5.programasInstalados || '',
      licencias_validas: d5.tieneLicencias || '',
      detalle_licencias: d5.licenciasDetalle || '',
      r6_1_resp_asignado: d6.r6_1_resp_asignado || '',
      r6_1_reconoce: d6.r6_1_reconoce || '',
      r6_1_politicas: d6.r6_1_politicas || '',
      r6_2_formacion: d6.r6_2_formacion || '',
      r6_2_acuerdo: d6.r6_2_acuerdo || '',
      r6_3_registrados: d6.r6_3_registrados || '',
      r6_3_dueno: d6.r6_3_dueno || '',
      r6_3_clasificados: d6.r6_3_clasificados || '',
      r6_4_password: d6.r6_4_password || '',
      r6_4_password_fuerte: d6.r6_4_password_fuerte || '',
      r6_4_bloqueo: d6.r6_4_bloqueo || '',
      r6_4_cuenta_ind: d6.r6_4_cuenta_ind || '',
      r6_4_priv_min: d6.r6_4_priv_min || '',
      r6_5_disco_cifrado: d6.r6_5_disco_cifrado || '',
      r6_5_usb_cifrado: d6.r6_5_usb_cifrado || '',
      r6_5_arch_cifrados: d6.r6_5_arch_cifrados || '',
      hallazgos: hallazgosList,
      objetivos: objetivosList,
      conclusiones: conclusionesList,
      recomendaciones: d8.recomendaciones || ''
    })
  }
  return rows
}
