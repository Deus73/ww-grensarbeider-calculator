/**
 * CSV-import van reeds gecontroleerde Nederlandse loonbelastingtabellen.
 * Vereist expliciete kolommen en bronmetadata; doet geen automatische
 * interpretatie van Belastingdienst-PDF's of herleidingsformules.
 */
import {makeTable} from "./nl-2026-table-engine.mjs";
export const CSV_COLUMNS=["year","period","residence","type","insurance","credit","lower","upper","withholding"];
export function parsePayrollCsv(csv,source) {
  if (typeof csv!=="string" || !csv.trim()) throw new Error("Leeg CSV-bestand");
  const lines=csv.replace(/^\uFEFF/,"").replace(/\r\n?/g,"\n").trim().split("\n");
  const delimiter=lines[0].includes(";")?";":",";
  const split=line=>line.split(delimiter).map(v=>v.trim());
  const header=split(lines.shift());
  if (header.length!==CSV_COLUMNS.length || new Set(header).size!==header.length || CSV_COLUMNS.some(c=>!header.includes(c))) throw new Error("CSV-kolommen komen niet overeen met het vereiste schema");
  const rows=lines.filter(line=>line.trim()).map((line,i)=>{
    const values=split(line);
    if(values.length!==header.length) throw new Error("Ongeldig aantal kolommen op regel "+(i+2));
    const raw=Object.fromEntries(header.map((h,j)=>[h,values[j]]));
    for(const key of ["year","lower","upper","withholding"]) {
      if(!/^\d+(?:\.\d{1,2})?$/.test(raw[key])) throw new Error("Gebruik decimale punt en maximaal twee decimalen voor "+key+" op regel "+(i+2));
      raw[key]=Number(raw[key]);
    }
    if(!["true","false"].includes(raw.credit)) throw new Error("credit moet true of false zijn");
    raw.credit=raw.credit==="true";
    return raw;
  });
  return makeTable(rows,source);
}
