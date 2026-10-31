/** Heffingsplichtmatrix herleidingssituaties, niet de substitutiewaarden of volledige loonheffing.
 * Controleer de actuele 2026-parameterbijlage voor een definitieve berekening.
 */
const MATRIX=Object.freeze({
 std:[true,true,true,true],
 AG:[false,true,true,true],
 BH:[true,false,false,false],
 CI:[true,true,true,false],
 DJ:[true,false,false,true],
 EK:[false,true,true,false],
 FL:[false,false,false,true]
});
export function describeHerleiding2026(code){
 if(typeof code!=="string"||!Object.hasOwn(MATRIX,code))return {status:"unsupported",reason:"Onbekende herleidingssituatie"};
 const [lb,aow,anw,wlz]=MATRIX[code];
 return {status:"ok",code,liable:{lb,aow,anw,wlz},requiresOfficial2026Substitution:true,withholding:null,verifiedOfficial:false,notice:"Dit bepaalt alleen de componenten; 2026-herleidingsfactoren, woonlandrechten, tijdvakformules en fiscale toetsing ontbreken."};
}
