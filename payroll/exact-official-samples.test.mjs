import {strict as assert} from "node:assert";
import {readFileSync} from "node:fs";
import {lookupExactOfficialSample} from "./exact-official-samples.mjs";
const cases=JSON.parse(readFileSync(new URL("./official-nl-2026-sample-cases.json",import.meta.url),"utf8"));
for(const item of cases){const result=lookupExactOfficialSample(cases,item.input);assert.equal(result.status,"ok");assert.equal(Math.round(result.withholding*100),item.expectedCents);}
const input=cases[0].input;
assert.equal(lookupExactOfficialSample(cases,{...input,wage:670.51}).status,"missing-exact-example");
assert.equal(lookupExactOfficialSample(cases,{...input,wage:670.49}).status,"missing-exact-example");
assert.equal(lookupExactOfficialSample(cases,{...input,residence:"BE"}).status,"missing-exact-example");
assert.equal(lookupExactOfficialSample(cases,{...input,credit:true}).status,"missing-exact-example");
assert.equal(lookupExactOfficialSample(cases,{...input,special:true}).status,"unsupported");
assert.equal(lookupExactOfficialSample(cases,{...input,anonymous:true}).status,"unsupported");
assert.throws(()=>lookupExactOfficialSample(cases,{...input,wage:670.501}),/Ongeldig/);
assert.equal(lookupExactOfficialSample([...cases,cases[0]],input).status,"missing-exact-example");
assert.equal(lookupExactOfficialSample([{...cases[0],source:{...cases[0].source,url:"https://www.belastingdienst.nl.evil.example/example"}}],input).status,"invalid-reference");
console.log("18 exacte-bronrijcontroles geslaagd (9 bronbedragen en 8 fail-closed situaties).");
