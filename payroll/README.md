# Nederlandse loonheffing 2026 — status en grenzen

De module is een **tabelgestuurde hulpmodule**, geen gecertificeerde loonadministratie of volledige grensarbeiderberekening. Een bron-URL of door de gebruiker aangeleverde CSV bewijst **niet** dat de bedragen officieel, volledig of actueel zijn. Elke geïmporteerde tabel heeft daarom `verifiedOfficial: false`.

## Officiële rekenbronnen 2026

De Belastingdienst publiceert **Rekenvoorschriften voor de geautomatiseerde loonadministratie januari 2026, versie 2** met afzonderlijke bijlage voor parameterwaarden, substitutiewaarden en herleidingsfactoren. De openbare downloadpagina van het Handboek Loonheffingen vermeldt momenteel de uitgave maart 2026. Deze documenten zijn leidend bij de nog te bouwen zelfstandige rekenmotor; de bestaande tabeladapter rekent deze formules **niet** zelf uit.

- Rekenvoorschriften: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/rekenvoorschriften-voor-de-geautomatiseerde-loonadministratie
- Handboek: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/handboek-loonheffingen
- Tabellen: https://www.belastingdienst.nl/wps/wcm/connect/nl/personeel-en-loon/content/hulpmiddel-loonbelastingtabellen

**Fail-closed:** AOW-/leeftijds-, herleidings- en internationale uitzonderingsvlaggen worden niet stilzwijgend genegeerd bij tabelopzoeking; deze gevallen vereisen afzonderlijke geverifieerde regels.

## Beschikbare functies

- CSV-import met tabelidentificatie (2026, tijdvak, woonland, wit/groen, verzekering en loonheffingskorting).
- Intervalcontrole: geen overlappende of ontbrekende loonintervallen binnen één geïmporteerde combinatie; geen extrapolatie buiten het bereik.
- Bruto-netto indicatie op basis van **ingeladen** inhouding en zelf opgegeven overige inhoudingen.
- Vergelijking van twee scenario's, batchberekening (maximaal 500 lonen) en CSV-export.
- Tabelinventaris en diagnose van grenzen en ontbrekende combinaties.
- Vergelijking met afzonderlijke referentiecases; deze vergelijking **authenticeert de bron niet**.
- Exacte voorbeeldopzoeking op basis van negen meegeleverde cases; die voorbeelden zijn geen complete tabel.
- Deelbare invoerlink; deze bevat geen ingeladen tabelgegevens.

## Nog niet voltooid

1. Officiële 2026-tabellen volledig en onafhankelijk controleren en verwerken, inclusief herleidingssituaties.
2. Toepasselijke rekenvoorschriften (o.a. AOW, bijzondere beloningen en afronding) implementeren en met onafhankelijke fiscale testcases toetsen.
3. Belgische bedrijfsvoorheffing, sociale zekerheid en grensarbeiderssituaties volledig uitwerken.
4. Integratietests en gebruikersacceptatietests met echte loonstroken en officiële brongevallen uitvoeren.

**Let op:** Een correcte softwaretest met synthetische bedragen is geen bewijs van fiscale juistheid.

## Bronnen

- [Loonbelastingtabellen 2026–2021](https://www.belastingdienst.nl/wps/wcm/connect/nl/personeel-en-loon/content/hulpmiddel-loonbelastingtabellen)
- [Handboek Loonheffingen](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/handboek-loonheffingen)
- [Rekenvoorschriften](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/rekenvoorschriften-voor-de-geautomatiseerde-loonadministratie)

De uitgave van oktober 2026 is niet bevestigd op de officiële downloadpagina (controle 31 oktober 2026); gebruik geen onbevestigde editie als bron voor fiscale regels.

## Tests

Start de GitHub Actions-workflow `.github/workflows/regression.yml`, of voer de `*.test.mjs`-bestanden uit met Node.js 22. Een geslaagde CI-run moet afzonderlijk worden gecontroleerd; opname in de workflow is geen bewijs dat deze is geslaagd.
