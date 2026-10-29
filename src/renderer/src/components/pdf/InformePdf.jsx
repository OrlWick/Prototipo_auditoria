import React from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { pdfStyles } from './pdfStyles'
import { 
  capitalize, riskColorFor, objetivoGeneral, alcancesPredeterminados, 
  buildInventarioRows, buildResumen 
} from './pdfUtils'
import { evaluarAuditoria } from '../../config/reglasAuditoria'

function Footer({ now }) {
  return (
    <View style={pdfStyles.footer} fixed>
      <Text style={pdfStyles.footerText}>AuditTech — Informe generado el {now}</Text>
      <Text style={pdfStyles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
    </View>
  )
}

function FindingBlock({ h, org }) {
  const color = riskColorFor(h.nivel_riesgo)
  return (
    <View style={pdfStyles.findingBlock}>
      <View style={pdfStyles.findingHeader}>
        <View style={{ flex: 1 }}>
          <Text style={pdfStyles.findingEmpresa}>Empresa: {org || '—'}</Text>
          <Text style={pdfStyles.findingArea}>Área Auditada: {h.area}</Text>
        </View>
        <Text style={[pdfStyles.findingRisk, { backgroundColor: color }]}>Riesgo {h.nivel_riesgo?.toUpperCase()}</Text>
      </View>
      <View style={pdfStyles.findingField}><Text style={pdfStyles.findingFieldLabel}>Problema</Text><Text style={pdfStyles.findingFieldValue}>{h.problema}</Text></View>
      <View style={pdfStyles.findingField}><Text style={pdfStyles.findingFieldLabel}>Criterio</Text><Text style={pdfStyles.findingFieldValue}>{h.criterio}</Text></View>
      <View style={pdfStyles.findingField}><Text style={pdfStyles.findingFieldLabel}>Efecto</Text><Text style={pdfStyles.findingFieldValue}>{h.efecto}</Text></View>
      <View style={pdfStyles.findingField}><Text style={pdfStyles.findingFieldLabel}>Recomendación</Text><Text style={pdfStyles.findingFieldValue}>{h.recomendacion}</Text></View>
    </View>
  )
}

export function InformePDF({ datos, auditoria, auditorNombre }) {
  const d1 = datos[1] || {}
  const d2 = datos[2] || {}
  const d3 = datos[3] || {}
  const d8 = datos[8] || {}
  const objetivos = d2.objetivos || []

  const evaluacion = evaluarAuditoria(datos)
  const resultadosPorArea = evaluacion.resultadosPorArea || []
  const hallazgos = evaluacion.hallazgosGenerados || []
  const conclusionesFinal = Array.isArray(d8.conclusiones) && d8.conclusiones.some((c) => c && c.trim()) ? d8.conclusiones : (evaluacion.conclusionesSugeridas || [])

  const muyAlto = hallazgos.filter((h) => h.nivel_riesgo === 'muy alto').length
  const alto = hallazgos.filter((h) => h.nivel_riesgo === 'alto').length
  const medio = hallazgos.filter((h) => h.nivel_riesgo === 'medio').length
  const enCumplimiento = resultadosPorArea.filter((a) => a.conforme).length
  const totalAreas = resultadosPorArea.length

  const invRows = buildInventarioRows(d3)
  const now = format(new Date(), "dd/MM/yyyy 'a las' HH:mm", { locale: es })
  const fechaInicio = auditoria?.fecha_inicio ? format(new Date(auditoria.fecha_inicio), "d 'de' MMMM 'del' yyyy", { locale: es }) : d1.fechaProgramada ? format(new Date(d1.fechaProgramada), "d 'de' MMMM 'del' yyyy", { locale: es }) : 'No disponible'
  const fechaPresentacion = capitalize(format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es }))
  const organizacion = d1.organizacion || auditoria?.organizacion || '—'

  const findingPages = []
  for (let i = 0; i < hallazgos.length; i += 2) findingPages.push(hallazgos.slice(i, i + 2))

  return (
    <Document title={`Informe Auditoría - ${organizacion}`} author={auditorNombre}>
      {/* ═══ PÁGINA 1: PORTADA ═══ */}
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.portadaDate}>{fechaPresentacion}</Text>
        <Text style={pdfStyles.portadaTitle}>INFORME FINAL AUDITORÍA INFORMÁTICA</Text>
        <View style={pdfStyles.idBlock}>
          <View style={pdfStyles.idRow}><Text style={pdfStyles.idLabel}>1. Identificación del Cliente:</Text><Text style={pdfStyles.idValue}>{organizacion}</Text></View>
          <View style={pdfStyles.idRow}><Text style={pdfStyles.idLabel}>2. Identificación del Área auditada:</Text><Text style={pdfStyles.idValue}>{d1.area || '—'}</Text></View>
          <View style={pdfStyles.idRow}><Text style={pdfStyles.idLabel}>3. Fecha de Iniciación:</Text><Text style={pdfStyles.idValue}>{fechaInicio}</Text></View>
          <View style={pdfStyles.idRow}><Text style={pdfStyles.idLabel}>4. Fecha de Presentación del Informe:</Text><Text style={pdfStyles.idValue}>{fechaPresentacion}</Text></View>
          <View style={pdfStyles.idRow}><Text style={pdfStyles.idLabel}>5. Jefe Auditor:</Text><Text style={pdfStyles.idValue}>{d1.auditor || auditorNombre}</Text></View>
        </View>
        <Text style={pdfStyles.sectionTitleDark}>OBJETIVOS</Text>
        <Text style={pdfStyles.listText}>General</Text>
        <Text style={[pdfStyles.textBlock, { marginLeft: 16 }]}>{objetivoGeneral}</Text>
        <Text style={[pdfStyles.listText, { marginTop: 8 }]}>Específicos</Text>
        {objetivos.map((obj, i) => (<View key={i} style={[pdfStyles.listItem, { marginLeft: 16 }]}><Text style={pdfStyles.bullet}>{i + 1}.</Text><Text style={pdfStyles.listText}>{obj}</Text></View>))}
        <Text style={pdfStyles.sectionTitleDark}>ALCANCES</Text>
        {alcancesPredeterminados.map((a, i) => (<View key={i} style={pdfStyles.listItem}><Text style={pdfStyles.bullet}>{i + 1}.</Text><Text style={pdfStyles.listText}>{a}</Text></View>))}
        <Footer now={now} />
      </Page>

      {/* ═══ PÁGINA 2: MAPA DE ACTIVIDADES ═══ */}
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.sectionTitle}>MAPA DE ACTIVIDADES</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRowHeader}>
            <Text style={[pdfStyles.tableCellHeader, { width: '24%' }]}>Actividad / Área Evaluada</Text>
            <Text style={[pdfStyles.tableCellHeader, { width: '17%' }]}>Estado de Cumplimiento</Text>
            <Text style={[pdfStyles.tableCellHeader, { width: '16%' }]}>Nivel de Riesgo</Text>
            <Text style={[pdfStyles.tableCellHeader, { width: '43%' }]}>Resultado general</Text>
          </View>
          {resultadosPorArea.map((a, i) => (
            <View key={a.id} style={[pdfStyles.tableRow, i === resultadosPorArea.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={[pdfStyles.tableCell, { width: '24%', fontFamily: 'Helvetica-Bold' }]}>{a.nombre}</Text>
              <Text style={[pdfStyles.tableCell, { width: '17%', color: a.conforme ? '#16a34a' : '#dc2626', fontFamily: 'Helvetica-Bold' }]}>{a.conforme ? 'Conforme' : 'No conforme'}</Text>
              <Text style={[pdfStyles.tableCell, { width: '16%', color: riskColorFor(a.riesgo), fontFamily: 'Helvetica-Bold' }]}>{a.riesgo}</Text>
              <Text style={[pdfStyles.tableCell, { width: '43%' }]}>{a.resultadoGeneral}</Text>
            </View>
          ))}
        </View>
        <Footer now={now} />
      </Page>

      {/* ═══ PÁGINA 3: MÉTRICAS E INVENTARIO ═══ */}
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.sectionTitle}>MÉTRICAS</Text>
        <View style={pdfStyles.kpiRow}>
          {[{ label: 'Riesgos Muy altos', n: muyAlto, color: '#b91c1c', bg: '#fef2f2' }, { label: 'Riesgos Altos', n: alto, color: '#ff7b00', bg: '#fff7ed' }, { label: 'Riesgos Medios', n: medio, color: '#d97706', bg: '#fffbeb' }, { label: 'En cumplimiento', n: enCumplimiento, color: '#16a34a', bg: '#f0fdf4' }].map((k, i) => (
            <View key={i} style={[pdfStyles.kpiBox, { borderColor: k.color, backgroundColor: k.bg }]}><Text style={[pdfStyles.kpiNum, { color: k.color }]}>{k.n}</Text><Text style={[pdfStyles.kpiLabel, { color: k.color }]}>{k.label}</Text></View>
          ))}
        </View>
        <View style={pdfStyles.summaryBox}><Text style={pdfStyles.textBlock}>{buildResumen(alto, medio, muyAlto, enCumplimiento, totalAreas)}</Text></View>
        
        <Text style={pdfStyles.sectionTitle}>INVENTARIO DE EQUIPO EN USO</Text>
        {invRows.length > 0 ? (
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableRowHeader}><Text style={[pdfStyles.tableCellHeader, { width: '40%' }]}>Descripción</Text><Text style={[pdfStyles.tableCellHeader, { width: '60%' }]}>Valor</Text></View>
            {invRows.map(([k, v], i) => (
              <View key={i} style={[pdfStyles.tableRow, i === invRows.length - 1 && { borderBottomWidth: 0 }]}><Text style={[pdfStyles.tableCell, { width: '40%', fontFamily: 'Helvetica-Bold' }]}>{k}</Text><Text style={[pdfStyles.tableCell, { width: '60%' }]}>{v}</Text></View>
            ))}
          </View>
        ) : (<Text style={pdfStyles.textBlock}>No se registró inventario de equipos.</Text>)}
        
        <Text style={pdfStyles.sectionTitleDark}>HALLAZGOS ENCONTRADOS</Text>
        <Text style={pdfStyles.textBlock}>{hallazgos.length > 0 ? `Se identificaron ${hallazgos.length} hallazgo(s) de seguridad en las áreas evaluadas. A continuación se detallan el problema, criterio, efecto y recomendación de cada uno.` : 'No se detectaron hallazgos de seguridad en las áreas evaluadas.'}</Text>
        <Footer now={now} />
      </Page>

      {/* ═══ PÁGINAS: HALLAZGOS ═══ */}
      {findingPages.length > 0 ? (
        findingPages.map((group, pi) => (
          <Page key={pi} size="A4" style={pdfStyles.page}>
            <Text style={pdfStyles.sectionTitle}>HALLAZGOS ENCONTRADOS</Text>
            {group.map((h, i) => <FindingBlock key={i} h={h} org={organizacion} />)}
            <Footer now={now} />
          </Page>
        ))
      ) : (
        <Page size="A4" style={pdfStyles.page}><Text style={pdfStyles.sectionTitle}>HALLAZGOS ENCONTRADOS</Text><Text style={pdfStyles.textBlock}>No se detectaron hallazgos de seguridad en esta auditoría.</Text><Footer now={now} /></Page>
      )}

      {/* ═══ PÁGINA: CONCLUSIONES ═══ */}
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.sectionTitle}>CONCLUSIONES</Text>
        {objetivos.length > 0 ? (
          objetivos.map((obj, i) => (
            <View key={i} style={pdfStyles.conclusionItem}><Text style={pdfStyles.conclusionObj}>{i + 1}. {obj}</Text><Text style={pdfStyles.conclusionText}>Conclusión: {conclusionesFinal[i] || 'Conclusión no registrada.'}</Text></View>
          ))
        ) : (<Text style={pdfStyles.textBlock}>No se definieron objetivos en la auditoría.</Text>)}
        
        {d8.recomendaciones && (
          <><Text style={pdfStyles.sectionTitle}>RECOMENDACIONES GENERALES</Text><Text style={pdfStyles.textBlock}>{d8.recomendaciones}</Text></>
        )}
        <View style={{ height: 1, backgroundColor: '#e8e8e8', marginVertical: 16 }} />
        <Text style={{ fontSize: 8, color: '#999', textAlign: 'center' }}>Este informe fue generado automáticamente por AuditTech • {now}</Text>
        <Footer now={now} />
      </Page>
    </Document>
  )
}

