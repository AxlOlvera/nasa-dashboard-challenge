import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const VelocityScatter = ({ data }) => {
  const scatterData = Object.values(data?.near_earth_objects || {})
    .flat()
    .map(neo => {
      const approach = neo.close_approach_data?.[0];
      return {
        x: parseFloat(approach?.miss_distance?.kilometers) / 1000000 || 0,
        y: parseFloat(approach?.relative_velocity?.kilometers_per_hour) || 0,
        name: neo.name,
        hazardous: neo.is_potentially_hazardous_asteroid
      };
    })
    .filter(d => d.x > 0 && d.y > 0);

  return (
    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
      <h3>Miss Distance vs Velocity</h3>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 80 }}>
          <CartesianGrid />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Miss Distance" 
            unit="M km"
            label={{ value: 'Miss Distance (Million km)', position: 'bottom' }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Velocity" 
            unit="km/h"
            width={100}
            tick={{ fontSize: 11 }}
            label={{ 
                value: 'Velocity (km/h)', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10,
                style: { textAnchor: 'middle' }
            }}
            />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Asteroids" data={scatterData}>
            {scatterData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.hazardous ? '#ff4444' : '#82ca9d'} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p style={{ fontSize: '12px', color: '#666' }}>
        Red = Potentially Hazardous | Green = Safe
      </p>
    </div>
  );
};