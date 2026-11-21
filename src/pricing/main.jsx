import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowDown, ArrowLeft, ArrowUpRight, Check, Droplets, Info, Plus, Sun, Wind } from "lucide-react";
import "./style.css";
import "../page-brand.css";

const SOLAR = [
  { kw: 2, panels: 4, cost: [4800, 7500], gen: [250, 300] },
  { kw: 3, panels: 6, cost: [7200, 10500], gen: [375, 450] },
  { kw: 4, panels: 8, cost: [9600, 13500], gen: [500, 600] },
  { kw: 5, panels: 10, cost: [12000, 16500], gen: [625, 750] },
  { kw: 10, panels: 19, cost: [25500, 31500], gen: [1250, 1500] },
  { kw: 25, panels: 46, cost: [60000, 75000], gen: [3125, 3750] },
  { kw: 30, panels: 56, cost: [72000, 90000], gen: [3750, 4500] },
];
const WIND = [
  { kw: 1, cost: [11000, 18000], gen: 250, ref: 167 },
  { kw: 3, cost: [27500, 40500], gen: 750, ref: 500 },
  { kw: 5, cost: [40000, 59000], gen: 1417, ref: 833 },
];
const RAIN = [650, 1050];
const format = (n) => Math.round(n).toLocaleString("en-US");
const money = (n) => `AED ${format(n)}`;
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];

function Choice({ active, onClick, children, label }) {
  return <button type="button" className={`choice ${active ? "selected" : ""}`} aria-pressed={active} aria-label={label} onClick={onClick}>{children}{active && <Check size={15} aria-hidden="true" />}</button>;
}

