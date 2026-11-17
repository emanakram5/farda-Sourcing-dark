import './SectionHeader.css';

export default function SectionHeader({ eyebrow, title, text, align = 'left', as: Tag = 'h2', maxWidth }) {
  return (
    <div className={`section-header section-header--${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag className="section-title">{title}</Tag>
      {text && (
        <p className="section-sub" style={maxWidth ? { maxWidth } : undefined}>
          {text}
        </p>
      )}
    </div>
  );
}
