import { RankedSiteResult } from '../types/mcda';

interface SiteScoreCardProps { result: RankedSiteResult; }

export default function SiteScoreCard({ result }: SiteScoreCardProps) {
    return <article className={result.rank === 1 ? 'mcda-score-card mcda-score-card--top' : 'mcda-score-card'}><div className="mcda-score-card__top"><span>{result.site.label}</span><b>Rank {result.rank}</b></div><h3>{result.site.name.split(',')[0]}</h3><strong>{result.overallScore === null ? 'No score' : `${result.overallScore.toFixed(1)} / 100`}</strong><div className="mcda-score-card__meta"><span>{result.completeness}% complete</span><span>{result.status}</span></div></article>;
}
