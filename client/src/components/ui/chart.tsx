import * as React from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend 
} from "recharts";

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[];
  type: "area" | "bar" | "line" | "pie" | "donut";
  categories?: string[];
  index?: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  startEndOnly?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGridLines?: boolean;
  height?: number;
}

export function Chart({
  data,
  type,
  categories = ["value"],
  index = "name",
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"],
  valueFormatter = (value: number) => value.toString(),
  startEndOnly = false,
  showXAxis = true,
  showYAxis = false,
  showLegend = true,
  showTooltip = true,
  showGridLines = true,
  height = 300,
  className,
  ...props
}: ChartProps) {
  const COLORS = colors;

  // Format ticks for x-axis
  const formatTick = (value: any) => {
    if (startEndOnly) {
      const dataIndex = data.findIndex((item) => item[index] === value);
      if (dataIndex === 0 || dataIndex === data.length - 1) {
        return value;
      }
      return "";
    }
    return value;
  };

  const renderChart = () => {
    switch (type) {
      case "area":
        return (
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            {showXAxis && <XAxis dataKey={index} tickFormatter={formatTick} axisLine={false} tickLine={false} />}
            {showYAxis && <YAxis tickFormatter={valueFormatter} axisLine={false} tickLine={false} />}
            {showTooltip && <Tooltip formatter={valueFormatter} />}
            {showLegend && <Legend />}
            {categories.map((category, i) => (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                fill={COLORS[i % COLORS.length]}
                stroke={COLORS[i % COLORS.length]}
                fillOpacity={0.2}
              />
            ))}
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            {showXAxis && <XAxis dataKey={index} tickFormatter={formatTick} axisLine={false} tickLine={false} />}
            {showYAxis && <YAxis tickFormatter={valueFormatter} axisLine={false} tickLine={false} />}
            {showTooltip && <Tooltip formatter={valueFormatter} />}
            {showLegend && <Legend />}
            {categories.map((category, i) => (
              <Bar
                key={category}
                dataKey={category}
                fill={COLORS[i % COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            {showXAxis && <XAxis dataKey={index} tickFormatter={formatTick} axisLine={false} tickLine={false} />}
            {showYAxis && <YAxis tickFormatter={valueFormatter} axisLine={false} tickLine={false} />}
            {showTooltip && <Tooltip formatter={valueFormatter} />}
            {showLegend && <Legend />}
            {categories.map((category, i) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
      case "pie":
        return (
          <PieChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={categories[0]}
              nameKey={index}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip formatter={valueFormatter} />}
            {showLegend && <Legend />}
          </PieChart>
        );
      case "donut":
        return (
          <PieChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey={categories[0]}
              nameKey={index}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip formatter={valueFormatter} />}
            {showLegend && <Legend />}
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
