import fs from 'fs';

const bibPath = 'docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md';
let content = fs.readFileSync(bibPath, 'utf8');

const anchorMap = [
  { match: '### 1.1 Gardner, Cantor, & Collins (2000)', id: 'gardner2000' },
  { match: '### 1.2 Elowitz & Leibler (2000)', id: 'elowitz2000' },
  { match: '### 1.3 Mangan & Alon (2003)', id: 'mangan2003' },
  { match: '### 1.4 Alon (2007) & Goentoro et al. (2009)', id: 'alon2007', extraId: 'goentoro2009' },
  { match: '### 1.5 Rosenfeld, Elowitz, & Alon (2002)', id: 'rosenfeld2002' },
  { match: '### 1.6 Jacob & Monod (1961)', id: 'jacob1961' },
  { match: '### 1.7 Alon (2019)', id: 'alon2019' },
  { match: '### 2.1 Mitchell (1961)', id: 'mitchell1961' },
  { match: '### 2.2 Russell & Hall (1997)', id: 'russell1997' },
  { match: '### 2.3 Lane & Martin (2010, 2012)', id: 'lane2010' },
  { match: '### 2.4 Landauer (1961) & Bennett (1982)', id: 'landauer1961', extraId: 'bennett1982' },
  { match: '### 3.1 Margulis (1967, 1981)', id: 'margulis1967', extraId: 'margulis1981' },
  { match: '### 3.2 Bonner (1965)', id: 'bonner1965' },
  { match: '### 3.3 Dawkins (1982)', id: 'dawkins1982' },
  { match: '### 3.4 Lenski et al. (1991, 2003) & Blount et al. (2008)', id: 'lenski1991', extraId: 'blount2008' },
  { match: '### 3.5 Kimura (1968, 1983) & Ohno (1970)', id: 'kimura1968', extraId: 'ohno1970' },
  { match: '### 4.1 Von Neumann (1966)', id: 'vonneumann1966' },
  { match: '### 4.2 Pattee (1972, 2001)', id: 'pattee1972', extraId: 'pattee2001' },
  { match: '### 4.3 Weisfeiler & Lehman (1968)', id: 'weisfeiler1968' },
  { match: '### 4.4 Maturana & Varela (1972)', id: 'maturana1972' }
];

for (const item of anchorMap) {
  if (content.includes(item.match)) {
    const extra = item.extraId ? `<span id="${item.extraId}"></span><span id="ref-${item.extraId}"></span>` : '';
    const replacement = `### <span id="${item.id}"></span><span id="ref-${item.id}"></span>${extra}${item.match.slice(4)}`;
    content = content.replace(item.match, replacement);
  }
}

fs.writeFileSync(bibPath, content, 'utf8');
console.log('Successfully injected anchor tags into CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md');
