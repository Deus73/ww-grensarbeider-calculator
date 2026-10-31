/** Onafhankelijk overgenomen bronwaarden: Belastingdienst 2026 v2, tabel 2 en bijlage p.2-4.
 * Dit is een controleerbaar parameterregister, GEEN volledige loonheffingsmotor.
 */
export const OFFICIAL_2026_SOURCES=Object.freeze({
 rules:"https://download.belastingdienst.nl/belastingdienst/docs/rekenvoorschriften_voor_geautomatiseerde_loonadministratie_lh991z62fd.pdf",
 appendix:"https://download.belastingdienst.nl/belastingdienst/docs/bijlage_rekenvoorschr_voor_geauto_loonadm_pdf_lh991b61fd.pdf"
});
export const BRACKETS_2026=Object.freeze({
 UNDER_AOW:Object.freeze([{limit:38883,a:0,b:35.75,c:0},{limit:78426,a:38883,b:37.56,c:13900},{limit:Infinity,a:78426,b:49.50,c:28752}]),
 AOW_1945_OR_EARLIER:Object.freeze([{limit:41123,a:0,b:17.85,c:0},{limit:78426,a:41123,b:37.56,c:7340},{limit:Infinity,a:78426,b:49.50,c:21351}]),
 AOW_1946_OR_LATER:Object.freeze([{limit:38883,a:0,b:17.85,c:0},{limit:78426,a:38883,b:37.56,c:6940},{limit:Infinity,a:78426,b:49.50,c:21792}])
});
export const CREDIT_RESIDENCE_RIGHTS_2026=Object.freeze({
 NL:Object.freeze({ahk:true,ark:true,ouk:true,aok:true,jgk:true}),
 BE:Object.freeze({ahk:true,ark:true,ouk:false,aok:false,jgk:false}),
 LK:Object.freeze({ahk:false,ark:true,ouk:true,aok:true,jgk:false}),
 SA:Object.freeze({ahk:true,ark:true,ouk:false,aok:false,jgk:false}),
 DL:Object.freeze({ahk:false,ark:false,ouk:false,aok:false,jgk:false})
});
export function getBracket2026(ageGroup,annualWage){
 if(!Object.hasOwn(BRACKETS_2026,ageGroup)||typeof annualWage!=="number"||!Number.isFinite(annualWage)||annualWage<0)return {status:"unsupported",reason:"Leeftijdsgroep of jaarloon ongeldig"};
 return {status:"ok",bracket:BRACKETS_2026[ageGroup].find(x=>annualWage<=x.limit),source:OFFICIAL_2026_SOURCES.rules};
}
