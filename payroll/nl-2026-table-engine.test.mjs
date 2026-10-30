import {strict as assert} from "node:assert";
import {makeTable,lookupWithholding,auditTableCoverage} from "./nl-2026-table-engine.mjs";
const source={url:"https://www.belastingdienst.nl/wps/wcm/connect/nl/personeel-en-loon/content/hulpmiddel-loonbelastingtabellen",document:"Testfixture, NIET officiële tabelwaarden",date:"2026-10-30"};
// These are synthetic fixtures testing lookup mechanics only, not tax correctness.
const rows=[
 {year:2026,period:"maand",residence:"NL",type:"wit",insurance:"VOLLEDIG",credit:true,lower:0,upper:2000,withholding:100},
 {year:2026,period:"maand",residence:"NL",type:"wit",insurance:"VOLLEDIG",credit:true,lower:2000,upper:4000,withholding:300},
 {year:2026,period:"maand",residence:"BE",type:"wit",insurance:"VOLLEDIG",credit:true,lower:0,upper:4000,withholding:450}
];
const table=makeTable(rows,source);
const q={wage:2500,period:"maand",residence:"NL",type:"wit",insurance:"VOLLEDIG",credit:true};
assert.equal(lookupWithholding(table,q).withholding,300);
assert.equal(lookupWithholding(table,{...q,residence:"BE"}).withholding,450);
assert.equal(lookupWithholding(table,{...q,wage:4000}).status,"missing-row");
assert.equal(lookupWithholding(table,{...q,period:"week"}).status,"missing-table");
assert.equal(lookupWithholding(table,{...q,special:true}).status,"unsupported");
assert.equal(lookupWithholding(table,{...q,insurance:"ALLEEN_BELASTING"}).status,"missing-table");
assert.throws(()=>makeTable([...rows,rows[0]],source),/Overlappende/);
assert.throws(()=>makeTable([{...rows[0],withholding:-1}],source),/Ongeldig/);
assert.throws(()=>makeTable(rows,{url:"https://example.org",document:"bad",date:"2026"}),/Belastingdienst/);
assert.throws(()=>makeTable([{...rows[0],upper:1999.99},rows[1]],source),/Ontbrekend looninterval/);
assert.throws(()=>makeTable([{...rows[0],withholding:100.001}],source),/Ongeldig/);
assert.throws(()=>lookupWithholding(table,{...q,wage:2500.001}),/Ongeldig/);
const audit=auditTableCoverage(table,[
 {period:"maand",residence:"NL",type:"wit",insurance:"VOLLEDIG",credit:true},
 {period:"week",residence:"BE",type:"wit",insurance:"VOLLEDIG",credit:true}
]);
assert.equal(audit.present,1);
assert.equal(audit.missing,1);
assert.equal(audit.results[0].rows,2);
assert.equal(audit.results[1].lastWage,null);
console.log("16 adapter- en dekkingscontroles geslaagd; synthetische waarden zijn NIET officieel.");
