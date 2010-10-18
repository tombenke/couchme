Alkalmazás-fejlesztés
=====================

## Egy alkalmazás struktúrája

A CouchDB amellett, hogy adatbáziskezelő, web-serverként is funkcionál.
Ez egyúttal azt is jelentki, hogy hasonló web-es alkalmazásokat futtathatunk
rajta, mint pl. egy PHP-s alkalmazás egy Apache serveren, vagy egy Javá-s alkalmazás
Apache Tomcat-en.

Ez utóbbi két web serverhez hasonlóan, a CouchDB is meghatározott tárolási
formátumot ír elő a rajta futtatni kívánt alkalmazások számára.
Létezik azonban két alapelv, amely döntően befolyásolja,
hogy milyen formában kell elkészítenünk forrásfile-jainkat.

* A fejlesztendő alkalmazást képező állományok szabványos file-ok,
melyek formátumát a web-es és egyéb szabványok határozzák meg.
Ezek körébe tartoznak többek között a HTML oldalak, CSS file-ok,
továbbá JavaScript, Python, Erlang és esetleg más nyelven írt, forráskód file-ok.
Elkészítésükhöz bármilyen, szokásos eszköz felhasználható.

* A CouchDB számára minden "dolog" amit tárol nem más mint (JSON formátumú) "dokumentum".
Vagyis a web-es alkalmazások is dokumentumok.

Mielőtt tovább megyünk, vegyük kicsit tüzetesebben szemügyre
a web-es alkalmazásokat tartalmazó dokumentumokat, melyeket _\_design_ dokumentumnak
neveznek. Az elnevezés abból adódik, hogy a dokumentum azonosítója a
__\_design/__ előtaggal kezdődik. A \_design dokumentum tehát éppen olyan JSON
dokumentum, mint a többi adatbázisban lévő dokumentum, csak a neve kötött formátumban
kezdődik. A __\_design/__-t bármi követheti. ráadásul egy adott adatbázisban több
ilyen kezdetű dokumentum is helyet foglalhat.

Az alábbi nevek szabályos \_design-dokumentum nevek:

    _design/couchme
    _design/contacts
    _desing/myapp


Az alábbi folderstruktúrában elrendezett forrásfile-ok megfelelnek a CouchDB
elrendezési és névadási konvencióinak:

    _design/contacts
    |-- couchapp.json
    |-- _id
    |-- language
    |-- lists
    |   |-- contactsToJSON.js
    |   `-- rowsToJSON.js
    `-- views
        |-- age_average
        |   |-- map.js
        |   `-- reduce.js
        |-- age_max_min
        |   |-- map.js
        |   `-- reduce.js
        `-- contacts
            `-- map.js

Az egyes file-ok szerepét, tartalmát a továbbiakban részletesen tárgyaljuk.
Most egyenlőre csak a file-ok nevére, és elhelyezkedésére koncentráljunk.

