import {readFileSync} from "node:fs";
import {strict as assert} from "node:assert";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
function between(start,end) {
 const a=html.indexOf(start),b=html.indexOf(end,a+start.length);
 assert.ok(a>=0&&b>a,"Ontbrekend scriptsegment: "+start);
 return html.slice(a,b);
}
const f=(key,label,value=0,unit="€")=>({key,label,value,unit});
const euro=n=>new Intl.NumberFormat("nl-NL",{style:"currency",currency:"EUR",maximumFractionDigits:2}).format(Number.isFinite(n)?n:0);
const raw=between("const tools=[","\nlet active=");
const tools=Function("f","euro","return "+raw.slice("const tools=".length).trim().replace(/;$/,""))(f,euro);
assert.ok(Array.isArray(tools)&&tools.length>=15,"Verwacht minstens 15 rekentools");
const tests=Function("tools","euro",between("function payrollRegression2026()","function showPayrollTests()")+"return payrollRegression2026()")(tools,euro);
assert.ok(tests.length>=11,"Regressiesuite mag niet krimpen");
for (const test of tests) assert.equal(test.pass,true,test.name+": "+test.actual+" versus "+test.expected);
const salary=tools.find(t=>t.id==="salary");
assert.ok(salary,"Salarismodule ontbreekt");
const profile={res:"NL",job:"NL",gross:3000,age:40};
const v={auto:2,social:0,tax:0,other:0,overtime:0,bonus:0,voucher:0,reimburse:0,deduction:0,holiday:0,thirteenth:0,annualTax:0};
for (const [label,override] of [["weekloon",{period:2}],["niet volksverzekerd",{insurance:0}],["bijzondere beloning",{special:1}]]) {
 assert.equal(salary.calc(profile,{...v,...override}).value,"—",label+" mag geen automatische jaarindicatie opleveren");
}
console.log(tests.length+" calculatorregressies en 3 blokkeringen geslaagd. Dit is geen officiële fiscale validatie.");
