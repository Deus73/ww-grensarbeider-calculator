import {strict as assert} from "node:assert";
import {readFileSync} from "node:fs";
const html=readFileSync(new URL("../loonheffing-2026.html",import.meta.url),"utf8");
for(const id of ["sample","load","calculate","compare","downloadReport","loadResult","result","comparison"])assert.match(html,new RegExp('id="'+id+'"'));
for(const marker of ["grenscalc-loonheffing-2026-sjabloon.csv","const details=","Indicatief netto na uitsluitend loonheffing","grenscalc-referentiecontrole-2026.json"])assert.ok(html.includes(marker),marker);
const script=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];assert.ok(script,"Module-script ontbreekt");
new Function(script.replace(/^import .*;$/gm,""));
assert.match(html,/geen officiële tabellen meegeleverd/);
console.log("14 controles op tabelimportinterface geslaagd.");
