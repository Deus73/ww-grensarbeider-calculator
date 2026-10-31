/** Bulkcontrole van tijdvaklonen, zonder extrapolatie of impliciete afronding. */
import {calculateNetFromTable} from "./net-from-table.mjs";
export function calculatePayrollBatch(table,selection,wages,otherDeductions=0){
 if(!Array.isArray(wages)||wages.length===0||wages.length>500)throw new Error("Geef 1 tot maximaal 500 lonen op");
 if(!selection||typeof selection!=="object")throw new Error("Kies een tabelcombinatie");
 const results=wages.map((wage,index)=>{
  try{
   const result=calculateNetFromTable(table,{...selection,wage},{otherDeductions});
   return {line:index+1,wage,...result};
  }catch(error){return {line:index+1,wage,status:"invalid",reason:error.message,net:null};}
 });
 return {total:results.length,ok:results.filter(r=>r.status==="ok").length,failed:results.filter(r=>r.status!=="ok").length,results,notice:"Alleen opzoeking in ingeladen tabel; geen zelfstandige fiscale validatie."};
}
export function parseBatchWages(text){
 if(typeof text!=="string"||text.length>10000)throw new Error("Ongeldige invoer of te veel tekens");
 const values=text.split(/[\n;]+/).map(s=>s.trim()).filter(Boolean);
 if(values.length===0||values.length>500)throw new Error("Geef 1 tot maximaal 500 lonen op");
 return values.map(v=>{if(!/^(?:\d+)(?:[.,]\d{1,2})?$/.test(v))throw new Error("Ongeldig loon: "+v);const amount=Number(v.replace(",","."));if(!Number.isFinite(amount)||!Number.isSafeInteger(Math.round(amount*100)))throw new Error("Loon te groot: "+v);return amount;});
}
export function batchResultsCsv(report){
 if(!report||!Array.isArray(report.results))throw new Error("Ongeldig batchrapport");
 const head="line;wage;status;withholding;otherDeductions;net;reason";
 const esc=v=>'"'+String(v??"").replaceAll('"','""')+'"';
 return [head,...report.results.map(r=>[r.line,r.wage,r.status,r.withholding,r.otherDeductions,r.net,r.reason].map(esc).join(";"))].join("\n")+"\n";
}
