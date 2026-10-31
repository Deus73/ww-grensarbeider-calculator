import {lookupWithholding} from "./nl-2026-table-engine.mjs";
import {calculateNl2026NoCredit} from "./nl-2026-rekenvoorschriften-basic.mjs";
export function calculatePayroll2026(table,input){
 if(!input||typeof input!=="object")throw Error("Ongeldige invoer");
 if(!["UNDER_AOW","FULL_YEAR_AOW","REACHES_AOW_2026"].includes(input.ageGroup))return {status:"unsupported",reason:"AOW-leeftijdscategorie ontbreekt",withholding:null};
 if(input.ageGroup==="REACHES_AOW_2026"||input.herleiding!==undefined||input.international===true)return {status:"unsupported",reason:"AOW-overgang of herleiding vereist afzonderlijk geverifieerde regels",withholding:null};
 if(table?.groups instanceof Map){
  const r=lookupWithholding(table,input);
  return {...r,verifiedOfficial:false,calculationMode:"imported-table"};
 }
 if(input.ageGroup!=="UNDER_AOW"||input.credit!==false)return {status:"unsupported",reason:"Officiële tabel nodig voor loonheffingskorting en AOW",withholding:null};
 return {...calculateNl2026NoCredit(input),calculationMode:"restricted-formula"};
}
