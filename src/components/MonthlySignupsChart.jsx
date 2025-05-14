import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { parseISO, format } from 'date-fns';

const getMonthlySignups = (companies = []) => {
  const grouped = {};

  companies.forEach(company => {
    const date = company.createdAt;
    if (!date) return;

    const monthKey = format(parseISO(date), 'yyyy-MM');
    grouped[monthKey] = (grouped[monthKey] || 0) + 1;
  });

  const sortedKeys = Object.keys(grouped).sort();

  return sortedKeys.map(month => ({
    month: format(parseISO(`${month}-01`), 'MMM yyyy'),
    signups: grouped[month],
  }));
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-md rounded-md px-3 py-2 text-sm text-gray-800 border border-gray-200">
      <div className="font-medium">{label}</div>
      <div>{payload[0].value} signups</div>
    </div>
  );
};

const MonthlySignupsChart = ({ companies }) => {
  const data = getMonthlySignups(companies);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="signups"
          fill="#6366f1"
          radius={[6, 6, 0, 0]}
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlySignupsChart;
