/** 2026 heffingskortingen: jaarbedragen voor standaardsituaties, NIET de loonheffingstijdvakformule.
 * Belastingdienst: fiscale tabellen 2026; de loonadministratie heeft aparte afronding/substitutie.
 */
export const SOURCE_2026="https://www.belastingdienst.nl/wps/wcm/connect/fisin/fisin2026/heffingskortingen";
const valid=n=>typeof n==="number"&&Number.isFinite(n)&&n>=0&&Number.isSafeInteger(Math.round(n*100));
const money=n=>Math.round(Math.max(0,n)*100)/100;
export function annualTaxCredits2026({income,workIncome,ageGroup}={}){
 if(!valid(income)||!valid(workIncome))throw Error("Ongeldig jaarinkomen");
 if(!["UNDER_AOW","FULL_YEAR_AOW"].includes(ageGroup))return {status:"unsupported",reason:"AOW bereikt gedurende 2026: tijdsevenredige regels nodig"};
 const aow=ageGroup==="FULL_YEAR_AOW";
 const general=income<=29736?(aow?1556:3115):income>=78426?0:(aow?1556:3115)-(income-29736)*(aow?.03195:.06398);
 let labour;
 if(workIncome<=11965)labour=workIncome*(aow?.04156:.08324);
 else if(workIncome<=25845)labour=(aow?498:996)+(workIncome-11965)*(aow?.15483:.31009);
 else if(workIncome<=45592)labour=(aow?2647:5300)+(workIncome-25845)*(aow?.00974:.01950);
 else if(workIncome<=132920)labour=(aow?2840:5685)-(workIncome-45592)*(aow?.03250:.06510);
 else labour=0;
 return {status:"ok",general:money(general),labour:money(labour),annualTotal:money(money(general)+money(labour)),ageGroup,verifiedPayroll:false,scope:"Jaarlijkse inkomstenbelastingkortingen 2026, geen loonstrookberekening",source:SOURCE_2026};
}
