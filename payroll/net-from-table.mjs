/** Alleen een door de gebruiker gecontroleerde tabel als loonheffing gebruiken; nooit gokken. */
import {lookupWithholding} from "./nl-2026-table-engine.mjs";
const validMoney=n=>typeof n==="number"&&Number.isFinite(n)&&n>=0&&Number.isSafeInteger(Math.round(n*100))&&Math.abs(n*100-Math.round(n*100))<1e-7;
export function calculateNetFromTable(table,input,extras={}){
 if(!table?.groups)throw new Error("Geen ingeladen loonbelastingtabel");
 const wage=input?.wage;
 if(!validMoney(wage))throw new Error("Ongeldig brutoloon");
 const deduction=extras.otherDeductions??0;
 if(!validMoney(deduction))throw new Error("Ongeldige overige inhoudingen");
 const tax=lookupWithholding(table,input);
 if(tax.status!=="ok")return {status:tax.status,reason:tax.reason,net:null};
 const grossCents=Math.round(wage*100),taxCents=Math.round(tax.withholding*100),otherCents=Math.round(deduction*100);
 if(!validMoney(tax.withholding)||!Number.isSafeInteger(grossCents-taxCents-otherCents))return {status:"invalid-result",reason:"Ongeldig of te groot inhoudingsbedrag; netto niet berekend",net:null};
 return {status:"ok",gross:wage,withholding:tax.withholding,otherDeductions:deduction,net:Number(BigInt(grossCents)-BigInt(taxCents)-BigInt(otherCents))/100,source:tax.source,matchedRange:tax.matchedRange,scope:"Netto na ingeladen loonheffing en opgegeven overige inhoudingen; geen volledige loonstrook of grensarbeiderberekening"};
}
