Lekérdezések
============

Ebben a fejezetben egyszerű lekérdezéseket fogunk definiálni.
A példákhoz a __cogito__ nevű alkalmazást fogjuk felhasználni.
A forrásfile-ok szabadon hozzáférhetőek a [cogito](github.com/tombenke/cogito)
nyilvános repository-jában.

## Mit értünk lekérdezés alatt?

Amikor felépítünk egy web-es alkalmazást, sokféle tartalommal, formában és módon
kell adatokat kinyernünk a serveren tárolt adatbázisból.
A teljesség igénye nélkül néhány példa arra, tipikusan miket kérdezünk le:

* Dokumentumok egy meghatározott halmazát.
* Bizonyos dokumentum részeket.
* Többféle, egymással valamilyen logikai kapcsolatban lévő dokumentumhalmazt,
  vagy azok részeit.
* Csoportosított aggregátumokat (kontrol-váltás).
* Egyedi dokumentumokat, vagy azok egy részét
* Speciális formátumú tartalmakat (ún. csatolt állományokat).

A lekérdezés eredménye JSON formátumban áll elő.
Ezt a servernek bizonyos esetekben át kell alakítania attól függően,
hogy milyen formában, és kinek kell szolgáltatni.

Tipikus reprezentációs formák:

* JSON (pl.: Ajax hívás browserből, HTTP kliens)
* XML (B2B üzenetváltás, adat export, HTTP kliens)
* plain text (böngésző)
* (X)HTML (böngésző)

Fontos kiemelni, hogy a view, amivel a lekérdezést végrehajtjuk mindig JSON-t
állít elő. Sok esetben ezt közvetlenül képes a kliens felhasználni.
Számos esetben viszont utófeldolgozást, átalakítást kell végrehajtani.

Az átalakításhoz a CouchDB két tipikus eszközt nyújt:

* a __list__-ek szolgálnak adathalmazok transzformálására
* a __show__-k pedig egyedi dokumentumok átalakítására.

Ezt a két technikát külön fejezetben tárgyaljuk. Minkét esetben azonban
előzetesen elő kell állítani a megjelenítendő adathalmazt, ill. azonosítanunk kell
az egyedi dokumentumot, és erre valók __view__-k.

## Átmeneti és Állandó view-k

A CouchDB-ben a lekérdezések és riportok előállítására tehát az ún. view-k szolgálnak.

A view-k használata két lépésből áll:

* a view-k definiálása,
* a view-k használata (lekérdezése).

Kétféle view típus létezik:

* átmeneti (temporary), és
* állandó (permanent).

Az átmeneti view-kat inkább csak fejlesztés során alkalmazzuk.
Végrehajthatók a Futon felületéről, vagy egy HTTP POST request-tet végrehajtva
a következő formátumú URL-re:

    /{dbname}/_temp_view,

ahol a _Content-type_ header változót "application/json" értékre kell állítani
és a request tartalmának a view függvény kódját kell tartalmaznia.

<!-- TODO példát írni -->

Az átmeneti view-k nem tárolódnak az adatbázisban, és minden végrehajtáskor
újra számolódnak, ami jelentős performancia visszaesést eredményezhet.
Emiatt produktív környezetben használatát célszerű elkerülni, viszont megkönnyíti
a fejlesztés közbeni "kísérletezést".

Az állandó (permanens) view-k az ún. design dokumentumban vannak tárolva, és
HTTP GET kérésekkel lehet lekérdezni őket, az alábbi URL minta szerint:

    /{dbname}/{docid}/{viewname},

ahol a __{docid}__-nek van egy __\_design/__ előtagja, amitől a CouchDB felismeri,
hogy ez egy speciális, design dokumentum.
A __{viewname}__ pedig a __\_view/__ prefixet tartalmazza, amiből a CouchDB
megállapíthatja, hogy egy view-ról van szó.

Az alábbi URL pl.: egy szabályos view hivatkozás:

    http://localhost:5984/cogito/_design/cogito/_view/contacts

ahol a __{docid}__:

    _design/cogito


a __{viewname}__ pedig:

    _view/contacts


Mindkét típusú view definiálása JavaScript függvények írásával történik.
Más nyelvi implementáció is lehetséges,
de mi csak a JavaScript-es verziót tárgyaljuk.