function App() {
  const [solarKw, setSolarKw] = useState(5);
  const [windKw, setWindKw] = useState(0);
  const [rainOn, setRainOn] = useState(false);
  const [coreCost, setCoreCost] = useState(0);
  const [markup, setMarkup] = useState(20);
  const [rate, setRate] = useState(0.462);
  const [roofArea, setRoofArea] = useState(2000);
  const [rainfall, setRainfall] = useState(100);
  const solar = SOLAR.find((item) => item.kw === solarKw);
  const wind = WIND.find((item) => item.kw === windKw);
  const energy = useMemo(() => ({
    min: solar.gen[0] + (wind ? wind.gen : 0),
    max: solar.gen[1] + (wind ? wind.gen : 0),
  }), [solar, wind]);
  const subtotal = useMemo(() => {
    let result = [...solar.cost];
    if (wind) result = add(result, wind.cost);
    if (rainOn) result = add(result, RAIN);
    result = add(result, [Number(coreCost) || 0, Number(coreCost) || 0]);
    return result;
  }, [solar, wind, rainOn, coreCost]);
  const retail = subtotal.map((value) => value * (1 + (Number(markup) || 0) / 100));
  const savings = energy.max * rate;
  const roofCapture = Math.max(0, Number(roofArea) || 0) * 0.092903 * Math.max(0, Number(rainfall) || 0) * 0.8;

  return <div className="price-app">
    <header className="price-header"><a className="page-brand" href="/" aria-label="WELOS home"><img src="/welos-brand-transparent.png" alt=""/><span><strong>WELOS</strong><small>URBAN RESOURCE SYSTEM</small></span></a><span className="header-center">SYSTEM PRICE BUILDER</span><a className="page-back" href="/configure.html">3D CONFIGURATOR <ArrowUpRight size={14}/></a></header>
    <main className="price-main">
      <section className="price-intro"><div className="price-kicker"><i/>CONFIGURE / COST / COMPARE</div><h1>One roof.<br/><em>Your combination.</em></h1><div className="intro-side"><p>Choose a system size, add the resources that fit your site, and see a live planning estimate for hardware cost, best-case output and potential bill offset.</p><a href="#builder">BUILD YOUR SYSTEM <ArrowDown size={14}/></a></div><span className="intro-index">DUBAI · GRID-CONNECTED · NO BATTERY</span></section>

      <div className="builder" id="builder">
        <div className="builder-main">
          <section className="builder-section solar-section"><div className="section-kicker"><span>01 / START WITH SOLAR</span><Sun size={18}/></div><div className="section-heading"><div><h2>Choose your array.</h2><p>Installed planning range · 545 W panel equivalents · grid connected</p></div><div className="picked-size"><b>{solar.kw}<small>kW</small></b><span>SELECTED</span></div></div>
            <div className="solar-grid">{SOLAR.map((item) => <Choice key={item.kw} active={item.kw === solarKw} onClick={() => setSolarKw(item.kw)} label={`${item.kw} kilowatt solar system`}><strong>{item.kw}<small>kW</small></strong><span>{item.kw <= 10 ? `${item.panels} panels` : `about ${item.panels} panels`}</span><b>{money(item.cost[0])}–{format(item.cost[1])}</b><em>{format(item.gen[0])}–{format(item.gen[1])} kWh/mo best case</em></Choice>)}</div>
            <div className="solar-detail"><div><span>STRONG SOLAR SITE / MONTHLY</span><strong>{format(solar.gen[1])} <small>kWh</small></strong></div><div><span>EST. BILL OFFSET AT {Math.round(rate * 1000) / 10} FILS/KWH</span><strong>{money(solar.gen[1] * rate)}<small>/mo</small></strong></div><div><span>NO CASH SUBSIDY INCLUDED</span><strong>Net metering</strong></div></div><p className="fine-print">Production uses 1,500–1,800 kWh per kWp annually. Savings show the upper estimate when each generated unit offsets a unit otherwise billed at your selected DEWA rate. Actual use, export credits, fees and site design change the result. <a href="https://dubaisolarinstallers.ae/knowledge-hub/solar-panel-price-dubai/" target="_blank" rel="noreferrer">Local installed-price reference ↗</a></p>
          </section>

          <section className="builder-section add-section"><div className="section-kicker"><span>02 / ADD ONLY WHAT FITS</span><Plus size={18}/></div><div className="section-heading"><div><h2>Build your mix.</h2><p>Optional modules add to the selected solar package.</p></div></div>
            <div className={`module-row ${wind ? "module-active" : ""}`}><div className="module-icon wind-icon"><Wind size={20}/></div><div className="module-desc"><span>WIND / SITE-DEPENDENT</span><strong>Add a wind turbine</strong><p>High output is a strong-wind scenario at turbine height, not a typical rooftop forecast. Structural and wind assessment required.</p><div className="wind-choices"><Choice active={windKw === 0} onClick={() => setWindKw(0)} label="No wind turbine">No wind</Choice>{WIND.map((item) => <Choice key={item.kw} active={windKw === item.kw} onClick={() => setWindKw(item.kw)} label={`Add ${item.kw} kilowatt wind turbine`}><strong>{item.kw} kW</strong><span>{format(item.gen)} kWh/mo</span></Choice>)}</div><div className="reference-speed"><Info size={13}/> Strong-site estimates; at 5 m/s reference: 1 kW ≈167, 3 kW ≈500, 5 kW ≈833 kWh/month.</div></div>{wind && <div className="module-price">{money(wind.cost[0])}<small>– {format(wind.cost[1])}</small></div>}</div>
            <button className={`module-row rain-row ${rainOn ? "module-active" : ""}`} type="button" aria-pressed={rainOn} onClick={() => setRainOn(!rainOn)}><span className="module-icon rain-icon"><Droplets size={20}/></span><span className="module-desc"><span>RAIN / 100 L STORAGE</span><strong>Rainwater collection + filtration</strong><p>Gutter and first-flush diverter, filter and 100 L tank. Tank capacity is storage, not guaranteed monthly yield.</p>{rainOn && <span className="rain-capture">Roof catchment potential ≈ {format(roofCapture)} L/year <small>before tank reuse, overflow and local conditions</small></span>}</span><span className="module-price">{rainOn ? `${money(RAIN[0])}–${format(RAIN[1])}` : "ADD MODULE"}<small>{rainOn ? "materials estimate" : <Plus size={15}/>}</small></span></button>
            {rainOn && <div className="rain-inputs"><label>ROOF CATCHMENT (sq ft)<input type="number" min="0" value={roofArea} onChange={(e) => setRoofArea(e.target.value)}/></label><label>ANNUAL RAINFALL (mm)<input type="number" min="0" value={rainfall} onChange={(e) => setRainfall(e.target.value)}/></label></div>}
          </section>
          <section className="builder-section assumptions"><div className="section-kicker"><span>03 / SET YOUR WELOS PRICE</span><span>EDITABLE ASSUMPTIONS</span></div><div className="assumption-grid"><label>WELOS core hardware cost <span>Enter your BOM estimate</span><div><b>AED</b><input type="number" min="0" step="100" value={coreCost} onChange={(e) => setCoreCost(e.target.value)} aria-label="WELOS core hardware cost in AED"/></div></label><label>Retail markup <span>Applied to selected equipment</span><div><input type="number" min="0" max="300" value={markup} onChange={(e) => setMarkup(e.target.value)} aria-label="Retail markup percentage"/><b>%</b></div></label></div><p className="fine-print">Core hardware starts at AED 0 because WELOS manufacturing cost has not been specified. Enter the actual core BOM cost before sharing a customer price. Markup is a planning input, not a validated margin.</p></section>
        </div>

        <aside className="price-summary" aria-live="polite"><div className="summary-top"><span>YOUR WELOS BUILD</span><span className="summary-live"><i/>LIVE ESTIMATE</span></div><div className="summary-title"><span>ESTIMATED CUSTOMER PRICE</span><strong>{money(retail[0])}<small>– {format(retail[1])}</small></strong><em>Equipment range + {markup || 0}% markup</em></div><div className="summary-line"><span>Solar · {solar.kw} kW</span><b>{money(solar.cost[0])}–{format(solar.cost[1])}</b></div>{wind && <div className="summary-line"><span>Wind · {wind.kw} kW</span><b>{money(wind.cost[0])}–{format(wind.cost[1])}</b></div>}{rainOn && <div className="summary-line"><span>Rainwater · 100 L</span><b>{money(RAIN[0])}–{format(RAIN[1])}</b></div>}<div className="summary-line"><span>WELOS core hardware</span><b>{money(Number(coreCost) || 0)}</b></div><div className="summary-line summary-subtotal"><span>Subtotal before markup</span><b>{money(subtotal[0])}–{format(subtotal[1])}</b></div><div className="summary-output"><span>BEST-CASE MONTHLY ENERGY</span><strong>{format(energy.max)} <small>kWh</small></strong><p>{format(energy.min)}–{format(energy.max)} kWh expected range across listed strong-site assumptions.</p></div><div className="summary-output saving-output"><label htmlFor="rate-select">POTENTIAL BILL OFFSET / MONTH</label><select id="rate-select" value={rate} onChange={(e) => setRate(Number(e.target.value))}><option value="0.3045">Lower slab · 30.45 fils/kWh</option><option value="0.357">Mid slab · 35.7 fils/kWh</option><option value="0.462">Upper slab · 46.2 fils/kWh</option></select><strong>{money(savings)}<small>/month best case</small></strong><p>Wind is valued only when used on site. Do not count wind exports as DEWA credits without approval.</p></div><a className="summary-cta" href="/configure.html">REFINE YOUR SITE DESIGN <ArrowUpRight size={16}/></a><p className="summary-caveat">Planning estimate only. Solar pricing is a low-end installed target; wind and rain kit costs are indicative. Grid approvals, roof structure, wiring, taxes and site access may change final quotes. DEWA does not currently offer a cash solar subsidy.</p></aside>
      </div>
        <section className="method"><span>HOW TO READ THIS ESTIMATE</span><p>Solar bill offset is the upper-bound energy value at your selected consumption slab; exported PV is handled through Shams Dubai credits, not a cash payment. Wind output is a best-case resource scenario and should be based on measured hub-height wind and a turbine power curve. Rain catchment is roof area × annual rainfall × 0.8 runoff efficiency; the 100 L tank fills and empties over time, so this is theoretical roof capture, not guaranteed delivered water.</p><div className="method-links"><a href="https://www.dewa.gov.ae/en/consumer/billing/slab-tariff" target="_blank" rel="noreferrer">DEWA tariff ↗</a><a href="https://www.dewa.gov.ae/en/consumer/solar-community/shams-dubai/shams-dubai-faq" target="_blank" rel="noreferrer">Shams Dubai ↗</a><a href="https://www.energy.gov/cmei/systems/windexchange/small-wind-guidebook" target="_blank" rel="noreferrer">DOE small-wind guide ↗</a><a href="https://www.windturbine.com/blog/how-much-does-a-small-wind-turbine-cost/" target="_blank" rel="noreferrer">Wind cost / output reference ↗</a></div></section>
    </main>
  </div>;
}

createRoot(document.getElementById("pricing-root")).render(<App/>);