A fent kilistázott file-halmazt az alábbi formátumú JSNO dokumentummá kell
konvertálni, annak érdekében, hogy a CouchDB azt web-es alkalmazásként képes
legyen értelmezni:

    {
       "_id": "_design/contacts",
       "_rev": "4-524e1660653d4861864690264f0fc8b9",
       "language": "javascript",
       "views": {
           "age_max_min": {
               "map": "function(doc) {\u000a     if( ! doc.age ) return;\u000a     emit( \"age_max_min\", doc.age );\u000a}",
               "reduce": "function(key, values, rereduce ) {\u000a  var max, min;\u000a  if(rereduce == false) {\u000a    max = values[0];\u000a    min = values[0];\u000a    for(item in values) {\u000a      if(values[item] > max) max = values[item];\u000a      if(values[item] < min) min = values[item];\u000a    }\u000a    return { \"max\": max, \"min\": min };\u000a  } else {\u000a    max = values[0].max;\u000a    min = values[0].min;\u000a    for(item in values) {\u000a      if(values[item].max > max) max = values[item].max;\u000a      if(values[item].min < min) min = values[item].min;\u000a    }\u000a    return { \"max\": max, \"min\": min };\u000a  }\u000a\u000a}"
           },
           "age_average": {
               "map": "function(doc) {\u000a     if( ! doc.age ) return;\u000a     emit( \"average\", doc.age );\u000a}",
               "reduce": "function( key, values, rereduce )\u000a{\u000a    var totals = sum( values );\u000a    return Math.round( (totals / values.length) * 100 / 100);\u000a}"
           },
           "contacts": {
               "map": "function( doc )\u000a{\u000a    emit( doc._id, doc );\u000a};"
           }
       },
       "lists": {
           "rowsToJSON": "function( head, req )\u000a{\u000a    send(\"head\");\u000a    var row;\u000a    while( row = getRow() )\u000a    {\u000a        log( \"row: \" + toJSON( row ) );\u000a        send( row. key );\u000a    };\u000a    return \"tail\";\u000a}",
           "contactsToJSON": "function( head, req )\u000a{\u000a    start({\u000a        \"headers\": {\u000a            \"Content-Type\" : \"application/json\"\u000a        }\u000a    });\u000a    send( '{\"head\":' + toJSON(head) + ', ' );\u000a    send( '\"req\":' + toJSON(req) + ', ' );\u000a    send( '\"rows\":[' );\u000a    var row, sep = '\\n';\u000a    while( row = getRow() )\u000a    {\u000a        send( sep + toJSON( row ) );\u000a        sep = ', \\n';\u000a    }\u000a    return \"]}\";\u000a}"
       },
       "couchapp": {
           "objects": {
           },
           "signatures": {
           },
           "name": "Contacts data",
           "env": {
               "default": {
                   "db": "http://localhost:5984/contacts"
               },
               "public": {
                   "db": "http://tombenke.couchone.com/contacts"
               }
           },
           "manifest": [
               "couchapp.json",
               "language",
               "views/",
               "views/contacts/",
               "views/contacts/map.js",
               "views/age_max_min/",
               "views/age_max_min/reduce.js",
               "views/age_max_min/map.js",
               "views/age_average/",
               "views/age_average/reduce.js",
               "views/age_average/map.js",
               "lists/",
               "lists/rowsToJSON.js",
               "lists/contactsToJSON.js"
           ],
           "description": "contacts"
       }
    }

Némi "hosszan-nézéssel" megállapítható, hogy a folder-struktúra, a file-nevek és
azok tartalma egy-az-egyben megfeleltethető a JSON adatstruktúrának.

Nézzük most meg egy picit közelebbről, hogy hogyan is néz ki egy ilyen, tipikus
folder-struktúra:

    _design/<appname>
    |-- _attachments
    |-- evently
    |-- lists
    |-- shows
    |-- updates
    |-- vendor
    `-- views

Itt most csak röviden összefoglaljuk, hogy az egyes foldereknek mi a szerepe.
A továbbiakban, a megfelelő fejezetekben, mindegyiket részletesen tárgyaljuk.

* Az __\_attachments__ folderben elhelyezett állományokat a a server változtatás
nélkül jeleníti meg. Itt helyezhetők el azok az "asset"-jellegű file-ok,
(pl.: képek, statikus HTM loldalak, CSS file-ok ) melyekre
az aktív tartalmak (programok) hivatkozni fognak.

* Az __evently__ folder az ún. widgeteket tartalmazza. Ezek a megjelenítő retegben
használatok "mikro MVC objektumok", melyekből a web-oldal aktív tartalma összeállítható.
Főként speciális, CouchDB-hez fejlesztett jQuery pluginek-ből állnak.

* A __lists__ folder JavaScript állományokat tartalmaz, melyek lekérdezések
eredményeit adó listák megejelenítésére szolgálnak.

* A __shows__ folder a lekérdezések eredményének megjelenítésére szolgáló
file-okat JavaScript tartalmazza.

* Az __updates__ folderben olyan JavaScript függvények vannak, melyek az adatfeltöltés
során használatos update műveletek validálására szolgálnak.

* A __vendor__ folder a könyvtárként újrafelhasználható, előre beépített
widgeteket tárolja.

* a __views__ folder az adatbázis lekérdezéseket megvalósító, ún. map/reduce
függvényeket tartalmazza, amelyek az adatbázis lekérdezésére szolgálnak.

A CouchDB Futon nevű adminisztrációs felületével gyakorlatilag közvetlenül a serveren
létre tudunk hozni alkalmazásokat, JSON formátumban, de ez nem túl kényelmes, és
még kevésbé hatékony megoldás.

Az előzőleg elkészített, különféle file-okat tehát át kell alakítani
egy JSON formátumú dokumentummá, méghozzá olymódon, hogy azokat a server értelmezni
tudja. Az értelmezés azt jelenti, hogy bizonyos, előre meghatározott szervező
elv és elnevezési konvenciók szerint a folderekbe rendezett állományokat egy
erre a célra szolgáló segédprogrammal átalakítjuk egy JSON dokumentummá, és
azt feltöltjük a serverre.

Az előírás szerinti folderstrutúrát sem kell feltétlenül manuálisan,
fejből reprodukálnunk, ugyanis a konverziót és feltöltést lehetővé tevő
program képes egy üres program vázat létrehozni, de arra is alkalmas, hogy egy
serveren már létező programot klónozzon a lokális meghajtónkra, amit azután
módosíthatunk is ismét feltölthetünk segítségével.

A segédprogramot, ami mindezt lehetővé teszi CochApp-nak hívják.

## CouchApp

### Ismerkedés a CouchApp-pal

A couchapp használatáról elsőkézből magától az alkalmazástól kérhetünk
tájékozatatást:

    couchapp help

az eredmény:

    couchapp help
    couchapp [OPTIONS] [CMD] [OPTIONSCMD] [ARGS,...]
    usage:

    -d/--debug	 debug mode
    -h/--help	 display help and exit
    --version	 display version and exit
    -v/--verbose	 enable additionnal output
    -q/--quiet	 don't print any message

    list of commands:
    -----------------

    browse	 [COUCHAPPDIR] DEST

    clone	 [OPTION]...[-r REV] SOURCE [COUCHAPPDIR]
    -r/--rev [VAL]	 clone specific revision

    generate	 [OPTION]... [app|view,list,show,filter,function,vendor] [COUCHAPPDIR] NAME
    --template [VAL]	 template name

    help

        init	 [COUCHAPPDIR]

        push	 [OPTION]... [COUCHAPPDIR] DEST
        --no-atomic	 send attachments one by one
        --export	 don't do push, just export doc to stdout
        --output [VAL]	 if export is selected, output to the file
        -b/--browse	 open the couchapp in the browser
        --force	 force attachments sending
        --docid [VAL]	 set docid

        pushapps	 [OPTION]... SOURCE DEST
        --no-atomic	 send attachments one by one
        --export	 don't do push, just export doc to stdout
        --output [VAL]	 if export is selected, output to the file
        -b/--browse	 open the couchapp in the browser
        --force	 force attachments sending

        pushdocs	 [OPTION]... SOURCE DEST
        --no-atomic	 send attachments one by one
        --export	 don't do push, just export doc to stdout
        --output [VAL]	 if export is selected, output to the file
        -b/--browse	 open the couchapp in the browser
        --force	 force attachments sending

        vendor	 [OPTION]...[-f] install|update [COUCHAPPDIR] SOURCE
        -f/--force	 force install or update

        version


### Egy új alkalmazás generálása

Generáljunk egy új __appdev__ nevű alkalmazást:

    couchapp generate appdev

    2010-10-06 15:47:59 [INFO] /home/tombenke/sandbox/appdev generated.

A generált folder struktúra az alábbi lesz:

    .
    |-- _attachments
    |   `-- style
    |-- evently
    |   |-- items
    |   |   `-- _changes
    |   `-- profile
    |       `-- profileReady
    |           `-- selectors
    |               `-- form
    |-- lists
    |-- shows
    |-- updates
    |-- vendor
    |   `-- couchapp
    |       |-- _attachments
    |       |-- evently
    |       |   |-- account
    |       |   |   |-- adminParty
    |       |   |   |-- loggedIn
    |       |   |   |-- loggedOut
    |       |   |   |-- loginForm
    |       |   |   |   `-- selectors
    |       |   |   |       `-- form
    |       |   |   `-- signupForm
    |       |   |       `-- selectors
    |       |   |           `-- form
    |       |   `-- profile
    |       |       |-- loggedOut
    |       |       |-- noProfile
    |       |       |   `-- selectors
    |       |       |       `-- form
    |       |       `-- profileReady
    |       `-- lib
    `-- views
        `-- recent-items

### Létező alkalmazás klónozása

    couchapp clone http://localhost:5984/contacts/_design/contacts

### Alkalmazás feltöltése a serverre (deployment)

    couchapp push http://admin:admin@localhost:5984/contacts

