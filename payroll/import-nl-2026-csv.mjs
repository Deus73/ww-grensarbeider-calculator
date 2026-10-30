/**
 * CSV-import van reeds gecontroleerde Nederlandse loonbelastingtabellen.
 * Vereist expliciete kolommen en bronmetadata; doet geen automatische
 * interpretatie van Belastingdienst-PDF's of herleidingsformules.
 */
import {makeTable} from "./nl-2026-table-engine.mjs";
export const CSV_COLUMNS=["year","period","residence","type","insurance","credit","lower","upper","withholding"];
export function parsePayrollCsv(csv,source) {
  if (typeof csv!=="string" || !csv.trim()) throw new Error("Leeg CSV-bestand");
  const normalized=csv.replace(/^\uFEFF/,"");
  const firstLine=normalized.split(/\r?\n/,1)[0];
  const delimiter=firstLine.includes(";")?";":",";
  const records=[];let record=[],field="",quoted=false,closed=false,started=false;
  for(let i=0;i<normalized.length;i++){
    const c=normalized[i];
    if(quoted){
      if(c==='"'&&normalized[i+1]==='"'){field+='"';i++;}
      else if(c==='"') {quoted=false;closed=true;}
      else field+=c;
    } else if(c==='"'){
      if(started||field.trim()!==""||closed) throw new Error("Ongeldige CSV-aanhalingstekens");
      quoted=true;started=true;
    } else if(c===delimiter){record.push(field.trim());field="";closed=false;started=false;}
    else if(c==="\n"||c==="\r"){
      if(c==="\r"&&normalized[i+1]==="\n")i++;
      record.push(field.trim());
      if(record.some(v=>v!==""))records.push(record);
      record=[];field="";closed=false;
    } else {
      if(closed&&!/\s/.test(c))throw new Error("Tekst na afsluitend aanhalingsteken");
      field+=c;started=true;
    }
  }
  if(quoted)throw new Error("Niet-afgesloten CSV-aanhalingsteken");
  record.push(field.trim());
  if(record.some(v=>v!==""))records.push(record);
  const lines=records;
  const split=line=>line;
  if(!lines.length) throw new Error("CSV-kopregel ontbreekt");
  const header=split(lines.shift());
  if (header.length!==CSV_COLUMNS.length || new Set(header).size!==header.length || CSV_COLUMNS.some(c=>!header.includes(c))) throw new Error("CSV-kolommen komen niet overeen met het vereiste schema");
  const rows=lines.map((line,i)=>{
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
