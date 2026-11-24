import Logo from './Logo.jsx';
import './CompanyGroup.css';

import { COMPANY_PROFILES as companies, GROUP_OVERVIEW } from '../data/companyGroup.js';
export default function CompanyGroup() {
  return <section className="ab-sec company-group" aria-labelledby="company-group-title">
    <div className="ab-wrap">
      <div className="ab-label"><b>02</b><span>Our group</span><i /></div>
      <header className="company-group__heading"><span className="ab-eyebrow">CONNECTED THROUGH YC GROUP</span><h2 id="company-group-title">YC Group of Companies</h2><p>{GROUP_OVERVIEW}</p></header>
      <div className="company-tree">
        <div className="company-tree__parent"><div className="company-tree__parent-logo"><img src="/images/yc-logo.png" alt="YC Group of Companies logo" width="260" height="120" loading="lazy" /></div><span className="kicker">PARENT GROUP</span><h3>YC Group of Companies</h3><p>Connecting expertise across businesses.</p></div>
        <ul className="company-tree__branches" aria-label="Companies associated with YC Group of Companies">
          {companies.map(company => <li className="company-tree__branch" key={company.name}>
            <div className={'company-tree__logo' + (company.dark ? ' company-tree__logo--dark' : '')}><img src={'/images/' + company.image} alt={company.name + ' logo'} loading="lazy" /></div>
            <h3><a href={"#" + company.id}>{company.name}</a></h3><p>{company.text}</p>
          </li>)}
        </ul>
        <div className="company-tree__farda">
          <span className="company-tree__signal" aria-hidden="true" />
          <div className="company-tree__farda-card"><Logo variant="light" size={52} /><span className="kicker">PART OF YC GROUP OF COMPANIES</span><h3>Bringing global innovation closer.</h3><p>Farda Sourcing connects businesses with innovative products, supplier partnerships and sourcing support, extending the group network into global trade.</p></div>
        </div>
      </div>
      <section className="company-backgrounds" aria-labelledby="company-backgrounds-title">
        <h2 id="company-backgrounds-title">The businesses behind our network</h2>
        <div className="company-backgrounds__grid">{companies.map(company => <article id={company.id} key={company.id} className="company-backgrounds__card"><h3>{company.name}</h3>{company.paragraphs.map(text => <p key={text}>{text}</p>)}</article>)}</div>
      </section>
    </div>
  </section>;
}
