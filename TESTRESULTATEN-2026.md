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
