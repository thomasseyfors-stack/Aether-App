export function exportCodexPDF(payload: any, pii: any) {
  if (!payload || !payload.matrices) return;

  const m = payload.matrices;
  const t = payload.theoretical;
  const name = `${pii.firstName || 'Sovereign'} ${pii.lastName || 'Architect'}`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("System Warning: Pop-up blocker is preventing PDF generation.");
    return;
  }

  const html = `
    <html>
      <head>
        <title>Celestial Codex - ${name}</title>
        <style>
          body { background: #050505; color: #e6e6e6; font-family: 'Courier New', monospace; padding: 40px; }
          h1, h2, h3 { color: #F5D061; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 10px; }
          h4 { color: #9D4EDD; margin-bottom: 5px; }
          .section { margin-bottom: 40px; page-break-inside: avoid; }
          .grid { display: flex; flex-wrap: wrap; gap: 20px; }
          .card { border: 1px solid #333; padding: 15px; border-radius: 8px; width: calc(50% - 22px); background: #111; }
          .full-card { border: 1px solid #333; padding: 15px; border-radius: 8px; width: 100%; background: #111; margin-bottom: 10px; }
          p, li { font-size: 12px; line-height: 1.6; }
          ul { padding-left: 20px; }
          .highlight { color: #34D399; }
        </style>
      </head>
      <body>
        <h1>Master Blueprint Dossier: ${name}</h1>
        
        <div class="section">
          <h2>1. Core Frequency & Telemetry</h2>
          <div class="grid">
            <div class="card">
              <h4>Numerology Resonance</h4>
              <p><strong>Life Path (DOB):</strong> ${payload.numerology?.lifePath || 'N/A'}</p>
              <p><strong>Destiny (Name):</strong> ${payload.numerology?.destiny || 'N/A'}</p>
              <p><strong>Soul Urge (Vowels):</strong> ${payload.numerology?.soulUrge || 'N/A'}</p>
              <p><strong>Personality (Consonants):</strong> ${payload.numerology?.personality || 'N/A'}</p>
            </div>
            <div class="card">
              <h4>Starseed Origin</h4>
              <p><strong>Vector:</strong> ${m.starseed?.origin}</p>
              <p><strong>Title:</strong> ${m.starseed?.title}</p>
            </div>
            <div class="full-card">
              <h4>Sacred Geometry</h4>
              <p><strong>Shape:</strong> ${m.sacredGeometry?.shape} (${m.sacredGeometry?.principle})</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>2. Cross-Cultural Esoteric Matrix</h2>
          <div class="grid">
            ${m.culturalGrid?.map((g: any) => `
              <div class="card">
                <h4>${g.system}</h4>
                <p class="highlight">Region: ${g.region}</p>
                <p><strong>Archetype:</strong> ${g.archetype}</p>
                <p><strong>Title:</strong> ${g.title}</p>
              </div>
            `).join('') || '<p>Awaiting Data</p>'}
          </div>
        </div>

        <div class="section">
          <h2>3. Tropical Placidus (The Persona)</h2>
          <div class="grid">
            ${m.tropical?.map((p: any) => `<div class="card" style="width: calc(33% - 20px);"><strong>${p.planet}</strong>: ${p.sign} ${p.degree}</div>`).join('') || ''}
          </div>
        </div>

        <div class="section">
          <h2>4. Encrypted Vaults</h2>
          <h3>Sidereal Lahiri (The Soul Vessel)</h3>
          <div class="grid">${m.vaults?.sidereal?.placements?.map((p: any) => `<div class="card" style="width: calc(33% - 20px);"><strong>${p.planet}</strong>: ${p.sign} ${p.degree}</div>`).join('') || ''}</div>
          
          <h3 style="margin-top: 30px;">Draconic (The Spark)</h3>
          <div class="grid">${m.vaults?.draconic?.placements?.map((p: any) => `<div class="card" style="width: calc(33% - 20px);"><strong>${p.planet}</strong>: ${p.sign} ${p.degree}</div>`).join('') || ''}</div>
          
          <h3 style="margin-top: 30px;">Heliocentric (The Source)</h3>
          <div class="grid">${m.vaults?.heliocentric?.placements?.map((p: any) => `<div class="card" style="width: calc(33% - 20px);"><strong>${p.planet}</strong>: ${p.sign} ${p.degree}</div>`).join('') || ''}</div>
        </div>

        ${t ? `
        <div class="section">
          <h2>5. Theoretical Axiom (Cotsworth Shift)</h2>
          <p><strong>Theoretical Date:</strong> ${t.date} | <strong>Time:</strong> ${t.time}</p>
          <p><strong>Shifted Life Path:</strong> ${t.numerology?.lifePath}</p>
          <div class="grid">
            ${t.matrices?.tropical?.map((p: any) => `<div class="card" style="width: calc(33% - 20px);"><strong>${p.planet}</strong>: ${p.sign} ${p.degree}</div>`).join('') || ''}
          </div>
        </div>
        ` : ''}

        <script>
          window.onload = () => { 
            setTimeout(() => {
              window.print(); 
              window.close();
            }, 500);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
