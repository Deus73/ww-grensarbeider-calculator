# Nederlandse loonheffing 2026 — implementatiestatus

## Toegevoegd
- `nl-2026-table-engine.mjs`: strikte tabelgestuurde loonheffing-lookup, met onderscheid tussen woonland NL/BE/overig, wit/groen, tijdvak, verzekeringssituatie en loonheffingskorting.
- `nl-2026-table-engine.test.mjs`: negen technische tests met synthetische waarden, niet met officiële belastingbedragen.
- Invoercontrole op tabelidentificatie, ontbrekende intervallen, overlap en bronherkomst.
- Geen extrapolatie naar ontbrekende tabellen of bijzondere beloningen.

## Niet voltooid
- De officiële Belastingdienst-2026-tabeldata en de parameterbijlage zijn nog niet geïmporteerd.
- De tabeladapter is nog niet aan de bruto-nettointerface gekoppeld.
- De 2026-rekenvoorschriften voor herleidingsfactoren, AOW-overgang, bijzondere beloningen en afronding zijn nog niet volledig geprogrammeerd.
- Er is nog geen onafhankelijke vergelijking met officiële 2026-tabelbedragen.
- De nieuwe module is een technische bouwsteen en mag niet als een volledige loonheffingsmotor worden gepresenteerd.

## Primaire bronnen
- https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/rekenvoorschriften-voor-de-geautomatiseerde-loonadministratie
- https://www.belastingdienst.nl/wps/wcm/connect/nl/personeel-en-loon/content/hulpmiddel-loonbelastingtabellen

## Tests uitvoeren
`node payroll/nl-2026-table-engine.test.mjs`

De negen technische tests zijn afzonderlijk uitgevoerd op de huidige module en geslaagd. De testfixturebedragen zijn verzonnen om uitsluitend de lookup-logica te toetsen.
