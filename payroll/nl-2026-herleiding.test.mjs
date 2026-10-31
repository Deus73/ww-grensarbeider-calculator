import {strict as assert} from "node:assert";
import {describeHerleiding2026 as describe} from "./nl-2026-herleiding.mjs";
const expected={std:[1,1,1,1],AG:[0,1,1,1],BH:[1,0,0,0],CI:[1,1,1,0],DJ:[1,0,0,1],EK:[0,1,1,0],FL:[0,0,0,1]};
for(const [code,flags] of Object.entries(expected)){
 const r=describe(code);
 assert.equal(r.status,"ok");
 assert.deepEqual(Object.values(r.liable),flags.map(Boolean));
 assert.equal(r.withholding,null);
 assert.equal(r.requiresOfficial2026Substitution,true);
 assert.equal(r.verifiedOfficial,false);
}
for(const bad of ["", "ZZ", "std|AG", null])assert.equal(describe(bad).status,"unsupported");
console.log("Herleidingsmatrix tests passed; no tax amount generated.");
