/**
 * Onafhankelijke validatie van loonheffing tegen vastgelegde officiële
 * voorbeeldbedragen. Zonder geverifieerde cases geeft dit expliciet GEEN PASS.
 *
 * Gebruik:
 * node payroll/verify-official-2026.mjs pad/naar/official-cases.json
 */
import {readFileSync} from "node:fs";
import {makeTable,lookupWithholding} from "./nl-2026-table-engine.mjs";

export function verifyOfficialCases(table, cases) {
  if (!Array.isArray(cases) || cases.length===0) throw new Error("Geen onafhankelijke officiële vergelijkingscases: validatie niet uitgevoerd");
  const seen=new Set();
  const results=cases.map((item,index)=>{
    if (!item || typeof item!=="object" || !item.source || !/^https:\/\/(www\.)?belastingdienst\.nl\//.test(item.source.url||"") || !item.source.document || !item.source.page || !item.source.date || !Number.isInteger(item.expectedCents) || item.expectedCents<0) throw new Error("Case "+(index+1)+": controleerbare officiële bron, pagina en bedrag in centen vereist");
    const key=JSON.stringify([item.input?.period,item.input?.residence,item.input?.type,item.input?.insurance,item.input?.credit,item.input?.wage,item.input?.special===true,item.input?.anonymous===true]);
    if(seen.has(key)) throw new Error("Dubbele officiële vergelijkingscase: "+(index+1));
    seen.add(key);
    const actual=lookupWithholding(table,item.input);
    const actualCents=actual.status==="ok"?Math.round(actual.withholding*100):null;
    return {case:index+1,source:item.source,status:actual.status,expectedCents:item.expectedCents,actualCents,pass:actual.status==="ok"&&actualCents===item.expectedCents};
  });
  return {passed:results.filter(r=>r.pass).length,total:results.length,results};
}
if (process.argv[1] && import.meta.url===new URL("file://"+process.argv[1]).href) {
  try {
    if (!process.argv[2]) throw new Error("Gebruik: node payroll/verify-official-2026.mjs bestand.json");
    const data=JSON.parse(readFileSync(process.argv[2],"utf8"));
    const table=makeTable(data.rows,data.tableSource);
    const report=verifyOfficialCases(table,data.cases);
    console.log(JSON.stringify(report,null,2));
    if (report.passed!==report.total) process.exitCode=1;
  } catch(e) {console.error("NIET GEVALIDEERD:",e.message);process.exitCode=1;}
}
