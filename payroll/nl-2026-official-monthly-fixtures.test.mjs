import {strict as assert} from "node:assert";
import {calculateNl2026NoCredit} from "./nl-2026-rekenvoorschriften-basic.mjs";
// Handmatig uit officiële Belastingdienst Witte Maandtabel 2026 NL Standaard,
// kolom jonger dan AOW, zonder loonheffingskorting. Geen zelfgegenereerde referenties.
// https://download.belastingdienst.nl/belastingdienst/dl/rekenhulpen/loonheffing/2026/v01/pdf/wit_mnd_nl_std_20260101.pdf
const officialRows=[
 [684.00,244.50],[688.50,246.08],[693.00,247.67],[697.50,249.33],
 [702.00,250.92],[706.50,252.50],[711.00,254.17],[715.50,255.75],
 [720.00,257.33],[724.50,259.00],[729.00,260.58],[733.50,262.17],
 [738.00,263.83],[742.50,265.42],[747.00,267.00],[751.50,268.58],
 [756.00,270.25],[760.50,271.83]
];
const base={period:"maand",residence:"NL",type:"wit",insurance:"VOLLEDIG",credit:false,ageGroup:"UNDER_AOW"};
const errors=[];
for(const [wage,expected] of officialRows){
 const r=calculateNl2026NoCredit({...base,wage});
 if(r.status!=="ok"||r.withholding!==expected)errors.push({wage,expected,actual:r.withholding,status:r.status});
}
assert.deepEqual(errors,[],"Afwijkingen t.o.v. onafhankelijke officiële tijdvaktabel");
console.log(officialRows.length+" officiële maandtabelrijen tot op de cent gevalideerd.");
