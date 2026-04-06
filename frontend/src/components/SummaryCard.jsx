import './SummaryCard.css';

const Icons = {
  balance: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12H4"></path><path d="M4 12l6-6"></path><path d="M4 12l6 6"></path></svg>,
  income: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>,
  expense: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>,
  up: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 6 23 6 23 12"></polyline><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline></svg>,
  down: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 18 23 18 23 12"></polyline><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline></svg>
};

export default function SummaryCard({ title, amount, subtext, trend, trendPercent, color, icon }) {
  const trendIcon = trend === '+' ? Icons.up : Icons.down;
  const trendClass = trend === '+' ? 'positive' : 'negative';

  const formattedAmount = new Intl.NumberFormat('en-US').format(amount || 0);

  return (
    <div className="summary-card">
      <div className="card-header">
        <h3>{title}</h3>
        <div className={`card-icon ${color}`}>{Icons[icon]}</div>
      </div>
      <div className="card-amount">
        ${formattedAmount}
      </div>
      <div className="card-footer">
        <span>{subtext}</span>
        {trend && (
          <span className={`card-trend ${trendClass}`}>
            {trendIcon}
            {trendPercent}
          </span>
        )}
      </div>
    </div>
  );
}
