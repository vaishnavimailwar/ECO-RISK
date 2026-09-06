import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RankedSiteResult } from '../types/mcda';
import { CATEGORY_LABELS } from '../data/mcdaWeights';

interface CategoryScoreChartProps { results: RankedSiteResult[]; }

export default function CategoryScoreChart({ results }: CategoryScoreChartProps) {
    const data = Object.entries(CATEGORY_LABELS).map(([category, label]) => {
        const row: Record<string, string | number> = { category: label };
        results.forEach((result) => { row[result.site.label] = result.categoryScores.find((score) => score.category === category)?.score || 0; });
        return row;
    });
    const colors = ['#3978ae', '#5c9b7a', '#c68b3a'];
    return <div className="mcda-chart"><ResponsiveContainer width="100%" height={280}><BarChart data={data} margin={{ top: 5, right: 15, left: 0, bottom: 50 }}><CartesianGrid stroke="#e7ebf0" vertical={false} /><XAxis dataKey="category" angle={-18} textAnchor="end" interval={0} tick={{ fill: '#6f8195', fontSize: 10 }} /><YAxis domain={[0, 100]} tick={{ fill: '#6f8195', fontSize: 10 }} /><Tooltip formatter={(value: number) => `${value.toFixed(1)} / 100`} /><Legend wrapperStyle={{ fontSize: 11 }} />{results.map((result, index) => <Bar dataKey={result.site.label} fill={colors[index % colors.length]} radius={[2, 2, 0, 0]} key={result.site.id} />)}</BarChart></ResponsiveContainer></div>;
}