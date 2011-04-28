Aktív megjelenítő komponensek (widget-ek) készítése
===================================================

## Bevezetés

Mielőtt elmerülnénk a részletekben, fontos tisztáznunk néhány alapvető kérdést,
amely első ránézésre nem biztos, hogy mindenki számára nyilvánvaló, de megválaszolásuk
fontos, hogy mielőbb megérthessük, hogyan is állnak össze az egyes komponensek
egy komplett rendszerré.


1.  Az adatbázisban dokumentumokat tárolunk, JSON  formátumban.

2.  Az adatbázist a kliens oldalról REST API-n keresztül tudunk elérni. Ezt egy
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
jellegű komponensek számára. A forráskód a
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

Ez olyan file-okat tartalmaz, amelyek demonstrációs céllal a widget-ek beágyazására
mutatnak példákat. Minden widget-hez tartozik egy html file, és van egy index.html
amely egy áttekintő listát ad az összes widgetről.

    .
    |-- _attachments
    |   |-- auth.html
    |   |-- browser.html
    |   |-- contactManager.html
    |   |-- countryCombo.html
    |   |-- dbinfo.html
    |   |-- form.html
    |   |-- gmaps.html
    |   |-- hCard.html
    |   |-- helloworld.html
    |   |-- index.html
    |   |-- logout.html
    |   |-- poll.html
    |   |-- search.html
    |   |-- simpleform.html
    |   |-- tabs.html
    |   `-- wizard.html
    .

Ugyancsak ebben a folderben vannak elhelyezve a stíluslapok, képe és mindazok a
JavaScript könyvtárak, amelyek az oldalak működéséhez szükségesek, de nem tartoznak 
sem a CouchApp csomaghoz, sem pedig a CouchDB könyvtáraihoz.

Az alábbi listán pl.: a jQuery alap könyvtár, továbbá az jQuery-UI könyvtár és
az ahhoz tartozó CSS és kép file-ok vannak felsorolva.

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

### Az __evently__ folder

Az __evently__ folder áll vizsgálódásunk középpontjában, ez tartalmazza ugyanis
az aktív komponenseket. Komponensenként egy-egy aldirectory-ban.

Az alábbi listán két komponens folderstruktúrája látható, név szerint
a __dbinfo__ és a __helloworld__. Az egyes widgetek saját, belső folderstruktúráját
egy további alfejezetben ismertetjük részletesen.

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

### A __vendor__ folder

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


A vendor folderben előregyártott könyvtárakat és evently widget-eket találunk.

Számunkra most két folder érdekes:

A __vendor/couchapp/\evently__ ahol két minta widget található, valamint a
 __vendor/couchapp/\_attachments__, amelyben a kliens számára szükséges
következő JavaScript könyvtárakat találjuk:

*   __jquery.evently.js__  
    Az Evently nevű, CouchDB-hez hangolt, deklaratív jQuery könyvtár,
    amivel eseménykezelést, Ajax hívásokat, és sablonokat tudunk kezelni.
    Ez képezi az általunk készítendő aktív megjelenítő komponensek bázisát.

*   __jquery.couch.app.js__  
    CouchApp betöltő program, ami ahhoz szükséges, hogy a kliens oldalon futó
    JavaScript alkalmazásunk elérhesse a design dokumentumban tárolt
    widgeteket és könyvtárakat.

*   __jquery.pathbinder.js__  
    URL hash-en alapuló oldal hivatkozások aktiválását segítő keretrendszer.
    <!-- TODO: Brrr. ezt rendesen le kell írni -->

*   __jquery.mustache.js__  
    Mustache nevű, egyszerű template keretrendszer, ami a sablonokban használt 
    bajuszra emlékeztető __{__ és __}__ karakterekről kapta nevét.

Fontos megemlítenünk még két könyvtárat.
Ezek közvetlenül a CouchDB server hatásköre alá tartoznak, és nem szükséges
belőlük adatbázisonként, vagy akár design dokumentumonként külön példányt
tárolnunk:

*   __/\_utils/script/jquery.couch.js__  
    A CouchDB API-t megvalósító, adatbáziskezelést biztosító függvények.
    Ha adatbáziskezelő műeleteket akarunk végezni és nem szeretnénk bajlódni
    a REST API implementálásával, akkor erre mindenképpen szükségünk lesz.

*   __/\_utils/script/couch.js__  
    Ez a jQuery plugin egyébként egy még alapvetőbb JavaScript osztály kiterjesztése,
    melyet __couch.js__-nek hívnak, és XMLHttpRequest-re épülő interfészt
    valósít meg a CouchDB server és a kliens oldal között.
    Tulajdonképpen a __jquery.couch.js__ ennek az osztálynak a kiterjesztése.
    Közvetlenül nem hívjuk, csak a __jquery.couch.js__-en keresztül.


## Kliens oldali alkalmazás futtatása

Mindenekelőtt vizsgáljuk meg, hogyan kerülnek a server oldalon tárolt aktív
komponenseink, továbbá a beépített könyvtárak a kliensre, amikor az oldalt
a böngészőbe betöltjük!

Az előkészületeket, a __$.couch.app( appFun, opts )__ függvény hívásával
végezhetjük el. Ez tulajdonképpen egy olyan jQuery plugin, ami a widget-ek
futtatási környezetének beállítására szolgál.

Az __opts__ paraméter-rel adhatjuk meg a plugin konfigurációs paramétereit.
Megadása nem kötelező:

    opts.urlPrefix  // URL prefix, pl.: http://localhost:5984
    opts.db         // db-name, default: /{widgets}/_design/widgets/index.html
    opts.design     // design document, default: /widgets/_design/{widgets}/index.html

Használatakor a paraméterként átadott __appFun__ függvény meghívódik,
amikor az oldal betöltődött és készen áll a működésre. Ekkor hívási paraméterként
kap egy __app__ nevű objektumot, amely a megfelelő adatbázis kapcsolatot
hivatott biztosítani, és a CouchApp helper műveletekhez biztosít hozzáférést.

Ebben a függvényben kell elhelyeznünk azt a kódot, ami a widget-einket elhelyezi
az oldalon.
Az __app__ paramétert az oldalon elhelyezni kívánt widget-eknek is át kell
adnunk az inicializáláskor, mert nekik is szükségük lehet a helper műveletekre és
az adatbázis kapcsolatot nyújtó műveletekre, pl.: egy combo box adattal történő
feltöltésekor.

Egy tipikus oldal és az __appFunc__ paraméterként átadott függvény
a következőképpen néz ki:

    <!DOCTYPE html>
    <html>
        <head>
            <title>mouseMe widget</title>
            <link rel="stylesheet" href="style/main.css" type="text/css">
        </head>
        <body>

            <h1>mouseMe widget</h1>

            <div id="mouseMe">Move your mouse over me!</div>

        </body>
        <script src="vendor/couchapp/loader.js"></script>
        <script type="text/javascript" charset="utf-8">
            $.couch.app( function( app )
            {
                $("#mouseMe").evently( "mouseMe", app );
            });
        </script>
    </html>

A fenti példában az oldal tartalmaz egy __mouseMe__ azonosítójú
helyfoglaló __div__ tag-et, melyet  amelyhez hozzákapcsoljuk 
a widgetünket.

Ettől kezdve a widget reagálni fog a benne definiált eseményekre.

## Egy widget anatómiája

### Hol helyezzük el a widget-ek kódját?

Minden egyes widget külön directory-ban helyezkedik el.
A widget-ek két helyen fordulhatnak elő: a design dokumentumban lévő evently folderben
és a vendor folder alatt. Ezen utóbbiban vendor-onként lehet egy evently folder,
amiben a betöltő program megtalálja a widgeteket.

Vagyis a keresési útvonalak a betöltéskor:

*   __{design-doc}/evently/*__

*   __{design-doc}/vendor/{vendor-name}/evently/*__

Minden widget esetében három dolgot határozhatunk meg:

*   Az eseményeket, amelyekre reagál.

*   A műveleteket (Ajax hívás, adatok tárolása, stb.),
    amelyeket az események kiváltásakor végrehajt.

*   A widget egyes állapotaihoz tartozó megjelenítést.

A CouchApp lehetővé teszi számunkra, hogy egy konvencionális folder struktúrába
helyezzük forráskódunkat.
A meghatározott nevű JavaScript, text és HTML file-okat helyezhetünk el.
Az egyes foldereknek és file-oknak meghatározott szerepe van, és meglehetősen nagy
rugalmasságot biztosít számunkra, hogy a megfelelő komplexitású összeállítást
válasszuk, ami optimálisan illeszkedik a widget feladatának ellátásához.

Az igazság az, hogy a konfigurálhatóságnak kicsit túlságosan nagy is
a szabadságfoka, ezért első nekifutásra nem mindig könnyű áttekinteni, hogy
hogyan is működik a komponens.

Hogy megkönnyítsük az ismerkedési folyamatot, némi önmérsékletet fogunk tanúsítani,
és a lehetséges kombinációknak csak egy szűkített részhalmazát fogjuk tárgyalni.
Ez nem szűkíti a lehetőségeinket, ugyanakkor talán hozzásegít ahhoz, hogy mások
számára olvashatóbb, közérthetőbb alkalmazásokat készítsünk.

### Események és állapotok

A legegyszerűbb eset, amikor a widget csak eseményekre reagál, és az ezeket kezelő
funkciókat közvetlenül a widget-et reprezentáló folder alá helyezzük __.js__
kiterjesztéssel.

    {widget-name}
        |-- {event_1-name}.js
        |-- {event_2-name}.js
        .
        .
        .
        `-- {event_n-name}.js

