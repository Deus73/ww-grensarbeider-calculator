# Testresultaten 2026

Uitgevoerd: 30 oktober 2026. Zeven controles op de echte berekeningsfuncties uit index.html: 7 geslaagd.

| Test | Verwacht | Resultaat |
|---|---|---|
| RVA maand 1 gezinslast minimum | EUR 2030,34 | geslaagd |
| RVA maand 1 alleenwonend maximum | EUR 2812,94 | geslaagd |
| RVA maand 5 samenwonend minimum | EUR 1461,98 | geslaagd |
| RVA maand 9 alleenwonend maximum | EUR 1997,06 | geslaagd |
| RVA maand 13 samenwonend forfait | EUR 776,10 | geslaagd |
| NL bruto EUR 3000, tarief 35,75 procent zonder kortingen | EUR 1927,50 | geslaagd |
| NL zonder inhouding en automatische berekening uit | geen nettoresultaat | geslaagd |

Correctie: RVA-dagbedrag eerst op centen afronden, dan maal 26. Voor de correctie gaf maand 9 EUR 1997,04 in plaats van EUR 1997,06.

Bronnen: https://www.rva.be/documentatie/bedragen/volledige-werkloosheid-nieuwe-reglementering en https://www.belastingdienst.nl/wps/wcm/connect/nl/voorlopige-aanslag/content/voorlopige-aanslag-tarieven-en-heffingskortingen

Beperking: dit zijn beperkte regressietests, geen validatie van de volledige NL/BE-loonheffing. Belgische bedrijfsvoorheffing en Nederlandse heffingskortingen ontbreken nog in de automatische rekenmotor.


## Aanvullende tests v3.2 – 30 oktober 2026

Vijf extra controles rechtstreeks op de `salary.calc()`-functie uitgevoerd; **5/5 geslaagd**.

| Scenario | Verwacht | Werkelijk | Status |
|---|---:|---:|---|
| NL, bruto EUR 3.000/maand, met AHK en arbeidskorting, vereenvoudigd | EUR 2.611,85 | EUR 2.611,85 | OK |
| NL, bruto EUR 3.000/maand, zonder kortingen | EUR 1.927,50 | EUR 1.927,50 | OK |
| Wonen BE, werken NL, automatische stand 2 | geen bedrag | geen bedrag | OK |
| Werkland BE, automatische stand 2 | geen bedrag | geen bedrag | OK |
| NL, bruto EUR 15.000/maand, kortingen uitgefaseerd | EUR 8.413,99 | EUR 8.413,99 | OK |

**Let op:** dit zijn wiskundige regressietests tegen de geïmplementeerde vereenvoudigde jaarformules, geen onafhankelijke vergelijking met de officiële maandtabellen. De Belgische bedrijfsvoorheffing, volledige NL-loonbelastingtabellen en grensarbeidersherleiding zijn niet geïmplementeerd. Bronnen: https://www.belastingdienst.nl/wps/wcm/connect/nl/voorlopige-aanslag/content/voorlopige-aanslag-tarieven-en-heffingskortingen en https://financien.belgium.be/nl/ondernemingen/personeel_en_loon/bedrijfsvoorheffing/berekening


## Aanvullende controles v3.3 – 30 oktober 2026

Zes scenario's uitgevoerd tegen de huidige `salary.calc()` functie. **6/6 functioneel geslaagd**. Bij twee vergelijkingen is de valutaweergave genormaliseerd (niet-afbrekende spatie tegenover gewone spatie); de numerieke bedragen kwamen overeen.

- NL 40 jaar, EUR 3000 bruto, met heffingskortingen: EUR 2611,85 (indicatie).
- NL 40 jaar, EUR 3000 bruto, zonder heffingskortingen: EUR 1927,50 (indicatie).
- NL 67 jaar: automatische berekening geblokkeerd.
- Wonen België, werken Nederland: automatische berekening geblokkeerd.
- Werken België: automatische Nederlandse berekening geblokkeerd.
- Handmatige modus zonder fiscale inhouding: geen nettobedrag.

Dit is **geen** vergelijking met officiële Nederlandse tijdvaktabellen of Belgische sleutelformule. Die volledige rekenmotoren zijn nog niet geïmplementeerd.


## Ingebouwd testdashboard v3.4

URL: https://deus73.github.io/ww-grensarbeider-calculator/?test=1

Zes regressietests op de actuele calculatorfuncties uitgevoerd: **6/6 geslaagd**. Getest: NL 3000 bruto met en zonder heffingskortingen, blokkering woonland BE, blokkering werkland BE, blokkering leeftijd 67+, en ontbrekende handmatige inhouding. Het dashboard toont resultaten rechtstreeks in de browser. Deze regressies bewijzen **niet** dat de bruto-netto-uitkomst gelijk is aan de officiële Nederlandse loonbelastingtabellen of de Belgische sleutelformule.

Officiële bronnen 2026: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/rekenvoorschriften-voor-de-geautomatiseerde-loonadministratie ; https://financien.belgium.be/nl/ondernemingen/personeel_en_loon/bedrijfsvoorheffing/berekening


## v3.5 — onafhankelijke schijfgrens- en voorbeeldcontrole

10 van 10 ingebouwde tests geslaagd. Toegevoegd: Belastingdienst-rekenvoorbeeld 2026 bij EUR 80.000 jaarinkomen zonder kortingen, grens eerste schijf EUR 38.883, grens tweede schijf EUR 78.426 en nulinkomen. Officiële voorbeeldbron: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/box_1/box_1

De geteste berekening blijft een vereenvoudigde jaarindicatie. Nog geen volledige loonheffingstijdvaktabellen, Belgische bedrijfsvoorheffing of herleiding voor grensarbeiders. Daarom geen officiële certificering.
