import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const value = parseFloat(payload[0].value);
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>
          {`${payload[0].name}`}
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#718096' }}>
          {`$${formatted}`}
        </p>
      </div>
    );
  }
  return null;
};

export default function Chart({ type, data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a0aec0',
        fontSize: '0.9rem'
      }}>
        No data to display
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || '#8884d8'} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              iconSize={12} 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{ paddingLeft: '1rem' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