Az esemény nevek szabványos jQuery események (pl.: click), melyeket valamilyen
felhasználói integakcióval (pl. kattintás) aktiválunk,
vagy virtuális esemény-nevek lehetnek, melyeket trigger-elhetünk.

Egy ilyen, nagyon egyszerű widget struktúrája látható az alábbi ábrán:

    mouseMe/
    `-- mouseenter.js

A mouseenter.js file tartalma a következő:

    function(e)
    {
        alert( "You moved the mouse over me." );
    }

Léteznek speciális nevű események, mint pl.: az __\_init__ és a __\_changes__.
Az __\_init__ automatikusan meghívódik a widget létrehozását követően, de
trigger-elhetjük is.

A widget-ünket felfoghatjuk állapotgépként is.
Az egyes események egy-egy állapotot reprezentálnak, melyekbe azok aktiválásakor
kerül a komponens. Az __\_init__ esemény felfogható annak az eseménynek,
ami a kezdő állapotba helyezi a komponensünket.

A következő widget két eseményt kezel, ill. két "állapottal" bír, melyekbe
akkor kerül, ha az eseményeket aktiválják. Értelemszerűen ebből az __\_init__ az,
amibe létrehozás után automatikusan beáll.

Ha rákattintanak, akkor pedig "átmegy" a __click__ állapotba.

    helloworld/
    |-- click
    |   `-- mustache.html
    `-- _init
        `-- mustache.html