Korábban volt szó róla, hogy a design dokumentumok maguk is JSON dokumentumok,
akár a közönséges adatok.
Ennek megfelelően a view-k definiálása is JSON mezők,
ill. struktúrák létrehozásából állnak.
Ezt megtehetjük közvetlenül, a JSON struktúra szerkesztésével.

Mi azonban azt az utat fogjuk követni,
hogy a design dokumentum egyes elemeit külön-külön folderekbe,
és file-okba tesszük, majd a __couchapp__ utility segítségével alakítjuk át
JSON formátumúra, és töltjük fel az adatbázisba.
Helyenként, a példákban, a teljesség kedvéért utalunk a létrehozott,
végleges JSON struktúrákra is.

A *view* definiálásakor először adunk neki egy nevet,
majd ezzel a névvel létrehozunk egy foldert abban a design dokumentumban,
amelyben el akarjuk helyezni a *view*-t.

Ebben a folderben két függvényt helyezhetünk el egy-egy file-ban:

* a __map()__-et, melynek használata kötelező, és
* a __reduce()__-t. Ez utóbbi használata opcionális.

Definiálásuk úgy történik, hogy a *view* nevével létrehozott folderben elhelyezünk
egy __map.js__, ill. egy __reduce.js__ file-t, melyek egy-egy JavaScript
függvényt fognak tartalmazni.

A view-k kiszámítása úgy történik, hogy a __map()__ függvény meghívódik minden
egyes dokumentumra az adatbázisban, átadva azt paraméterként a függvénynek.

A __map()__ függvény pedig meghívhat egy __emit()__ nevű függvényt,
amelynek két argumentuma van: __key__ és __value__.

A __map()__ függvényt annyiszor hívja meg ezt a függvényt, ahányszor jónak látja.
Minden egyes alkalommal egy eredmény rekord tárolódik el a view-ban, amely a __key__
értéke alapján indexelésre is kerül.

Az esetek jelentős részében ezzel a view létrehozása véget is ér. Az eredmény
egy, a __key__ értékek alapján indexelt rekord halmaz lesz.

A __key__ nem csak egyszerű, de összetett érték is lehet.

A minta adatbázisunkban többek között az alábbi projekt típusú dokumentumokat tároljuk:


    [
        {
            "type": "project",
            "_id": "cogito",
            "sponsor": "tombenke",
            "manager": "tombenke",
            "created": "2010-10-20",
            "started": "",
            "deadline": "2010-12-15",
            "summary": "cogito GTD-like web application",
            "details": "Develop a web based application with CouchDB",
            "tags": ["project","GTD"]
        },
        {
            "type": "project",
            "_id": "csvconv",
            "sponsor": "tombenke",
            "manager": "tombenke",
            "created": "2010-06-01",
            "started": "",
            "deadline": "2010-10-18",
            "summary": "CSV converter utility",
            "details": "Develop a utility to convert CSV files to XML and to JSON format",
            "tags": ["project","CouchDB","CSV"]
        },
        {
            "type": "project",
            "_id": "couchme",
            "sponsor": "tombenke",
            "manager": "tombenke",
            "created": "2010-09-15",
            "started": "",
            "deadline": "2010-12-23",
            "summary": "CouchMe how to use CouchDB",
            "details": "Readings about how to develop web applications with CouchDB and CouchApp",
            "tags": ["project","CouchDB","CouchApp"]
        }
    ]

Felhasználva a __cogito__ adatbázis dokumentumait, ha például egy olyan listát
szeretnénk kapni, amelyben minden projekt, összes adatával szerepel, az egyedi
dokumentum azonosítója alapján sorba rendezve, akkor az alábbi __map()__
függvényt kell írnunk:

    function( doc )
    {
        if( doc.type == 'project' )
        {
            emit( null, doc );
        }
    };

Hozzunk létre a __\_design/cogito__ design dokumentum alatt egy __views__
alkönyvtárat, majd ebben hozzunk létre egy __projects__ aldirectory-t, és abban egy
__map.js__ file-t, amibe írjuk be a fent látható __map()__ függvényt.

Töltsük fel az adatbázist adatokkal, majd ugyancsak töltsük fel a design
dokumentumunkat a couchapp utility segítségével.

Ezek után hajtsunk végre egy keresést az alábbi paranccsal:

    curl -X GET http://localhost:5984/cogito/_design/cogito/_view/projects

