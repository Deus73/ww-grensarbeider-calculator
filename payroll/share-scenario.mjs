/** Deelbare invoer voor de loonheffingmodule; geen belastingdata of persoonsgegevens in de URL. */
const periods=new Set(["dag","week","vierweken","maand","kwartaal","jaar"]);
const residences=new Set(["NL","BE","EU_EER_CH_BES","DERDE_LAND","ARUBA_SURINAME"]);
const types=new Set(["wit","groen"]);
export function encodePayrollScenario(input){
 if(!input||typeof input!=="object")throw Error("Ongeldig scenario");
 const wage=input.wage;
 if(!Number.isFinite(wage)||wage<0||Math.abs(wage*100-Math.round(wage*100))>1e-7)throw Error("Ongeldig loon");
 if(!periods.has(input.period)||!residences.has(input.residence)||!types.has(input.type)||typeof input.credit!=="boolean")throw Error("Ongeldige tabelkeuze");
 if(typeof input.insurance!=="string"||!/^[A-Za-z0-9_-]{1,40}$/.test(input.insurance))throw Error("Ongeldige verzekeringscode");
 const params=new URLSearchParams({wage:String(wage),period:input.period,residence:input.residence,type:input.type,insurance:input.insurance,credit:String(input.credit)});
 return params.toString();
}
export function decodePayrollScenario(query){
 const params=new URLSearchParams(query.startsWith("?")?query.slice(1):query);
 const keys=["wage","period","residence","type","insurance","credit"];
 if([...params.keys()].some(k=>!keys.includes(k))||keys.some(k=>params.getAll(k).length!==1))throw Error("Ongeldige of onvolledige deellink");
 const wageText=params.get("wage");
 if(!/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(wageText))throw Error("Ongeldig loon");
 const credit=params.get("credit");
 if(credit!=="true"&&credit!=="false")throw Error("Ongeldige loonheffingskorting");
 const scenario={wage:Number(wageText),period:params.get("period"),residence:params.get("residence"),type:params.get("type"),insurance:params.get("insurance"),credit:credit==="true"};
 encodePayrollScenario(scenario);
 return scenario;
}
