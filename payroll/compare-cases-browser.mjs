/** Vergelijk geïmporteerde loonbelastingtabellen met onafhankelijk aangeleverde referentiecases. */
import {lookupWithholding} from "./nl-2026-table-engine.mjs";
export function comparePayrollCases(table,cases){
 if(!table?.groups)throw new Error("Laad eerst een loonbelastingtabel.");
 if(!Array.isArray(cases)||cases.length===0)throw new Error("Geen referentiecases aangeleverd.");
 if(cases.length>10000)throw new Error("Maximaal 10000 referentiecases.");
 const seen=new Set();
 const results=cases.map((item,i)=>{
  if(!item||typeof item!=="object"||!item.input||!Number.isSafeInteger(item.expectedCents)||item.expectedCents<0)throw new Error("Ongeldige referentiecase "+(i+1));
  const source=item.source;
  if(!source||!/^https:\/\/(www\.)?belastingdienst\.nl\//.test(source.url||"")||typeof source.document!=="string"||!source.document.trim()||!source.page||!source.date)throw new Error("Case "+(i+1)+" mist een controleerbare bron, pagina of datum.");
  const key=JSON.stringify([item.input.wage,item.input.period,item.input.residence,item.input.type,item.input.insurance,item.input.credit,item.input.special===true,item.input.anonymous===true]);
  if(seen.has(key))throw new Error("Dubbele referentiecase "+(i+1));
  seen.add(key);
  const actual=lookupWithholding(table,item.input);
  const actualCents=actual.status==="ok"?Math.round(actual.withholding*100):null;
  return {case:i+1,status:actual.status,expectedCents:item.expectedCents,actualCents,pass:actualCents===item.expectedCents&&actual.status==="ok",source};
 });
 return {passed:results.filter(r=>r.pass).length,total:results.length,failed:results.filter(r=>!r.pass).length,results,verified:false,notice:"Bronmetadata en referentiebedragen zijn door de gebruiker aangeleverd; onafhankelijkheid en authenticiteit zijn niet geverifieerd."};
}
