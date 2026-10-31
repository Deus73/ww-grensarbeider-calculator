/** Controleerbare provenance voor lokaal ingelezen CSV; hash is geen bewijs van fiscale juistheid. */
import {isBelastingdienstSourceUrl} from "./nl-2026-table-engine.mjs";
export function bytesToHex(bytes) {
 if(!(bytes instanceof Uint8Array))throw Error("Ongeldige hashbytes");
 return [...bytes].map(b=>b.toString(16).padStart(2,"0")).join("");
}
export function createImportManifest({filename,size,sha256,source,groups,rows}) {
 if(typeof filename!=="string"||!filename||filename.length>255||/[\\/\r\n]/.test(filename))throw Error("Ongeldige bestandsnaam");
 if(!Number.isSafeInteger(size)||size<0||size>20_000_000)throw Error("Ongeldige bestandsgrootte");
 if(typeof sha256!=="string"||!/^[a-f0-9]{64}$/.test(sha256))throw Error("Ongeldige SHA-256");
 if(!source||typeof source.url!=="string"||typeof source.document!=="string"||typeof source.date!=="string")throw Error("Bronmetadata ontbreken");
 if(!isBelastingdienstSourceUrl(source.url))throw Error("Ongeldige Belastingdienst-bron-URL");
 if(!source.document.trim()||source.document.length>500)throw Error("Ongeldige bronomschrijving");
 if(!/^2026-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])$/.test(source.date)||new Date(source.date+"T00:00:00Z").toISOString().slice(0,10)!==source.date)throw Error("Ongeldige brondatum");
 if(!Number.isSafeInteger(groups)||groups<1||!Number.isSafeInteger(rows)||rows<1)throw Error("Ongeldige tabelomvang");
 return {schema:"grenscalc-import-manifest-v1",year:2026,filename,size,sha256,source:{url:source.url,document:source.document,date:source.date},groups,rows,verifiedOfficial:false,notice:"SHA-256 identificeert alleen het exacte bestand; officiële herkomst, volledigheid en fiscale juistheid zijn niet geverifieerd."};
}
