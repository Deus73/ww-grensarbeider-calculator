/** Alleen een door de gebruiker gecontroleerde tabel als loonheffing gebruiken; nooit gokken. */
import {lookupWithholding} from "./nl-2026-table-engine.mjs";
export function calculateNetFromTable(table,input,extras={}){
 if(!table?.groups)throw new Error("Geen ingeladen loonbelastingtabel");
 const wage=input?.wage;
 if(typeof wage!=="number"||!Number.isFinite(wage)||wage<0||Math.abs(wage*100-Math.round(wage*100))>1e-7)throw new Error("Ongeldig brutoloon");
 const deduction=extras.otherDeductions??0;
 if(typeof deduction!=="number"||!Number.isFinite(deduction)||deduction<0||Math.abs(deduction*100-Math.round(deduction*100))>1e-7)throw new Error("Ongeldige overige inhoudingen");
 const tax=lookupWithholding(table,input);
 if(tax.status!=="ok")return {status:tax.status,reason:tax.reason,net:null};
 const grossCents=Math.round(wage*100),taxCents=Math.round(tax.withholding*100),otherCents=Math.round(deduction*100);
 return {status:"ok",gross:wage,withholding:tax.withholding,otherDeductions:deduction,net:(grossCents-taxCents-otherCents)/100,source:tax.source,matchedRange:tax.matchedRange,scope:"Netto na ingeladen loonheffing en opgegeven overige inhoudingen; geen volledige loonstrook of grensarbeiderberekening"};
}
