/** Exacte, niet-geïnterpoleerde opzoeking in gepubliceerde bronvoorbeelden. */
import {isBelastingdienstSourceUrl} from "./nl-2026-table-engine.mjs";
export function lookupExactOfficialSample(cases,input){
 if(!Array.isArray(cases)||!input||typeof input!=="object")throw new Error("Ongeldige referentiegegevens");
 if(!Number.isFinite(input.wage)||input.wage<0||!Number.isInteger(Math.round(input.wage*100))||Math.abs(input.wage*100-Math.round(input.wage*100))>1e-7)throw new Error("Ongeldig loonbedrag");
 if(input.special===true||input.anonymous===true)return {status:"unsupported",reason:"Bijzondere beloning en anoniementarief vallen buiten deze voorbeelden"};
 const keys=["period","residence","type","insurance","credit"];
 const matches=cases.filter(c=>c&&c.input&&keys.every(k=>c.input[k]===input[k])&&Math.round(c.input.wage*100)===Math.round(input.wage*100));
 if(matches.length!==1)return {status:"missing-exact-example",reason:"Geen exact gepubliceerd voorbeeld voor deze combinatie; geen afronding of interpolatie"};
 const found=matches[0];
 if(!Number.isSafeInteger(found.expectedCents)||found.expectedCents<0||!isBelastingdienstSourceUrl(found.source?.url))return {status:"invalid-reference",reason:"Referentiebedrag of bron ontbreekt"};
 return {status:"ok",withholding:found.expectedCents/100,source:found.source,exactWage:found.input.wage,referenceOnly:true};
}
