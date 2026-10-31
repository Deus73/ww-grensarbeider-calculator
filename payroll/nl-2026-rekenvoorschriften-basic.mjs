/** Beperkte implementatie rekenvoorschriften 2026 v2, §2.1–2.2.5.
 * Alleen NL, jonger dan AOW, zonder loonheffingskorting, loon tot Lmax.
 * Geen fiscale vrijgave: onafhankelijk vergelijken met officiële tabellen.
 */
export const REKENVOORSCHRIFT_SOURCE="https://download.belastingdienst.nl/belastingdienst/docs/rekenvoorschriften_voor_geautomatiseerde_loonadministratie_lh991z62fd.pdf";
const FACTORS=Object.freeze({dag:260,week:52,vierweken:13,maand:12,kwartaal:4});
const MAX_ANNUAL=133110,STEP=54;
function validCents(n){return typeof n==="number"&&Number.isFinite(n)&&n>=0&&Number.isSafeInteger(Math.round(n*100))&&Math.abs(n*100-Math.round(n*100))<1e-7;}
function unsupported(reason){return {status:"unsupported",reason,withholding:null,verifiedOfficial:false};}
export function calculateNl2026NoCredit(input){
 if(!input||typeof input!=="object")throw Error("Ongeldige looninvoer");
 if(!validCents(input.wage))throw Error("Ongeldig tijdvakloon");
 const factor=FACTORS[input.period];
 if(!factor)return unsupported("Alleen dag, week, vierweken, maand en kwartaal zijn in deze rekenregel ondersteund");
 if(input.residence!=="NL"||input.type!=="wit"&&input.type!=="groen"||input.insurance!=="VOLLEDIG"||input.credit!==false||input.ageGroup!=="UNDER_AOW"||input.special===true||input.anonymous===true||input.herleiding!==undefined||input.international!==undefined)return unsupported("Alleen NL, volledige volksverzekeringen, onder AOW en zonder loonheffingskorting; overige gevallen vereisen eigen rekenregels");
 const annualCents=Math.round(input.wage*100)*factor;
 if(!Number.isSafeInteger(annualCents))return unsupported("Jaarloon buiten veilig rekenbereik");
 if(annualCents>MAX_ANNUAL*100)return unsupported("Boven maximumtabelloon: afzonderlijke berekeningswijze vereist");
 // Integercenten voorkomen afwijkingen bij de afronding naar beneden op Lv.
 const annual=Math.floor(annualCents/(STEP*100))*STEP;
 // Officieel 2026 v2, tabel 2: a/b/c voor jonger dan AOW.
 const bracket=annual<=38883?{a:0,b:35.75,c:0}:annual<=78426?{a:38883,b:37.56,c:13900}:{a:78426,b:49.50,c:28752};
 const annualTax=Math.max(0,Math.floor((annual-bracket.a)*bracket.b/100+bracket.c+1e-9));
 const withholding=Math.round(annualTax/factor*100)/100;
 return {status:"ok",withholding,annualWage:annual,annualTax,periodFactor:factor,source:REKENVOORSCHRIFT_SOURCE,verifiedOfficial:false,scope:"2026 v2 §2.2; alleen standaard NL onder AOW zonder loonheffingskorting; nog niet onafhankelijk gevalideerd"};
}
