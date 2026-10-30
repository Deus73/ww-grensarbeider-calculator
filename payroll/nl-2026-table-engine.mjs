/**
 * GrensCalc — official-table payroll lookup adapter (2026).
 * This is a table reader, NOT an implementation of the full 2026 calculation instructions.
 * No tax amounts are generated unless an independently supplied official table row matches.
 */
export const PERIODS = Object.freeze(["dag","week","vierweken","maand","kwartaal","jaar"]);
export const RESIDENCES = Object.freeze(["NL","BE","EU_EER_CH_BES","DERDE_LAND","ARUBA_SURINAME"]);
export const TYPES = Object.freeze(["wit","groen"]);
const finite = n => typeof n === "number" && Number.isFinite(n);
const cents = n => Math.round((n + Number.EPSILON) * 100);
const exactCents = n => finite(n) && Math.abs(n * 100 - Math.round(n * 100)) < 1e-7;
export function validateRow(row) {
  if (!row || typeof row !== "object") throw new Error("Ongeldige tabelrij");
  for (const field of ["year","period","residence","type","insurance","credit","lower","upper","withholding"]) {
    if (!(field in row)) throw new Error("Ontbrekend veld: "+field);
  }
  if (row.year !== 2026 || !PERIODS.includes(row.period) || !RESIDENCES.includes(row.residence) || !TYPES.includes(row.type)) throw new Error("Ongeldige tabelidentificatie");
  if (typeof row.insurance !== "string" || !row.insurance || typeof row.credit !== "boolean") throw new Error("Verzekering of loonheffingskorting ontbreekt");
  if (![row.lower,row.upper,row.withholding].every(exactCents) || row.lower < 0 || row.upper <= row.lower || row.withholding < 0) throw new Error("Ongeldig looninterval of inhouding");
  return Object.freeze({...row});
}
export function makeTable(rows, source) {
  if (!source || !/^https:\/\/(www\.)?belastingdienst\.nl\//.test(source.url || "") || !source.document || !source.date) throw new Error("Controleerbare Belastingdienst-bron vereist");
  if (!Array.isArray(rows) || rows.length === 0) throw new Error("Geen tabelgegevens aangeleverd");
  const clean = rows.map(validateRow);
  const key = r => [r.year,r.period,r.residence,r.type,r.insurance,r.credit].join("|");
  const groups = new Map();
  for (const row of clean) {const k=key(row);if(!groups.has(k)) groups.set(k,[]);groups.get(k).push(row);}
  for (const group of groups.values()) {
    group.sort((a,b)=>a.lower-b.lower);
    for (let i=1;i<group.length;i++) {
      if (cents(group[i].lower) < cents(group[i-1].upper)) throw new Error("Overlappende loonintervallen");
      if (cents(group[i].lower) > cents(group[i-1].upper)) throw new Error("Ontbrekend looninterval in tabel");
    }
  }
  return Object.freeze({source:Object.freeze({...source}),groups});
}
export function lookupWithholding(table, input) {
  if (!table || !table.groups) throw new Error("Geen gevalideerde tabel geladen");
  if (!exactCents(input.wage) || input.wage < 0) throw new Error("Ongeldig tijdvakloon");
  if (input.special === true) return {status:"unsupported",reason:"Gebruik officiële tabel bijzondere beloningen"};
  if (input.anonymous === true) return {status:"unsupported",reason:"Anoniementarief vereist aparte regels"};
  if (!PERIODS.includes(input.period) || !RESIDENCES.includes(input.residence) || !TYPES.includes(input.type) || typeof input.credit!=="boolean" || !input.insurance) return {status:"unsupported",reason:"Onvolledige tabelselectie"};
  const k=[2026,input.period,input.residence,input.type,input.insurance,input.credit].join("|");
  const rows=table.groups.get(k);
  if (!rows) return {status:"missing-table",reason:"Officiële tabel voor deze combinatie ontbreekt"};
  const wageCents=cents(input.wage);
  const row=rows.find(r=>wageCents>=cents(r.lower)&&wageCents<cents(r.upper));
  if (!row) return {status:"missing-row",reason:"Geen passende officiële loonrij; geen extrapolatie toegestaan"};
  return {status:"ok",withholding:row.withholding,source:table.source,matchedRange:[row.lower,row.upper],year:2026};
}
