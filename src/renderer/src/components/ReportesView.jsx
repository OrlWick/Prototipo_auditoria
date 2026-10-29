import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export default function ReportesView({ metricas, loading }) {
  if (loading || !metricas)
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        Cargando métricas...
      </div>
    )

  const COLORS = ['var(--accent)', '#a78bfa', 'var(--danger)', 'var(--success)', 'var(--warning)']
  const pctDanados =
    metricas.equiposSanos + metricas.equiposDanados > 0
      ? Math.round(
          (metricas.equiposDanados / (metricas.equiposSanos + metricas.equiposDanados)) * 100
        )
      : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Cards resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div
          className="card pattern-diagonal"
          style={{ padding: 20, position: 'relative', overflow: 'hidden' }}
        >
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              fontWeight: 600,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Total Auditorías
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>
            {metricas.totalAuditorias}
          </div>
        </div>
        <div
          className="card pattern-diagonal"
          style={{ padding: 20, position: 'relative', overflow: 'hidden' }}
        >
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              fontWeight: 600,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Total Equipos Revisados
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>
            {metricas.equiposSanos + metricas.equiposDanados}
          </div>
        </div>
        <div
          className="card pattern-diagonal"
          style={{ padding: 20, position: 'relative', overflow: 'hidden' }}
        >
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              fontWeight: 600,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Tasa de Daños Reportados
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: pctDanados > 15 ? 'var(--danger)' : 'var(--success)'
            }}
          >
            {pctDanados}%
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Bar Chart - Meses */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Auditorías por Mes</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricas.auditoriasPorMes}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="mes"
                  stroke="var(--text-muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                    background: '#1a1d27',
                    border: '1px solid var(--border)',
                    borderRadius: 8
                  }}
                />
                <Bar dataKey="cantidad" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Top SO */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>SO Principales</h3>
          <div
            style={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={metricas.topSistemasOperativos}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="cantidad"
                >
                  {metricas.topSistemasOperativos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    background: '#1a1d27',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                justifyContent: 'center',
                marginTop: 10
              }}
            >
              {metricas.topSistemasOperativos.map((so, i) => (
                <div
                  key={so.nombre}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color: 'var(--text-secondary)'
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: COLORS[i % COLORS.length]
                    }}
                  />
                  {so.nombre} ({so.cantidad})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
