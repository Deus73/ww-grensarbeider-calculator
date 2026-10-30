/** Twee ondersteunde loonscenario's vergelijken, zonder belastingtabellen te extrapoleren. */
import {calculateNetFromTable} from "./net-from-table.mjs";
export function compareNetScenarios(table,first,second,options={}){
 const a=calculateNetFromTable(table,first,{otherDeductions:options.firstDeductions??0});
 const b=calculateNetFromTable(table,second,{otherDeductions:options.secondDeductions??0});
 if(a.status!=="ok"||b.status!=="ok")return {status:"unavailable",first:a,second:b,reason:"Beide scenario's vereisen een ondersteunde tabelrij; geen geschatte vergelijking."};
 const cents=n=>Math.round(n*100);
 return {status:"ok",first:a,second:b,deltaGross:(cents(b.gross)-cents(a.gross))/100,deltaWithholding:(cents(b.withholding)-cents(a.withholding))/100,deltaNet:(cents(b.net)-cents(a.net))/100,notice:"Alleen verschillen in ingeladen tabelbedragen en expliciet opgegeven inhoudingen; geen complete grensarbeiderberekening."};
}
