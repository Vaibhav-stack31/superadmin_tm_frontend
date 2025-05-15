import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { parseISO, format, getYear } from 'date-fns';

// Function to get data based on the selected time range
const getSignupsByTimeRange = (companies = [], timeRange) => {
  const grouped = {};

  companies.forEach(company => {
    const date = company.createdAt;
    if (!date) return;

    const parsedDate = parseISO(date);
    let key;

    if (timeRange === 'monthly') {
      key = format(parsedDate, 'yyyy-MM');

      grouped[key] = grouped[key] || {
        label: format(parsedDate, 'MMM yyyy'),
        signups: 0
      };
      grouped[key].signups += 1;
    }
    else if (timeRange === 'yearly') {
      key = format(parsedDate, 'yyyy');

      grouped[key] = grouped[key] || {
        label: format(parsedDate, 'yyyy'),
        signups: 0
      };
      grouped[key].signups += 1;
    }
  });

  // Sort keys chronologically
  const sortedKeys = Object.keys(grouped).sort();

  // Convert to array format for chart
  return sortedKeys.map(key => ({
    period: grouped[key].label,
    signups: grouped[key].signups,
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

const TimeRangeSignupsChart = ({ companies, timeRange }) => {
  const data = getSignupsByTimeRange(companies, timeRange);

  const getChartTitle = () => {
    return timeRange === 'yearly' ? 'Yearly Signups' : 'Monthly Signups';
  };

  return (
    <div className="w-full h-full">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{getChartTitle()}</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="period"
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
            barSize={timeRange === 'yearly' ? 40 : 30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeRangeSignupsChart;