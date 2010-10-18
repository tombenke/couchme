Lekérdezések
============


Ebben a fejezetben egyszerű lekérdezéseket fogunk definiálni a __contacts__
adatbázison, amelyet az [Adatfeltöltés](dataUpload.html) fejezetben
hoztunk létre.

A CouchDB-ben a lekérdezések és riportok előállítására az ún. view-k szolgálnak.

A view-k használata két lépésből áll:

* a view-k definiálása,
* a view-k használata (lekérdezése).

Kétféle view típus létezik:

* átmeneti (temporary), és
* állandó (permanent).

Az átmeneti view-kat alapvetően csak fejlesztés során alkalmazzuk.
Végrehajthatók a Futon felületéről, vagy egy HTTP POST request-tel a következő
URL-re:

    /{dbname}/_temp_view,

ahol a Content-type header változót "application/json" értékre kell állítani
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

    http://localhost:5984/contacts/_design/contacts/_view/allContacts

ahol a __{docid}__:

    _design/contacts


a __{viewname}__ pedig:

    _view/allContacts


Mindkét típusú view definiálása JavaScript függvények írásával történik.
Más nyelvi implementáció is lehetséges, de mi csak a JavaScript-es verziót tárgyaljuk.

Korábban volt szó róla, hogy a design dokumentumok maguk is JSON dokumentumok, akár a
közönséges adatok. Ennek megfelelően a view-k definiálása is JSON mezők, ill. struktúrák
létrehozásából állnak. Ezt megtehetjük közvetlenül, a JSON struktúra szerkesztésével.

Mi azonban azt az utat fogjuk követni, hogy a design dokumentum egyes elemeit külön-külön
folderekbe, és file-okba tesszük, majd a __couchapp__ utility segítségével alakítjuk át
JSON formátumúra, és töltjük fel az adatbázisba. Helyenként, a példákban, a teljesség kedvéért
utalunk a létrehozott, végleges JSON struktúrákra is.

A view definiálásakor először adunk neki egy nevet, majd ezzel a névvel létrehozunk
egy foldert abban a design dokumentumban, amelyben el akarjuk helyezni a view-t.

Ebben a folderben két függvényt helyezhetünk el egy-egy file-ban.
Az egyik a _map()_, a másik a _reduce()_.
Ez utóbbi használata opcionális, viszont _map()_ megadása kötelező.

Definiálásuk úgy történik, hogy a view nevével létrehozott folderben elhelyezünk
egy __map.js__, ill. egy __reduce.js__ file-t, melyek egy-egy JavaScript
függvényt fognak tartalmazni.

A view-k kiszámítása úgy történik, hogy a __map()__ függvény meghívódik minden
egyes dokumentumra az adatbázisban, átadva azt paraméterként a függvénynek.

A __map()__ függvény pedig meghívhat egy __emit()__ nevű függvényt,
amelynek két argumentuma van: __key__ és __value__.

A __map()__ függvény annyiszor hívja meg ezt a függvényt, ahányszor jónak látja.
Minden egyes alkalommal egy eredmény rekord tárolódik el a view-ban, amely a __key__
értéke alapján indexelésre is kerül.

Az esetek jelentős részében ezzel a view létrehozása véget is ér. Az eredmény
egy halmaz lesz __key__ értékek alapján indexelt rekord halmaz lesz.

A __key__ nem csak egyszerű, de összetett érték is lehet.

Felhasználva a __customer__ adatbázis dokumentumait, ha például egy olyan listát
szeretnénk kapni, amelyben minden személy, összes adatával szerepel, az egyedi
dokumentum azonosítója alapján sorba rendezve, akkor az alábbi __map()__
függvényt kell írnunk:

    function( doc )
    {
        emit( doc._id, doc );
    };

Hozzunk létre a __\_design/contacts__ design dokumentum alatt egy __views__
alkönyvtárat, majd ebben hozzunk létre egy __contacts__ aldirectory-t, és abban egy
__map.js__ file-t, amibe írjuk be a fent látható __map()__ függvényt.

Töltsük fel az adatbázist adatokkal, majd ugyancsak töltsük fel a design ű
dokumentumunkat a couchapp utility segítségével.

Ezek után hajtsunk végre egy keresést az alábbi paranccsal:

    curl -X GET http://localhost:5984/contacts/_design/contacts/_view/contacts

az eredménynek a következőnek kell lennie:

    {"total_rows":5,"offset":0,"rows":[
    {"id":"8465af0d3d78f4d4b392010b5e0170ab","key":"8465af0d3d78f4d4b392010b5e0170ab","value":{"_id":"8465af0d3d78f4d4b392010b5e0170ab","_rev":"1-4e2fc63dee5ccbab9850d5e77e6f7afa","name":"Charles Bing","age":43,"country":"USA","phone":"555-821345","email":"charlesb@exmaple.com"}},
    {"id":"8465af0d3d78f4d4b392010b5e017707","key":"8465af0d3d78f4d4b392010b5e017707","value":{"_id":"8465af0d3d78f4d4b392010b5e017707","_rev":"1-1f87adcd58afa900d8082b2f796f4f44","name":"Emma Watson","age":33,"country":"Great Britain","phone":"555-726531","email":"emma@example.com","fax":"555-726532"}},
    {"id":"8465af0d3d78f4d4b392010b5e017fa9","key":"8465af0d3d78f4d4b392010b5e017fa9","value":{"_id":"8465af0d3d78f4d4b392010b5e017fa9","_rev":"1-c70e670073125c53aae0109d727eb368","name":"Eric Quinn","age":23,"country":"USA","phone":"555-012796","fax":"555-098245"}},
    {"id":"8465af0d3d78f4d4b392010b5e0181cd","key":"8465af0d3d78f4d4b392010b5e0181cd","value":{"_id":"8465af0d3d78f4d4b392010b5e0181cd","_rev":"1-91bd3e132e9f378568df697db8a68804","name":"John Smith","age":54,"country":"Australia","phone":"55-372589","email":"jsmith@example.com","fax":"555-372590"}},
    {"id":"8465af0d3d78f4d4b392010b5e018ff3","key":"8465af0d3d78f4d4b392010b5e018ff3","value":{"_id":"8465af0d3d78f4d4b392010b5e018ff3","_rev":"1-8010f0b12b720288fe180db488827aec","name":"Jane Thomas","age":14,"country":"USA","phone":"555-210897","email":"jthomas@example.com"}}
    ]}

A __map()__ függvény mellett, opcionálisan írhatunk egy __reduce()__ függvényt is.
Ez a map fázisban létrehozott eredmény listán különféle aggregációs
(pl.: average, sum) műveletek elvégzésére szolgál.


A view-k akkor számítódnak ki, amikor először lekérdezésre kerülnek. Egy dokumentum 
módosulása, vagy beillesztése önmagában nem jár automatikusan a view újraszámolásával.
Ugyanakkor ezt ki lehet váltani egy script segítségével.

Ezzel szemben, egy design dokumentum alá tartozó view-k bármelyike lekérdezésre kerül, 
az az összes, ugyanabban a design dokumentumban lévő view aktualizálását is maga után vonja.


<!--
## customer -ek listázása JSON formátumban

A list függvény (_\_design/contacts/lists/contactsToJSON.js_):

    function( head, req )
    {
        start({
            "headers": {
                "Content-Type" : "application/json"
            }
        });
        send( '{"head":' + toJSON(head) + ', ' );
        send( '"req":' + toJSON(req) + ', ' );
        send( '"rows":[' );
        var row, sep = '\n';
        while( row = getRow() )
        {
            send( sep + toJSON( row ) );
            sep = ', \n';
        }
        return "]}";
    }

A lekérdezés URL-je:

    http://localhost:5984/contacts/_design/contacts/_list/contactsToJSON/contacts