Az ábrán látható, hogy itt az eseményekhez (állapotokhoz) külön folderek tartoznak,
és mindkét folderben található egy __mustache.html_ nevű HTML template file.

A mustache template használatát a
["HTML sablonok készítése mustache-sal"](mustache.html) című fejezet ismerteti.

Amikor egy widget bekerül egy állapotba, akkor az adott állapothoz tartozó
megjelenését a kiváltott eseményhez tartozó mustache.html template fogja meghatározni.
A fenti példában szereplő két template a következőképpen néz ki:

\_init/mustache:

    <h3>Hello World!</h3>

click/mustache:

    <h2>What a wonderful World!</h2>

Nem túl nehéz kitalálni, hogy az alapállapotban a _"Hello World!"_ fog megjelenni,
majd, miután rákattintottunk ez átvált a _What a wonderful World!_ feliratra.

Egy widget lehetséges struktúrájának általánosabb leírását szemlélteti a következő ábra:

    {widget-name}
        |-- _init.js
        |-- _changes.js
        |-- {event-name}.js
        `-- {event-name}
            |-- async.js
            |-- after.js
            |-- before.js
            |-- data.js
            |-- mustache.html
            |-- path.txt
            |-- partials
            |   `-- *.html
            |-- query.js
            `-- selectors.json
            `-- selectors
                |-- [name=something]
                |   |-- _init
                |   `-- keyup
                `-- form
                    `-- submit.js

Az ábrán látszik, hogy egy-egy esemény alatt számos további forrásfile
helyezhető el, ezen felül tartozhat az eseményhez egy __selectors__ elem.

Ahogy azt említettük, ezek az esemény alapján elnevezett folderek tulajdonképpen
a widget állapotait reprezentálják, amelybe az adott nevű esemény(ek)  bebillentik.

Ha ebből a nézőpontból vizsgáljuk a kérdést, akkor kijelenthetjük, hogy az állapotok
viselkedésének finomhangolását az állapotot leíró folderben lévő file-pk végzik el.

Tekintsük át, hogy mik lehetnek egy ilyen állapot-leíró folderben:

*   __selectors.json__, vagy __selectors__ folder  
    Azokat az eseményeket határozza meg, amelyekre az adott állapotban lévő
    widget reagál. Itt helyezzük el azokat a függvényeket, amelyek az egyes
    események kiváltásakor a widget válasz reakcióját prgoramozzák.

    Az MVC Controller-ének feleltethető meg.
    A selector-okat a soron következő fejezetben részletesebben tárgyaljuk.

*   __mustache.html__  
    Az adott állapothoz tartozó megjelenítő sablon (View, az MVC filozófia szerint).

*   __partials__  
    A __mustache.html__ beágyazott HTML részeket is megjeleíthet. Ezeket lehet
    ebben a folderben elhelyezni. Munstache szintakszis szerint leírt HTML oldalak.
    A mustache lehetővé teszi rekurzív módon a beágyazást, vagyis a partials-ban
    elhelyezett template-ek további template-eket ágyazhatnak be magukba.

*   __data.js__  
    A widget-nek küldött adatok feldogozását végzi.
    Az MVC filozófia szerint a modell-nek feleltethető meg.
    Visszatérőértékként továbbítja a JSON struktúrába rendezett adatokat
    a mustache.html template-hez, ami beágyazza az adatokat a sablonba.

    A file egyetlen függvényt tartalmaz, ami paraméterként a kiváltó eseményt és
    az átadott adatokat kapja meg.

*   __before.js__  
    Amikor az esemény aktiválásra kerül, először ez a függvény hívódik meg.
    Ezt követi csak a __data.js__ hívása, ami után a sablon megjeleítése és végül
    az __after.js__ végrehajtása következik.

    A file egyetlen függvényt tartalmaz, ami paraméterként a kiváltó eseményt
    kapja meg.

*   __after.js__  
    Az esemény aktiválását követő utolsó, befejező lépés.
    A file egyetlen függvényt tartalmaz, ami paraméterként a kiváltó eseményt
    kapja meg.

*   __async.js__
    A __before__, __data__ és __after__ végrehajtása szinkron módon történik.
    Ez tökéletesen megfelel akkor, ha az eseményt triggerelő objektum átadja
    a kezelendő és esetleg a mustache.html-lel megjelenítendő adatokat, vagy
    azok esetleg közvetlenül a __before__ funkcióban állíthatók elő.

    Gyakran szükség van azonban aszinkron lefutásra. Ez akkor fordul elő, ha
    például az adatbázisból szeretnénk adatokat lekérni, majd azzal feltölteni
    a megjelenítő sablont.

    Ekkor az __async__ műveletbe helyezzünk el egy Ajax hívást, ami a sikeres
    végrehajtást követően, "visszahívja" a __data__ függvényt a servertől
    kapott adatokkal. Ekkor a sablon a frissen kapott adatokkal fog megjelenni.

*   __query.js__  
    Lásd. az "Eseményekhez tartozó query kifejezések definiálása" c. fejezetben.

*   __path.txt__  
    Lásd.: "Oldalon belüli path kifejezések" c. fejezetet.

### Szinkron lefutású állapotváltás

Adatok átmeneti tárolására, átadására, sablonba ágyazására mutat példát
a __widgetEventFlowDemo__ komponens:

    widgetEventFlowDemo/
    `-- _init
        |-- after.js
        |-- before.js
        |-- data.js
        `-- mustache.html

Az egyetlen esemény a widget inicializálása. Az állapotátmenet során
végrehajtott adatkezelési műveletek szinkron módon hajtódnak végre.

Elsőként a before.js hívódik meg:

    function(e)
    {
        alert('_init.before() : initialize the app data (planets) to display.');

        $$(this).title = "The planets of the solar system:";
        $$(this).planets = [
            { "name" : "Mercury" },
            { "name" : "Venus" },
            { "name" : "Earth" },
            { "name" : "Mars" },
            { "name" : "Jupiter" },
            { "name" : "Saturn" },
            { "name" : "Neptune" },
            { "name" : "Uranus" },
            { "name" : "Pluto" }
        ];
    }

A __$$()__ függvény segítségével rendelhetünk hozzá lokális változókat a widgethez.
Esetünkben egy string-et, és egy objektum listát.

Az alert() függvény jelzi, amikor a funkció aktiválódik. A __before__ után a
__data__ hívódik meg:

    function( e, data )
    {
        alert('_init.data() returns to template with data stored in app.');
        return {
            "title" : $$(this).title,
            "planets" : $$(this).planets
        };
    }

Ez szintén jelzi a meghívódását az alert-tel, majd a widget-ben eltárol adatokat
behelyezi egy olyan struktúrába, amiből a megjelenítő kényelmesen
beillesztheti a sablonba a változók értékeit.

A __mustache.html__ sablon a következőképpen fest:

    <h1>{{title}}</h1>
        <ul>
        {{#planets}}
            <li>{{name}}</li>
        {{/planets}}
        </ul>

Ez először kihelyezi a __{{title}}__-t, majd a planets tömbőn végig iterál.
Az iterációt a __{{#planets}} ... {{/planets}}__ blokk képviseli.
A közrefogott szakasz annyiszor fog ismétlődni, ahány eleme van a listának, és
minden egyes elemre ki fog fejtődni. Ebben a blokkban a lista elemeiben lévő
mezőkre hivatkozhatunk, ami esetünkben egyetlen mezőt, a __{{name}}__-et jelenti.

Végül az __after__ is aktiválásra kerül:

    function(e)
    {
        alert('_init.after() called after rendering the template filled with app data.');
    }

Aminek nincs más feladata, mint jelezni, hogy a végrehajtás befejeződött.

A különböző állapotváltások saját __before / data / after__ funkciókkal rendelkeznek.
Egy adott állapotváltás vagy szinkron, vagy aszinkron módon zajlik.

### Aszinkron lefutású állapotváltás

Az aszinkron állapotváltás szemléltetésére nézzük meg a __countryCombo_async__
widget működését:

    countryCombo_async/
    `-- _init
        |-- async.js
        |-- data.js
        `-- mustache.html

A template lényegében egy __options__ listát vár, amiből a __value / key__ értékekkel
fel tudja tölteni az alábbi struktúrát:

    <select>
        {{#options}}
            <option value="{{value}}">{{key}}</option>
        {{/options}}
    </select>

Ehhez először is szükségünk van egy eredménylistára, amit az adatbázisból tudunk
lekérni egy view segítségével.

Ha az adatbázisba feltöltöttük a countries.json állományt, akkor az alábbi formátumú
dokumentumok állnak rendelkezésre az országokra vonatkozóan:

    ...
    { "_id" : "AGO", "type" : "country", "name" : "Angola" },
    { "_id" : "AIA", "type" : "country", "name" : "Anguilla" },
    { "_id" : "ALA", "type" : "country", "name" : "Åland Islands" },
    ...

A __countries__ view __map()__ függvénye a következőképpen néz ki:

    function(doc) {
      if (doc.type && doc.type == 'country') {
        emit( doc.name, doc._id );
      }
    };

Ha próbaképpen lekérjük a view-t egy böngészővel,
akkor az alábbi listát kapjuk eredményül:

    {"total_rows":246,"offset":0,"rows":[
        {"id":"AFG","key":"Afghanistan","value":"AFG"},
        {"id":"ALA","key":"\u00c5land Islands","value":"ALA"},
        {"id":"ALB","key":"Albania","value":"ALB"},
        {"id":"DZA","key":"Algeria","value":"DZA"},

        ...

        {"id":"ESH","key":"Western Sahara","value":"ESH"},
        {"id":"YEM","key":"Yemen","value":"YEM"},
        {"id":"ZMB","key":"Zambia","value":"ZMB"},
        {"id":"ZWE","key":"Zimbabwe","value":"ZWE"}
    ]


Az __async.js__ tartalma ami az imént említett view-t meg fogja hívni, és
az aszinkron módon visszaadott eredményt tovább fogja adni a __data__
függvénynek, a következőképpen néz ki:

    function( callback )
    {
        var app = $$(this).app;

        app.view(
            "countries",
            {
                success : function( results )
                {
                    callback( results );
                }
            }
        );
    }

A függvény az __app__ objektum segítségével lekéri a "countries" azonosítójú
view eredményét, majd az eredménylistával meghívja az argumentumként kapott
__callback__ nevű függvényt, ami nem más mint a __data__ függvény:

    function( viewResults )
    {
        return { options : viewResults.rows };
    }

A __data__ egyszerűen kiveszi az eredménylistából a __rows__ nevű listát, és
átadja a sablonnak __options__ néven.

A sablon végighalad az __options__ elemein, kiveszi a __key / value__ párokat,
és beágyazza őket az __option__ elemekbe:

    <span class="countryCombo">
        <select name="country" id="country" class="countryCombo" tabindex="8" >
            {{#options}}
                <option value="{{value}}">{{key}}</option>
            {{/options}}
        </select>
    </span>

### Selector-ok használata

Ebben az alfejezetben azt vizsgáljuk meg közelebbről, hogy lehet az egyes
állapotokhoz hozzárendelni olyan eseményeket, amelyek egy másik állapotba viszik
át a komponensünket.

A mustache.html template-ben ehelyezhetünk olyan HTML elemeket, amelyek felhasználói
interakciókra képesek reagálni. Ilyen elemek például a form-okon belüli gombok,
vagy a hiper-linkek. De egyszerű alap események is detektálhatóak, mintpéldául
az egér mozgatása, vagy a kattintás egy objektumon.

A selector-ok szolgálnak arra, hogy a widget egy meghatározott állapotában őt
érő eseményekre hogyan reagáljon.

Példaképpen a __wizard__ komponenst fogjuk ennek szemléltetésére bemutatni:

    wizard/
    |-- decline
    |   `-- mustache.html
    |-- finish
    |   |-- data.js
    |   `-- mustache.html
    |-- _init
    |   |-- data.js
    |   |-- mustache.html
    |   `-- selectors
    |       `-- input.button
    |           `-- click.js
    |-- step2
    |   |-- data.js
    |   |-- mustache.html
    |   `-- selectors
    |       |-- input.button
    |       |   `-- click.js
    |       |-- input.field[name=login]
    |       |   `-- change.js
    |       `-- input.field[name=password]
    |           `-- change.js
    `-- step3
        |-- data.js
        |-- mustache.html
        `-- selectors
            `-- input.button
                `-- click.js

A wizard az __\_init__ állapottal kezdi a működését, majd a __step2__ és __step3__
következik, befejezésképpen pedig a __finish__ állapot következik.

Mivel most csak a selector-okra koncentrálunk, válasszuk ki a __step2__-t,
melynek sablonja így néz ki:

    <h1>Step 2</h1>
    <div class="wizard-panel">

        <div  class="form">
            <fieldset>
                <legend>&nbsp;Login parameters&nbsp;</legend>

                <p>
                    <label for="userName" class="left">Username:</label>
                    <input type="text"
                           name="userName"
                           id="userName"
                           class="field"
                           value="{{#widgetPayload}}{{userName}}{{/widgetPayload}}"
                           tabindex="1" />
                </p>

                <p>
                    <label for="password" class="left">Password:</label>
                    <input type="password"
                           name="password"
                           id="password"
                           class="field"
                           value="{{#widgetPayload}}{{password}}{{/widgetPayload}}"
                           tabindex="2" />
                </p>

                <p>
                    <label for="password_again" class="left">Password (again):</label>
                    <input type="password"
                           name="password_again"
                           id="password_again"
                           class="field"
                           value="{{#widgetPayload}}{{password}}{{/widgetPayload}}"
                           tabindex="3" />
                </p>

            </fieldset>
            <p>
                <input type="button" name="button" id="back" class="button" value="Back" tabindex="4" />
                <input type="button" name="button" id="next" class="button" value="Next" tabindex="5" />
            </p>
        </div>
    </div>

Az adatok ennél a widget-nél nem a __$$()__ függvény segítségével tárolódnak.
Az __\_init__ állapotban létrehozásra kerül egy __widgetPayload__ objektum, amit
az egyes állapotok közötti átmeneteket kiváltó triggerek adják át
paraméterként egymásnak.

A wizard egyes lapjaihoz tartozó form-ok beillesztik az aktuális értéket a megfelelő
mezőbe, ahogy az a fenti sablonon is tanulmányozható. Az állapotátmenetet kiváltó
eseményeket kezelő függvények pedig kiveszik a mezőkből az aktuális értékeket,
és berakják a __widgetPayload__ objektumba, majd továbbítják azt az új állapotnak.

Figyeljük meg, hogy a sablonban van két beviteli mező (input.field) mező,
és két nyomógomb (input.button). Mindegyik elem azonosítható _name_,
_value_, vagy _id_ attributumával.
A __step2__-höz tartozó selector ezekre az elemekre hivatkozik.

    |-- step2
       `-- selectors
           |-- input.button
           |   `-- click.js
           |-- input.field[name=login]
           |   `-- change.js
           `-- input.field[name=password]
               `-- change.js

