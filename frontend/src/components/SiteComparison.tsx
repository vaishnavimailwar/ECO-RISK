import { RankedSiteResult } from '../types/mcda';
import { CATEGORY_LABELS } from '../data/mcdaWeights';

interface SiteComparisonProps { results: RankedSiteResult[]; }

export default function SiteComparison({ results }: SiteComparisonProps) {
    return <div className="site-comparison-table"><div className="site-comparison-row site-comparison-row--header"><span>Category</span>{results.map((result) => <span key={result.site.id}>{result.site.label}</span>)}</div>{Object.entries(CATEGORY_LABELS).map(([category, label]) => <div className="site-comparison-row" key={category}><strong>{label}</strong>{results.map((result) => { const score = result.categoryScores.find((item) => item.category === category)?.score; return <span key={result.site.id}>{score === null || score === undefined ? '—' : `${score.toFixed(1)} / 100`}</span>; })}</div>)}</div>;
}
