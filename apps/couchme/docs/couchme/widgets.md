Aktív megjelenítő komponensek (widget-ek) készítése
===================================================

## Bevezetés

Mielőtt elmerülnénk a részletekben, fontos tisztáznunk néhány alapvető kérdést,
amely első ránézésre nem biztos, hogy mindenki számára nyilvánvaló, de megválaszolásuk
fontos, hogy mielőbb megérthessük, hogyan is állnak össze az egyes komponensek
egy komplett rendszerré.


1.  Az adatbázisban dokumentumokat tárolunk, JSON  formátumban.

4.  Az adatbázist a kliens oldalról REST API-n keresztül tudunk elérni. Ezt egy
    közönséges HTTP klienssel, vagy egy erre a célra kifejlesztett HTTP kliens
    könyvtárral tudjuk elvégezni. A CouchApp ezt még azzal egészíti ki, hogy
    kliens oldalon rendelkezésre bocsájt egy JavaScript könyvtárat, amivel a
    legfontosabb adatbázis műveleteket elvégezhetjük, ezzel elfedve az egyszerű
    REST API réteget.

3.  A server és kliens oldali programokat a készítésük során különálló folderekbe
    és file-okba helyezzük, és a feltöltés során egy speciális dokumentumba
    az ún. design-dokumentumba konvertáljuk, miután az egészet JSON-osítottuk.

4.  Amikor a megjelenítő réteget fejlesztjük, HTML oldalakat állítunk elő.
    Ezt kétféleképpen tehetjük meg:

    *   Teljes egészében a server oldalon állítjuk elő a végleges tartalmat.
        Erre szolgálnak a __\_lists__ és __\_shows__ folderben elhelyezett
        file-okban definiált függvények, illetve egyszerűbb esetben
        az __\_attachments__ folderben elhelyezett állományok.

    *   Aktív megjelenítő komponenseket is elhelyezünk az oldalban,
        melyek a kliens oldalon futnak, és amellett, hogy a klasszikus
        kliens oldali feladatokat (validálás, megjelenítés finomszabályozása, stb.)
        ellátják, közvetlen adatbázisműveleteket is végrehajtanak, és az oldal
        struktúráját is jelentősen befolyásolják, a kliens oldali template-ek
        alkalmazásával.

        Természetesen, ezen utóbbi esetben is, az alap oldalstruktúrát a server
        oldalon fogjuk előállítani (lásd.: __\_shows__, __\_lists__, __\_attachments__).

5.  Léteznek olyan könyvtárak (pl. a mustache, melyet a template kezeléshez alkalmazunk)
    melyek mind kliens mind pedig server oldalon felhasználásra kerülnek.
    Ezek mindegyike a design dokumentumba van bekódolva, és az oldal betöltődését
    követően egy külön erre a célra szolgáló JavaScript alkalmazás végzi el
    azok letöltését, és az oldalba történő beágyazását, aktiválását.

Szeretném kiemelni, hogy ebben a fejezetben a kliens oldali aktív megjelenítő komponensekre
fókuszálunk. Ezeknek is két olyan tuljadonságára, ami "aktívvá" teszi őket:

* Adatbázis műveleteket és egyéb server irányú kéréseket hajtanak végre.

* Interakciókat végeznek a felhasználóval, és esetleg egymással.

Ebből kifolyólag teljesen mindegy, hogy a komponenseket magába foglaló HTML oldal
hogyan állt elő: statikus, vagy dinamikus módon.

