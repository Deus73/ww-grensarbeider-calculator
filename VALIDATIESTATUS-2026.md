# Validatiestatus bruto-netto 2026

## Gecontroleerd
- Zeven regressietests uitgevoerd op de JavaScript-berekeningsfuncties; zie TESTRESULTATEN-2026.md.
- RVA-dagbedragen worden op centen afgerond vóór vermenigvuldiging met 26.
- De vereenvoudigde automatische NL-tariefindicatie is vanaf v3.1 geblokkeerd wanneer het woonland België is, omdat de herleiding en sociale verzekeringsplicht niet worden berekend.

## Nog niet gevalideerd
- Nederlandse loonheffing: witte/groene tabellen, heffingskortingen, loonheffingstijdvakken, AOW-leeftijd, bijzondere beloningen, premieplicht, herleiding.
- Belgische bedrijfsvoorheffing: officiële sleutelformule, gezinslasten, werkbonus, bijzondere beloningen en ingangsdatumwijzigingen.
- Grensarbeiders: fiscale woonplaats, toepasselijke verdragsregels en sociaalzekerheidsland.

## Officiële primaire bronnen
- https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/rekenvoorschriften-voor-de-geautomatiseerde-loonadministratie
- https://financien.belgium.be/nl/ondernemingen/personeel_en_loon/bedrijfsvoorheffing/berekening

Deze status is geen certificering. De app mag niet worden gepresenteerd als een volledig automatische, officieel gevalideerde bruto-nettosimulator totdat de volledige voorschriften en officiële vergelijkingstests zijn geïmplementeerd.