az eredménynek a következőnek kell lennie:

<!-- TODO: CHECK -->

    {"total_rows":3,"offset":0,"rows":[
    {"id":"cogito","key":null,"value":{"_id":"cogito","_rev":"1-b18ec420bfcd56b362fbb2d9c8447988","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-10-20","started":"","deadline":"2010-12-15","summary":"cogito GTD-like web application","details":"Develop a web based application with CouchDB","tags":["project","GTD"]}},
    {"id":"couchme","key":null,"value":{"_id":"couchme","_rev":"1-8b4cdf4d6e29d085fa8459ba4d8215a8","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-09-15","started":"","deadline":"2010-12-23","summary":"CouchMe how to use CouchDB","details":"Readings about how to develop web applications with CouchDB and CouchApp","tags":["project","CouchDB","CouchApp"]}},
    {"id":"csvconv","key":null,"value":{"_id":"csvconv","_rev":"1-42ff3cab63e789fef89cebd06a9a3e7e","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-06-01","started":"","deadline":"2010-10-18","summary":"CSV converter utility","details":"Develop a utility to convert CSV files to XML and to JSON format","tags":["project","CouchDB","CSV"]}}
    ]}

A fenti esetben a dokumentumok tartalmára volt szükségünk, 
amit egy meghatározott szűrést követően, rendezett listából, kívántuk kiemelni.

Más esetben valamilyen számolási műveletet akarunk az adatok valamely részhalmazán
elvégezni, és az így kapott adatokat valamilyen módon aggregálni kívánjuk.

Erre szolgál a __reduce()__ függvény, amit a __map()__ függvény mellett,
opcionálisan alkalmazhatunk.
Ez a függvény a map fázist követő reduce fázisban létrehozott eredmény listán
különféle aggregációs (pl.: average, sum) műveletek elvégzésére szolgál.

Határozzuk meg például, a dokumentumokban található Tag-ek számát.
Erre a célra hozuk létre az alábbi __map()__ függvényt, ami dokumentum típustól
függetlenül minden létező tag-et felvesz az eredménylistára.

A __map()__ függvény:

    function( doc )
    {
        if( doc.tags )
        {
            doc.tags.forEach( function( tag )
            {
                emit( tag, 1 );
            });
        }
    }

A kulcs maga a tag lesz, az érték pedig 1. Természetesen, ha ugyanazon tag
több dokumentumban is szerepel, akkor több példányban elő fog fordulni a
__map()__ által előállított eredmény listában.

A __reduce()__ függvény két listát kap argumentumként, az egyik a kulcsokat,
a másik a kulcsokhoz tartozó értékeket rögzíti:

    function( keys, values )
    {
        return sum( values );
    }

Amint a példából látszik, a függvény egyszerűen öszegzi a tag-ek mennyiségét.

A függvénynek létezik még egy harmadik argumentuma, a __rereduce__, melynek értéke
false, ha a függvény a BTree eredménylistában egy terminális elemre hívódik meg,
és true, ha egy közbülső szintre.

TODO: rereduce használatát részletesebben kifejteni.

Az imént definiált két függvény működését az alábbi URL-en próbálhatjuk ki:

