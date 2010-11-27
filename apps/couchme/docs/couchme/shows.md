Dokumentum megjelenítés
=======================

## Ismerkedés a show függvényekkel

A show funkciók arra szolgálnak, hogy egy meghatározott dokumentumot megjelenítsünk
és az ehhez szükséges feldolgozást a server oldalon végezzük el.

Szükséges tehát egy dokumentum azonosító, továbbá egy JavaScript függvény, ami
a megjelenítést megvalósítja. Az eredmény különféle tartalom típus lehet.

A leggyakrabban minden bizonnyal HTML-t fog produkálni a művelet, de ezzel tudunk
szükség esetén XML, személyre-szabott JSON, plain text, vagy akár valamilyen
bináris formátumú dokumentum reprezentációt visszaadni a kliensnek.

A tartalom előállítást végezhetjük teljes mértékben JavaScript-ben, de
rendelkezésünkre áll egy templating eszköz, ami sokkal hatékonyabbá, rugalmasabbá
és nem utolsósorban áttekinthetőbbé és karbantarthatóbbá teszi az alkalmazásunkat.

Az URL mintázat, amivel lekérhetjük a tartalmat a következőképpen fest:

    /{db-name}/{design-doc-name}/_show/{show-name}/{doc-id}

Ahol a __{show-name}__ megegyezik a JavaScript file nevével, ami a megjelenítő funkciót
tartalmazza. A __{doc-id}__ opcionális. Ha nem adjuk meg, akkor a funkció üres dokumentummal
dolgozik. Pl.: Statikus tartalom generálásakor nincs feltétlenül szükségünk dokumentumra.

Egy érvényes show URL-re mutat példát az alábbi kódrészlet:

    /cogito/_design/cogito/_show/index

Ahhoz, hogy erre az URL-re válaszoljon a server, a design dokumentum alatt
csinálnunk kell egy \_show foldert, amelyben létrehozunk egy index.js nevű file-t.

Ennek a file-nak a tartalma egyetlen függvény lesz, aminek a mintázata a következő:

    function( doc, req )
    {

    }

A __doc__ paraméter maga a dokumentum, amire az URL-ben hivatkoztunk (null, ha
nem adtunk meg {doc-id}-t.

A __req__ paraméter a HTTP request paramétereit adja át a függvénynek.

A visszatérő érték jelenik meg a kliens felé továbbított reprezentációként.
Például az alábbi kódrészlet egy egyszerű szöveges üzenettel fog visszatérni:

    function( doc, req )
    {
        return "Jó napot.";
    }

## Program-könyvtárak alkalmazása

TODO


## Server oldali erőforrások beillesztése

TODO

## Template-ek használata

TODO


