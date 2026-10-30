/** Controle van tabelbereik en randgevallen zonder fictieve bedragen te berekenen. */
import {lookupWithholding,PERIODS,RESIDENCES,TYPES} from "./nl-2026-table-engine.mjs";
export function inspectPayrollTable(table,selection){
 if(!table?.groups||!selection)throw new Error("Laad een gevalideerde tabel en kies een combinatie");
 if(!PERIODS.includes(selection.period)||!RESIDENCES.includes(selection.residence)||!TYPES.includes(selection.type)||typeof selection.credit!=="boolean"||typeof selection.insurance!=="string"||!selection.insurance.trim())throw new Error("Ongeldige tabelselectie");
 const key=[2026,selection.period,selection.residence,selection.type,selection.insurance,selection.credit].join("|");
 const rows=table.groups.get(key);
 if(!rows)return {status:"missing-table",key,rows:0,complete:false,reason:"Deze combinatie ontbreekt"};
 const first=rows[0],last=rows[rows.length-1];
 const minCents=Math.round(first.lower*100),maxCents=Math.round(last.upper*100);
 let gaps=0,overlaps=0;
 for(let i=1;i<rows.length;i++){const diff=Math.round(rows[i].lower*100)-Math.round(rows[i-1].upper*100);if(diff>0)gaps++;if(diff<0)overlaps++;}
 const atLower=lookupWithholding(table,{...selection,wage:first.lower});
 const belowUpper=maxCents>minCents?lookupWithholding(table,{...selection,wage:(maxCents-1)/100}):null;
 const atUpper=lookupWithholding(table,{...selection,wage:last.upper});
 return {status:"present",key,rows:rows.length,firstWage:first.lower,lastWageExclusive:last.upper,gaps,overlaps,lowerBoundMatched:atLower.status==="ok",lastCentMatched:belowUpper?.status==="ok",upperBoundRejected:atUpper.status==="missing-row",complete:false,reason:"Lokale intervallen zijn gecontroleerd; officiële tabeldekking en fiscale juistheid niet vastgesteld"};
}