Ha valaki rákattint egy _input.button_ selector-ral azonosítható elemre, akkor
az ahhoz rendelt __click.js__ file-ban definiált függvény hívódik meg:

    function(e)
    {
        var widgetPayload = e.data.args[1];
        var widget = $(this);
        var app = $$(widget).app;

        widgetPayload.userName = $('#userName').attr('value');
        widgetPayload.password = $('#password').attr('value');

        if( widget.attr( 'value' ) == 'Back' )
        {
            widget.trigger( '_init', widgetPayload );
        }
        else
        {
            widget.trigger( 'step3', widgetPayload );
        }
    }

a függvény behelyezi a __userName__ és __password__ mezők atuális értékét a
__widgetPayload__ objektumba, majd meghatározza, hogy melyik gombra kattintott
a felhasználó. Ez az érték _Back_, vagy _Next_ lehet. Ettől függően a widget
megtriggereli saját magát azzal az eseménnyel, amibe át kell váltania:
a _Back_ esetében az __\_init__-be, a _Next_ esetében pedig a __step3__-ba, és
egyúttal paraméterként átadja a __widgetPayload__ objektumot az aktualizált
adattartalommal.

TODO: Mintákat írni további selector-okra (form, anchor, stb.)

TODO: Adatbáziskezelő műveletekre példákat betenni.

