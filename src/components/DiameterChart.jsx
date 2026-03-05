import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DiameterChart = ({ data }) => {
  // Transform NASA data for Recharts
  const chartData = Object.entries(data?.near_earth_objects || {})
    .flatMap(([date, asteroids]) => 
      asteroids.map(neo => ({
        name: neo.name,
        diameter: neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0,
        date: date
      }))
    )
    .slice(0, 20); // Show top 20, not all 200+

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Asteroid Diameters (km)</h3>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={100}  // More space for labels
            interval={0}
            tick={{ fontSize: 9 }}  // Smaller text
            dy={10}  // Push labels down slightly
            />
          <YAxis />
          <Tooltip />
          <Bar dataKey="diameter" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
