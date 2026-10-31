/** Vergelijk een lokaal ingelezen CSV met een eerder geëxporteerd importbewijs. */
import {createImportManifest} from "./import-manifest.mjs";
export function verifyImportManifest(expected,current){
 if(!expected||typeof expected!=="object"||expected.schema!=="grenscalc-import-manifest-v1"||expected.year!==2026)throw Error("Ongeldig of onbekend importbewijs");
 if(!current||typeof current!=="object")throw Error("Laad eerst opnieuw een CSV-bestand");
 const validated=createImportManifest(current);
 const normalizedExpected=createImportManifest(expected);
 if(Object.keys(expected).some(k=>!["schema","year","filename","size","sha256","source","groups","rows","verifiedOfficial","notice"].includes(k)))throw Error("Onbekend veld in importbewijs");
 if(Object.keys(expected.source).some(k=>!["url","document","date"].includes(k)))throw Error("Onbekend bronveld in importbewijs");
 if(expected.verifiedOfficial!==false)throw Error("Importbewijs claimt ten onrechte officiële verificatie");
 const fields=["filename","size","sha256","groups","rows"];
 const differences=fields.filter(k=>normalizedExpected[k]!==validated[k]);
 for(const field of ["url","document","date"]){
  if(typeof expected.source?.[field]!=="string"||normalizedExpected.source[field]!==validated.source[field])differences.push("source."+field);
 }
 return {status:differences.length?"mismatch":"match",matches:differences.length===0,differences,verifiedOfficial:false,notice:"Identieke importgegevens bewijzen geen fiscale juistheid of officiële authenticiteit."};
}