Addig is, bemelegítő olvasmámy, hogyan lehet adatbázis műveleteket végezni, ha
egy esemény kiváltását követően valamit írni, olvasni vagy törölni akarunk:

[Bevezetés az app.db() használatába](http://www.couch.io/page/library-jquery-couch-js-database)

### Widget-ek összeláncolása

A widget-ek nem csak saját maguknak küldhetnek trigger eseményeket, hanem egymásnak is.
Ez az egyik legfontosabb képesség, ami lehetővé teszi, hogy komplex megoldásokat
egyszerű elemekből építsünk fel, és azokat kooperációra bírjuk, üzenetváltási
képességgel ruházzuk fel.

TODO: Mintát írni. <!-- http://couchapp.org/docs/_design/docs/index.html#/topic/account -->



### Eseményekhez tartozó query kifejezések definiálása

TODO: <!-- Leírni az eseményekhez tartozó query kifejezések definiálását. -->

### Oldalon belüli path kifejezések

TODO: <!-- Leírni oldalon belüli path kifejezéseket -->


<!--
    TODO: Témát tovább kifejteni részletesen!

 
    # widget-ek paraméterezése
    - Ajax async/sync widget-ek,
    - pl: combo feltöltő, URL-lel, id, class tabindex paraméterekkel.
    - after-rel ráállni a selected értékre
 
    # Összetett widget-ek készítése
 
    # widget-ek összekapcsolása triggerekkel

    # Pushing to the database

    I still don't know how to do that. :) You can always use $.ajax.

    Try $$(this).app.db.saveDoc(my_doc, success_handler);
    (see evently/profile/profileReady/selectors/form/submit.js after
    couchapp generate).

    # db API leírása példákkal
    
    # Widgetek elhelyezése és betöltése
        * evently
        * vendor/evently


    # Öröklődés a widget-ek között


    # a $(document)ready() tetszőleges példányban használható.
    A megadás sorrendjében fognak meghívódni.

    # Q & A

    * Q: How can I use another jQuery library in evently functions? Even with hardcoded data: http://people.iola.dk/olau/flot/examples/basic.html

    A: I would just put the code in _init.js, or _init/after.js if you wanted to run a mustache template first and then add flot.

    A: Indeed. I also had to make sure to include the flot js script after loader.js.


    # API

    $.couch.app( appFun, opts )

        opts.urlPrefix  // URL prefix: http://localhost:5984
        opts.db         // db-name, default: /{widgets}/_design/widgets/index.html
        opts.design     // design document, default: /widgets/_design/{widgets}/index.html

    Használat:
    A paraméterként átadott __appFun__ függvény meghívódik, amikor az oldal betöltődött
    és készen áll a működésre.

    A CouchApp átadja számára az __app__ objektumot, amely a megfelelő adatbázis
    kapcsolatot hivatott biztosítani, és a CouchApp helper műveletekhez biztosít hozzáférést.

    pl.:
    $.couch.app(function(app) {
       app.db.view(...)
       ...
    });

    Mellékhatások:
    $.couch.urlPrefix = urlPrefix;

 -->