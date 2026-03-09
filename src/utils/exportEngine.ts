import { getAetherAssetUrl } from './assets';

export function exportCodexPDF(payload: any, pii: any) {
  if (!payload || !payload.matrices) return;

  const m = payload.matrices;
  const t = payload.theoretical;
  const name = `${pii.firstName || 'Sovereign'} ${pii.lastName || 'Architect'}`;

  // ============================================================================
  // PASTE YOUR VERCEL BLOB URLS HERE FOR THE PDF THUMBNAILS
  // ============================================================================
  const IMG_MIND = getAetherAssetUrl('identities', 'img-mind.jpg');
  const IMG_SOUL = getAetherAssetUrl('identities', 'img-soul.jpg');
  const IMG_SPARK = getAetherAssetUrl('identities', 'img-spark.jpg');
  const IMG_SOURCE = getAetherAssetUrl('identities', 'img-source.jpg');
  const IMG_AXIOM = getAetherAssetUrl('identities', 'img-axiom.jpg');

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("System Warning: Pop-up blocker is preventing PDF generation.");
    return;
  }

  // Helper to render placements tightly into a dense 2-column list
  const renderPlacements = (placements: any[]) => {
    if (!placements) return '';
    return `<div class="data-grid">
      ${placements.map((p: any) => `
        <div class="data-item">
          <span>${p.planet}</span>
          <span class="highlight">${p.sign} <span style="color:#888; font-size:7px; margin-left:2px;">${p.degree}</span></span>
        </div>
      `).join('')}
    </div>`;
  };

  // Helper to concisely render aspects and patterns as comma-separated lists
  const renderAspects = (aspects: any[]) => {
    if (!aspects || aspects.length === 0) return '';
    return `<div class="meta-data"><strong>Aspects:</strong> ${aspects.map((a:any) => `${a.type} (${a.planets})`).join(' | ')}</div>`;
  };

  const renderPatterns = (patterns: any[]) => {
    if (!patterns || patterns.length === 0) return '';
    return `<div class="meta-data" style="margin-top: 2px;"><strong>Patterns:</strong> ${patterns.map((p:any) => p.name).join(' | ')}</div>`;
  };

  const html = `
    <html>
      <head>
        <title>Celestial Codex - ${name}</title>
        <style>
          /* Force Landscape and remove default browser margins */
          @page { size: landscape; margin: 8mm; }
          
          body { 
            background: #050505; color: #C5C6C7; 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            margin: 0; padding: 0; font-size: 8px; 
            -webkit-print-color-adjust: exact; print-color-adjust: exact; 
          }
          
          h1 { font-size: 14px; color: #F5D061; text-transform: uppercase; border-bottom: 1px solid #333; margin: 0 0 10px 0; padding-bottom: 4px; text-align: center; letter-spacing: 3px; }
          h2 { font-size: 10px; color: #6A0DAD; text-transform: uppercase; margin: 0 0 6px 0; border-bottom: 1px dashed #333; padding-bottom: 2px; display: flex; align-items: center; justify-content: space-between; }
          
          p { margin: 2px 0; line-height: 1.2; }
          .highlight { color: #F5D061; }
          
          /* The 3-Column Tri-Fold Grid */
          .blueprint-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; align-items: start; }
          .column { display: flex; flex-direction: column; gap: 8px; }
          
          /* Data Cards */
          .card { background: rgba(15, 15, 15, 1); border: 1px solid rgba(245,208,97,0.2); padding: 6px 8px; border-radius: 4px; }
          
          /* Placements Grid */
          .data-grid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 8px; row-gap: 2px; }
          .data-item { display: flex; justify-content: space-between; border-bottom: 1px solid #222; padding-bottom: 1px; }
          .data-item span:first-child { color: #fff; font-weight: bold; }
          
          .meta-data { margin-top: 4px; font-size: 7px; color: #aaa; line-height: 1.3; }
          
          /* Identity Image Thumbnails */
          .identity-img { width: 20px; height: 20px; border-radius: 50%; object-fit: cover; border: 1px solid #6A0DAD; display: block; }
          .identity-header-text { display: flex; align-items: baseline; gap: 4px; }
        </style>
      </head>
      <body>
        <h1>Master Blueprint Dossier // ${name}</h1>
        
        <div class="blueprint-grid">
          
          <div class="column">
            <div class="card">
              <h2><span>Core Telemetry</span></h2>
              <div class="data-grid">
                <div class="data-item"><span>Life Path</span> <span class="highlight">${payload.numerology?.lifePath || 'N/A'}</span></div>
                <div class="data-item"><span>Destiny</span> <span class="highlight">${payload.numerology?.destiny || 'N/A'}</span></div>
                <div class="data-item"><span>Soul Urge</span> <span class="highlight">${payload.numerology?.soulUrge || 'N/A'}</span></div>
                <div class="data-item"><span>Personality</span> <span class="highlight">${payload.numerology?.personality || 'N/A'}</span></div>
              </div>
              <p style="margin-top:4px; font-size:7px;"><strong>Resonance:</strong> ${payload.numerology?.details?.title || ''}</p>
            </div>

            <div class="card">
              <h2><span>Starseed Origin</span></h2>
              <p><strong class="highlight">${m.starseed?.origin}</strong></p>
              <p>${m.starseed?.title}</p>
              <p class="meta-data"><strong>Traits:</strong> ${m.starseed?.traits?.join(', ')}</p>
            </div>

            <div class="card">
              <h2><span>Sacred Geometry</span></h2>
              <p><strong class="highlight">${m.sacredGeometry?.shape}</strong></p>
              <p>${m.sacredGeometry?.principle}</p>
              <p class="meta-data"><strong>Resonance:</strong> ${m.sacredGeometry?.resonance}</p>
            </div>

            <div class="card">
              <h2><span>Cultural Matrix</span></h2>
              <div style="display:flex; flex-direction:column; gap:4px;">
                ${m.culturalGrid?.map((g: any) => `
                  <div style="border-bottom: 1px solid #222; padding-bottom: 2px;">
                    <span style="color:#34D399; font-weight:bold; font-size:8px;">${g.system}</span> 
                    <span style="color:#888; font-size:7px;">(${g.region})</span><br/>
                    <span class="highlight">${g.archetype}</span> — <span style="font-size:7px;">${g.title}</span>
                  </div>
                `).join('') || '<p>Awaiting Data</p>'}
              </div>
            </div>
          </div>

          <div class="column">
            <div class="card">
              <h2>
                <div class="identity-header-text">Tropical Placidus <span style="color:#888;font-size:6px;">(The Persona)</span></div>
                ${IMG_MIND.includes('http') ? `<img src="${IMG_MIND}" class="identity-img" />` : ''}
              </h2>
              ${renderPlacements(m.tropical)}
              ${renderAspects(m.aspects)}
              ${renderPatterns(m.patterns)}
            </div>

            ${t ? `
            <div class="card">
              <h2>
                <div class="identity-header-text">Theoretical Axiom <span style="color:#888;font-size:6px;">(Cotsworth Shift)</span></div>
                ${IMG_AXIOM.includes('http') ? `<img src="${IMG_AXIOM}" class="identity-img" />` : ''}
              </h2>
              <p style="font-size:7px; margin-bottom:4px; color:#aaa; border-bottom: 1px solid #222; padding-bottom: 2px;">Date: ${t.date} | UTC: ${t.time} | Shifted LP: ${t.numerology?.lifePath}</p>
              ${renderPlacements(t.matrices?.tropical)}
              ${renderAspects(t.matrices?.aspects)}
            </div>
            ` : ''}
          </div>

          <div class="column">
            <div class="card">
              <h2>
                <div class="identity-header-text">Sidereal Lahiri <span style="color:#888;font-size:6px;">(The Soul)</span></div>
                ${IMG_SOUL.includes('http') ? `<img src="${IMG_SOUL}" class="identity-img" />` : ''}
              </h2>
              ${renderPlacements(m.vaults?.sidereal?.placements)}
              ${renderAspects(m.vaults?.sidereal?.aspects)}
            </div>

            <div class="card">
              <h2>
                <div class="identity-header-text">Draconic <span style="color:#888;font-size:6px;">(The Spark)</span></div>
                ${IMG_SPARK.includes('http') ? `<img src="${IMG_SPARK}" class="identity-img" />` : ''}
              </h2>
              ${renderPlacements(m.vaults?.draconic?.placements)}
              ${renderAspects(m.vaults?.draconic?.aspects)}
            </div>

            <div class="card">
              <h2>
                <div class="identity-header-text">Heliocentric <span style="color:#888;font-size:6px;">(The Source)</span></div>
                ${IMG_SOURCE.includes('http') ? `<img src="${IMG_SOURCE}" class="identity-img" />` : ''}
              </h2>
              ${renderPlacements(m.vaults?.heliocentric?.placements)}
              ${renderAspects(m.vaults?.heliocentric?.aspects)}
            </div>
          </div>

        </div>

        <script>
          window.onload = () => { 
            // Brief delay to allow images to load before triggering print dialog
            setTimeout(() => {
              window.print(); 
              window.close();
            }, 800);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
