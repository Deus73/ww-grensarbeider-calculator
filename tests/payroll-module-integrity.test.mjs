import {strict as assert} from "node:assert";
import {readFileSync,existsSync} from "node:fs";
const html=readFileSync(new URL("../loonheffing-2026.html",import.meta.url),"utf8");
const script=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,"Module-script ontbreekt");
const imports=[...script.matchAll(/^import\s*\{([^}]+)\}\s*from\s*"([^"]+)";/gm)];
assert.ok(imports.length>=10,"Verwacht alle payrollmodules in de interface");
for(const [,names,path] of imports){
 assert.ok(path.startsWith("./payroll/"),"Alleen lokale payrollimports toegestaan: "+path);
 const url=new URL("../"+path.slice(2),import.meta.url);
 assert.ok(existsSync(url),"Module ontbreekt: "+path);
 const module=await import(url.href);
 for(const name of names.split(",").map(x=>x.trim())){
  assert.ok(Object.hasOwn(module,name),"Niet-geëxporteerde functie "+name+" uit "+path);
  assert.equal(typeof module[name],"function","Export is geen functie: "+name);
 }
}
console.log(imports.length+" payrollmodules en hun named exports daadwerkelijk geïmporteerd.");
