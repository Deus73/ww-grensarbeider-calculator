/** Inspecteer alle geïmporteerde combinaties en rapporteer ontbrekende combinaties. */
import {PERIODS,RESIDENCES,TYPES} from "./nl-2026-table-engine.mjs";
import {inspectPayrollTable} from "./table-diagnostics.mjs";
export function buildPayrollInventory(table,requirements=[]){
 if(!(table?.groups instanceof Map))throw new Error("Geen gevalideerde tabel geladen");
 if(!Array.isArray(requirements)||requirements.length>1000)throw new Error("Ongeldige lijst vereiste combinaties");
 const entries=[];
 for(const key of table.groups.keys()){
  const parts=key.split("|");
  if(parts.length!==6||parts[0]!=="2026")throw new Error("Ongeldige tabelsleutel");
  const selection={period:parts[1],residence:parts[2],type:parts[3],insurance:parts[4],credit:parts[5]==="true"};
  entries.push({...inspectPayrollTable(table,selection),selection});
 }
 const present=new Set(entries.map(x=>x.key));
 const missing=requirements.map(req=>{
  if(!req||!PERIODS.includes(req.period)||!RESIDENCES.includes(req.residence)||!TYPES.includes(req.type)||typeof req.insurance!=="string"||!req.insurance.trim()||typeof req.credit!=="boolean")throw new Error("Ongeldige vereiste tabelcombinatie");
  return {key:[2026,req.period,req.residence,req.type,req.insurance,req.credit].join("|"),selection:req};
 }).filter(x=>!present.has(x.key));
 return {year:2026,groups:entries.length,totalRows:entries.reduce((n,e)=>n+e.rows,0),entries,missing,complete:false,notice:"Aanwezige combinaties en aaneengesloten intervallen bewijzen niet dat de officiële tabellen volledig of correct zijn."};
}
export function inventoryToCsv(inventory){
 if(!inventory||!Array.isArray(inventory.entries))throw new Error("Ongeldig tabeloverzicht");
 const head="year;period;residence;type;insurance;credit;rows;firstWage;lastWageExclusive;gaps;overlaps";
 const cell=v=>'"'+String(v??"").replaceAll('"','""')+'"';
 return [head,...inventory.entries.map(e=>[2026,e.selection.period,e.selection.residence,e.selection.type,e.selection.insurance,e.selection.credit,e.rows,e.firstWage,e.lastWageExclusive,e.gaps,e.overlaps].map(cell).join(";"))].join("\n")+"\n";
}
