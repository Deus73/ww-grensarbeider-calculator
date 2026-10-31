/** Controleert de beperkte 2026-rekenformule tegen afzonderlijk ingeladen tijdvaktabelrijen.
 * Een match is geen bewijs van officiële authenticiteit van de tabel.
 */
import {calculateNl2026NoCredit} from "./nl-2026-rekenvoorschriften-basic.mjs";
import {lookupWithholding} from "./nl-2026-table-engine.mjs";
export function compareFormulaWithTable(table,inputs){
 if(!(table?.groups instanceof Map))throw Error("Laad een gevalideerde loonbelastingtabel");
 if(!Array.isArray(inputs)||inputs.length<1||inputs.length>10000)throw Error("Geef 1 tot 10000 toetsgevallen");
 const results=inputs.map((input,index)=>{
  const formula=calculateNl2026NoCredit(input);
  if(formula.status!=="ok")return {index:index+1,status:"unsupported",reason:formula.reason,pass:false};
  const lookup=lookupWithholding(table,input);
  if(lookup.status!=="ok")return {index:index+1,status:lookup.status,reason:lookup.reason,pass:false};
  const expectedCents=Math.round(lookup.withholding*100);
  const actualCents=Math.round(formula.withholding*100);
  return {index:index+1,status:expectedCents===actualCents?"match":"mismatch",wage:input.wage,period:input.period,expectedCents,actualCents,differenceCents:actualCents-expectedCents,pass:expectedCents===actualCents};
 });
 return {total:results.length,matched:results.filter(r=>r.status==="match").length,mismatched:results.filter(r=>r.status==="mismatch").length,unverified:results.filter(r=>r.status!=="match"&&r.status!=="mismatch").length,results,verifiedOfficial:false,notice:"Een vergelijking met een gebruikersbestand bevestigt de fiscale authenticiteit niet."};
}