Éppen ezért, hogy a lényegre tudjunk koncentrálni,
a widget mintákat gyűjteménybe foglaló
[Widget receptek](http://tombenke.couchone.com/widgets/_design/widgets/index.html)
projekt is egyszerű, statikus HTML oldalakat alkalmaz a példák szemléltetésére.


## Tájékozódás a folder-struktúrában

A CouchApp-pal készült alkalmazások JavaScript-tel valósítják meg a program logikát.
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

Ezeket az aktív megjelenítő komponenseket továbbiakban widget-eknek fogjuk nevezni.

A widget-ek implementációjában az eseménykezelés, a megjelenítés és az adatok
kezelése el van különítve egymástól, és egy megfelelő formában kialaktott
folderstruktúrában, külön-külön forrásfile-okban helyezkedik el.

A CouchDB-s alkalmazásainkat a CouchApp segédprogram felhasználásával készítjük.
Ez a segédprogram támogat bennünket abban, hogy prototípus alkalmazásokat
generálhassunk. Ezek egy előre definiált folderstruktúrával rendelkeznek, és
rögtön tartalmazzák azokat a program könyvtárakat, amelyekre a böngésző oldalon
a megjelenítőréteget alapozhatjuk.

Az [Alkalmazás-fejlesztés / Egy alkalmazás struktúrája](appdev.html) című fejezet
ismerteti egy couchApp által generált folderstruktúra elemeit, ezért itt csak
a widgetekhez szorosabban kapcsolódó file-okra és folderekre fogunk koncentrálni.

Az itt ismertetett mintapéldákat egy projektbe gyűjtöttem, ami reményeim szerint
idővel egy kisebb katalógusként fog szolgálni az újrafelhasználható widget
komponensek számára. A forráskód a 
[https://github.com/tombenke/widgets](https://github.com/tombenke/widgets)
repository-ból letölthető, a múködő változat pedig elérhető a web-en:
[http://tombenke.couchone.com/widgets/_design/widgets/index.html](http://tombenke.couchone.com/widgets/_design/widgets/index.html).

A widgets design dokumentum folder strutúráján keresztül szeretném bemutatni, hogy
az egyes komponensek hol találhatóak. Az ábra nem teljes, bizonyos részleteket
a jobb áttekinthetőség érdekében kihagytam:

    /widgets/_design/widgets
        |-- _attachments
        |   |-- scripts
        |   |   `-- gmap
        |   `-- style
        |       `-- smoothness
        |           `-- images
        |-- evently
        |   |-- auth
        |   |-- browser
        |   |-- contactManager
        |   |-- contactform
        |   |-- countryCombo
        |   |-- dbinfo
        |   |-- hCard
        |   |-- helloworld
        |   |-- items
        |   |-- logout
        |   |-- profile
        |   |-- searchform
        |   |-- searchresults
        |   |-- searchresults_reduced
        |   |-- simpleform
        |   `-- wizard
        |-- vendor
        |   |-- couchapp
        |   |   |-- _attachments
        |   |   |-- evently
        |   |   |   |-- account
        |   |   |   `-- profile
        |   |   `-- lib
        |   `-- droids
        |       `-- lib
        `-- views

### Az __\_attachments__ folder



    .
    .
    .
    |-- _attachments
    |   |-- dbinfo.html
    |   |-- helloworld.html
    |   |-- index.html
    .
    .
    .


    .
    .
    .
    |-- _attachments
    |   |-- scripts
    |   |   |-- gmap
    |   |   |   `-- jquery.gmap-1.1.0-min.js
    |   |   |-- jquery-1.4.2.min.js
    |   |   `-- jquery-ui-1.8.2.custom.min.js
    |   |-- style
    |   |   |-- main.css
    |   |   |-- smoothness
    |   |   |   |-- images
    |   |   |   |   |-- ui-anim_basic_16x16.gif
    |   |   |   |   |-- ui-bg_flat_0_aaaaaa_40x100.png
    |   |   |   |   |-- ui-bg_flat_75_ffffff_40x100.png
    |   |   |   |   |-- ui-bg_glass_55_fbf9ee_1x400.png
    |   |   |   |   |-- ui-bg_glass_65_ffffff_1x400.png
    |   |   |   |   |-- ui-bg_glass_75_dadada_1x400.png
    |   |   |   |   |-- ui-bg_glass_75_e6e6e6_1x400.png
    |   |   |   |   |-- ui-bg_glass_95_fef1ec_1x400.png
    |   |   |   |   |-- ui-bg_highlight-soft_75_cccccc_1x100.png
    |   |   |   |   |-- ui-icons_222222_256x240.png
    |   |   |   |   |-- ui-icons_2e83ff_256x240.png
    |   |   |   |   |-- ui-icons_454545_256x240.png
    |   |   |   |   |-- ui-icons_888888_256x240.png
    |   |   |   |   `-- ui-icons_cd0a0a_256x240.png
    |   |   |   `-- jquery-ui-1.8.2.custom.css
    |   |   `-- wait16.gif
    .
    .
    .

### Az __evently__ folder

    .
    .
    .
    |-- evently
    |   |-- dbinfo
    |   |   |-- _init
    |   |   |   |-- after.js
    |   |   |   `-- mustache.html
    |   |   `-- version
    |   |       |-- data.js
    |   |       `-- mustache.html
    |   |-- helloworld
    |   |   |-- _init
    |   |   |   `-- mustache.html
    |   |   `-- click
    |   |       `-- mustache.html
    .
    .
    .

### A __vendor__ folder

    .
    .
    .
    |-- vendor
    |   |-- couchapp
    |   |   |-- _attachments
    |   |   |   |-- jquery.couch.app.js
    |   |   |   |-- jquery.couch.app.util.js
    |   |   |   |-- jquery.evently.js
    |   |   |   |-- jquery.mustache.js
    |   |   |   |-- jquery.pathbinder.js
    |   |   |   `-- loader.js
    |   |   |-- evently
    |   |   |   |-- README.md
    |   |   |   |-- account
    |   |   |   `-- profile
    |   |   |-- lib
    |   |   |   |-- atom.js
    |   |   |   |-- cache.js
    |   |   |   |-- code.js
    |   |   |   |-- docform.js
    |   |   |   |-- linkup.js
    |   |   |   |-- list.js
    |   |   |   |-- markdown.js
    |   |   |   |-- md5.js
    |   |   |   |-- mustache.js
    |   |   |   |-- path.js
    |   |   |   |-- redirect.js
    |   |   |   |-- utils.js
    |   |   |   `-- validate.js
    |   |   `-- metadata.json
    |   `-- droids
    |       `-- lib
    |           |-- listgen.js
    |           `-- templating.js
    .
    .
    .

Evently

A declarative, couchdb friendly JQuery library for writing Javascript applications
CouchDB API (jquery.couch.js)

The JQuery library included with CouchDB itself for use by the Futon admin console is used to interact with couchdb. Some limited documentation is available from Couchone.
CouchApp Loader (jquery.couch.app.js)

A utility for loading design document classes into your Javascript application
Pathbinder (jquery.pathbinder.js)

A tiny framework for triggering events based on paths in URL hash.
Mustache

A simple template framework


## Egy widget anatómiája

    {widget-name}
        |-- {event-name}.js
        |-- {event-name}
        |   |-- after.js
        |   |-- data.js
        |   |-- mustache.html
        |   `-- selectors.json
        |-- {event-name}
            |-- after.js
            |-- mustache.html
            `-- selectors
                `-- form
                    `-- submit.js




    auth
    |-- _init.js
    |-- doLogin.js
    |-- doLogout.js
    |-- loggedIn
    |   |-- after.js
    |   |-- data.js
    |   |-- mustache.html
    |   `-- selectors.json
    |-- loggedOut
    |   |-- mustache.html
    |   `-- selectors.json
    `-- loginForm
        |-- after.js
        |-- mustache.html
        `-- selectors
            `-- form
                `-- submit.js



    items/
    `-- _changes
        |-- data.js
        |-- mustache.html
        `-- query.json


## Widget példák

## Összefoglaló a widget-ek struktúrájáról és használatáról


<!--
TODO: Témát tovább kifejteni részletesen!

* Widgetek elhelyezése és betöltése
    * evently
    * vendor/evently

* Öröklődés a widget-ek között
-->