[http://localhost:5984/cogito/_design/cogito/_view/tags](http://localhost:5984/cogito/_design/cogito/_view/tags)

Eredmény:

    {"rows":[
    {"key":null,"value":10}
    ]}

Látható, hogy a végeredmény egyetlen szám, a tag-ek száma.

A view-ek végrehajtását módunkban áll URL paraméterekkel hangolni.
Ilyen paraméter például a __group__, amelyet kontrol-váltás jellegű aggregáláskor
alkalmazunk, mint azt az alábbi példa is szemlélteti:

[http://localhost:5984/cogito/_design/cogito/_view/tags?group=true](http://localhost:5984/cogito/_design/cogito/_view/tags?group=true)

Eredmény:

    {"rows":[
    {"key":"CouchApp","value":1},
    {"key":"CouchDB","value":2},
    {"key":"CSV","value":1},
    {"key":"GTD","value":2},
    {"key":"project","value":3},
    {"key":"task","value":1}
    ]}

Figyeljük meg, hogy a __map()__/__reduce()__ függvények, és az URL változatlan maradt,
mindössze egyetlen paramétert adtunk hozzá a lekérdezéshez.


Az alábbi táblázat összefoglalja a GET és HEAD request-ek esetén alkalmazható
paramétereket:

<table>
<thead>
<tr>
<th>Paraméter</th>
<th>Érték</th>
<th>Alapértelmezett érték</th>
<th>Leírás</th>
</tr>
</thead>

<tbody>

<tr>
<td>key</td>
<td>key-value</td>
<td>&mdash;</td>
<td>URL-kódolt JSON érték. A keresett rekord kulcs értékét határozza meg.</td>
</tr>

<tr>
<td>startkey</td>
<td>key-value</td>
<td>&mdash;</td>
<td>URL-kódolt JSON érték. A keresett rekord-tartomány kezdő kulcs értékét határozza meg.</td>
</tr>

<tr>
<td>startkey_docid</td>
<td>document id</td>
<td>&mdash;</td>
<td>A tartomány kezdő dokumentum azonosítója.</td>
</tr>

<tr>
<td>endkey</td>
<td>key-value</td>
<td>&mdash;</td>
<td>URL-kódolt JSON érték. A keresett rekord-tartomány záró kulcs értékét határozza meg.</td>
</tr>

<tr>
<td>endkey_docid</td>
<td>endkey_docid</td>
<td>&mdash;</td>
<td>A tartomány záró dokumentum azonosítója</td>
</tr>

<tr>
<td>limit</td>
<td>number of docs</td>
<td>&mdash;</td>
<td>Az eredménylistában szereplő dokumentumok maximális száma.</td>
</tr>

<tr>
<td>stale</td>
<td>ok</td>
<td>&mdash;</td>
<td>Ha a stale=ok értékre van állítva, akkor a CouchDB a view-t nem fogja frissíteni,
akkor sem, ha az indokolt lenne.
Pl.: Hosszú ideig tartó adatfeltöltés esetén hasznos,
ha a régebbi adatok is megfelelően a szolgáltatáshoz, és nem akarjuk kivárni
a friss adatokkal aktualizált view kiszámolását</td>
</tr>

<tr>
<td>descending</td>
<td>true / false</td>
<td>false</td>
<td>A kimenet sorrendjének megfordítása</td>
</tr>

<tr>
<td>skip</td>
<td>dokumentum szám</td>
<td>0</td>
<td>n-számú dokumentumot kihagy</td>
</tr>

<tr>
<td>group</td>
<td>true</td>
<td>false</td>
<td>A group opció szabályozza, hogy a <strong>reduce()</strong> függvény az eredménylistát
különálló kulcsok egy meghatározott csoportjára, vagy akár egyetlen sorra redukálja.</td>
</tr>

<tr>
<td>group_level</td>
<td>number</td>
<td>-</td>
<td>A csoportosítás szintjét határozza meg.</td>
</tr>

<tr>
<td>reduce</td>
<td>true / false</td>
<td>true</td>
<td>A <strong>reduce()</strong> funkció használatát kapcsolja ki, vagy be.
Alapértelmezett értéke true, ha van <strong>reduce()</strong> függvény definiálva, egyébként false.</td>
</tr>

<tr>
<td>include_docs</td>
<td>true / false</td>
<td>false</td>
<td>Automatikusan lekéri, és beágyazza a dokumentumokat az eredményként szolgáló view sorokba.</td>
</tr>

<tr>
<td>inclusive_end</td>
<td>true / false</td>
<td>true</td>
<td>Azt vezérli, hogy az endkey beletartozzon az eredménylistába, vagy sem.</td>
</tr>

</tbody>
</table>

További részletek ebben a témában a
[HTTP View API](http://wiki.apache.org/couchdb/HTTP_view_API?action=show&redirect=HttpViewApi)
oldalon olvashatóak.


A view-k akkor számítódnak ki, amikor először lekérdezésre kerülnek. Egy dokumentum
módosulása, vagy beillesztése önmagában nem jár automatikusan a view újraszámolásával.
Ugyanakkor ezt ki lehet váltani egy script segítségével.

Ezzel szemben, egy design dokumentum alá tartozó view-k bármelyike lekérdezésre kerül,
az maga után vonja az összes, ugyanazon design dokumentumban lévő view aktualizálását is.

További példákat találunk a __map()__/__reduce()__ függvényekre,
és a View API használatára a [Lekérdezési receptek](view_snippets.html) fejezetben.
