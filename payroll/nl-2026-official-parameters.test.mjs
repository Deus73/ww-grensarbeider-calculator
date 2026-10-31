import {strict as assert} from "node:assert";
import {BRACKETS_2026,CREDIT_RESIDENCE_RIGHTS_2026,getBracket2026} from "./nl-2026-official-parameters.mjs";
import {describeHerleiding2026} from "./nl-2026-herleiding.mjs";
import {calculateNl2026NoCredit} from "./nl-2026-rekenvoorschriften-basic.mjs";
// Waarden onafhankelijk afgelezen uit Belastingdienst rekenvoorschriften 2026 v2 tabel 2,
// en de officiële parameterbijlage 2026 pagina 2-4. Geen gegenereerde verwachting uit de motor.
assert.deepEqual(BRACKETS_2026.UNDER_AOW.map(r=>[r.a,r.b,r.c]),[[0,35.75,0],[38883,37.56,13900],[78426,49.5,28752]]);
assert.deepEqual(BRACKETS_2026.AOW_1945_OR_EARLIER.map(r=>[r.a,r.b,r.c]),[[0,17.85,0],[41123,37.56,7340],[78426,49.5,21351]]);
assert.deepEqual(BRACKETS_2026.AOW_1946_OR_LATER.map(r=>[r.a,r.b,r.c]),[[0,17.85,0],[38883,37.56,6940],[78426,49.5,21792]]);
assert.equal(getBracket2026("AOW_1945_OR_EARLIER",40000).bracket.a,0);
assert.equal(getBracket2026("AOW_1946_OR_LATER",40000).bracket.a,38883);
assert.equal(getBracket2026("UNDER_AOW",78427).bracket.b,49.5);
assert.equal(getBracket2026("UNDER_AOW",-1).status,"unsupported");
assert.deepEqual(CREDIT_RESIDENCE_RIGHTS_2026.BE,{ahk:true,ark:true,ouk:false,aok:false,jgk:false});
assert.deepEqual(CREDIT_RESIDENCE_RIGHTS_2026.DL,{ahk:false,ark:false,ouk:false,aok:false,jgk:false});
const matrix={std:[true,true,true,true],AG:[false,true,true,true],BH:[true,false,false,false],CI:[true,true,true,false],DJ:[true,false,false,true],EK:[false,true,true,false],FL:[false,false,false,true]};
for(const [k,v] of Object.entries(matrix))assert.deepEqual(Object.values(describeHerleiding2026(k).liable),v);
const input={period:"maand",residence:"NL",type:"wit",insurance:"VOLLEDIG",credit:false,ageGroup:"UNDER_AOW"};
for(const wage of [0,500,3000,3240.25,7000,11092.5]){
 const actual=calculateNl2026NoCredit({...input,wage});
 const L=Math.floor(wage*12/54)*54;
 const {a,b,c}=getBracket2026("UNDER_AOW",L).bracket;
 const independentlyComputed=Math.round(Math.floor((L-a)*b/100+c+1e-9)/12*100)/100;
 assert.equal(actual.withholding,independentlyComputed,"Brontariefvergelijking bij "+wage);
}
console.log("Official-source parameter checks passed; full official table comparison remains pending.");