Az eredmény:

    {"head":{"total_rows":5,"offset":0,"update_seq":8}, "req":{"info":{"db_name":"contacts","doc_count":6,"doc_del_count":0,"update_seq":8,"purge_seq":0,"compact_running":false,"disk_size":28761,"instance_start_time":"1287000020211987","disk_format_version":5,"committed_update_seq":8},"id":null,"uuid":"8465af0d3d78f4d4b392010b5e0191b4","method":"GET","path":["contacts","_design","contacts","_list","contactsToJSON","contacts"],"query":{},"headers":{"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8","Accept-Charset":"ISO-8859-1,utf-8;q=0.7,*;q=0.7","Accept-Encoding":"gzip,deflate","Accept-Language":"en-us,en;q=0.5","Connection":"keep-alive","Cookie":"AuthSession=","Host":"localhost:5984","Keep-Alive":"115","User-Agent":"Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.10) Gecko/20100915 Ubuntu/10.04 (lucid) Firefox/3.6.10"},"body":"undefined","peer":"127.0.0.1","form":{},"cookie":{"AuthSession":""},"userCtx":{"db":"contacts","name":null,"roles":["_admin"]}}, "rows":[
    {"id":"8465af0d3d78f4d4b392010b5e0170ab","key":"8465af0d3d78f4d4b392010b5e0170ab","value":{"_id":"8465af0d3d78f4d4b392010b5e0170ab","_rev":"1-4e2fc63dee5ccbab9850d5e77e6f7afa","name":"Charles Bing","age":43,"country":"USA","phone":"555-821345","email":"charlesb@exmaple.com"}},
    {"id":"8465af0d3d78f4d4b392010b5e017707","key":"8465af0d3d78f4d4b392010b5e017707","value":{"_id":"8465af0d3d78f4d4b392010b5e017707","_rev":"1-1f87adcd58afa900d8082b2f796f4f44","name":"Emma Watson","age":33,"country":"Great Britain","phone":"555-726531","email":"emma@example.com","fax":"555-726532"}},
    {"id":"8465af0d3d78f4d4b392010b5e017fa9","key":"8465af0d3d78f4d4b392010b5e017fa9","value":{"_id":"8465af0d3d78f4d4b392010b5e017fa9","_rev":"1-c70e670073125c53aae0109d727eb368","name":"Eric Quinn","age":23,"country":"USA","phone":"555-012796","fax":"555-098245"}},
    {"id":"8465af0d3d78f4d4b392010b5e0181cd","key":"8465af0d3d78f4d4b392010b5e0181cd","value":{"_id":"8465af0d3d78f4d4b392010b5e0181cd","_rev":"1-91bd3e132e9f378568df697db8a68804","name":"John Smith","age":54,"country":"Australia","phone":"55-372589","email":"jsmith@example.com","fax":"555-372590"}},
    {"id":"8465af0d3d78f4d4b392010b5e018ff3","key":"8465af0d3d78f4d4b392010b5e018ff3","value":{"_id":"8465af0d3d78f4d4b392010b5e018ff3","_rev":"1-8010f0b12b720288fe180db488827aec","name":"Jane Thomas","age":14,"country":"USA","phone":"555-210897","email":"jthomas@example.com"}}]}


## age

A _map()_ függvény:

    function( doc )
    {
        if( ! doc.country ) return;
        emit( doc.country, doc.age );
    }

A _reduce()_ függvény:

    function( key, values, rereduce )
    {
        var totals = sum( values );
        return Math.round( (totals / values.length) * 100) / 100;
    }

Lekérdezés:

    http://localhost:5984/contacts/_design/contacts/_view/age

Eredmény:

    {"rows":[
    {"key":null,"value":33.4}
    ]}
-->
<!--

## viewName

A _map()_ függvény:


A _reduce()_ függvény:


Lekérdezés:

    http://localhost:5984/contacts/_design/contacts/_view/...

Eredmény:


 -->
