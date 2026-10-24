import { WaterDropIcon } from './Icons';

function AppHeader() {
  return (
    <header className="site-header">
      <div className="brand-mark" aria-hidden="true">
        <WaterDropIcon />
      </div>
      <div>
        <p className="eyebrow">A little shine goes a long way</p>
        <h1>Sparkle Car Wash</h1>
        <p className="header-description">
          Book a wash or detailing appointment in just a few clicks.
        </p>
      </div>
    </header>
  );
}

export default AppHeader;
