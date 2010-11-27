Aktív megjelenítő komponensek (widget-ek) készítése
===================================================

## Bevezetés

A CouchApp biztosít néhány JavaSript könyvtárat, amivel a HTML oldalon belül,
kiterjesztett jQuery komponenseket használhatunk.

Ezeket a kiterjesztett jQuery komponensek tulajdonképpen apró MVC kontrollerekként
is tekinthetjük.

Az aktív komponenseknek állapota van, és az állapotok közötti átmeneteket
a komponensnek küldött eseményekkel lehet kiváltani. Ezek az események lehetnek
szabványos böngésző események (click, mouse hover, stb.) de magunk is
definiálhatunk logikai eseményeket, melyeket trigger műveletekkel lehet aktiválni.

A komponensek az őket érintő események hatására megváltoztathatják állapotukat.
Minden egyes állapothoz tartozik egy megjelenítő template, és egy adatmodell,
amit a kiváltó esemény tölt fel, és ez az adat megjeleníthető a template-en keresztül.

Az eseménykezelés, a megjelenítés és az adatok kezelése el van
különítve egymástól, és egy megfelelő formában kialaktott folderstruktúrában,
külön-külön forrásfile-okban helyezkedik el.

Ezeket a továbbiakban
widget-eknek fogjuk nevezni.

TODO: Témát kifejteni részletesen

<!-- Evently is just a shortcut for wiring up jQuery widgets -->
