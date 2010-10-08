Mi a CouchDB?
=============

## CouchDB címszavakban

Az [Apache CouchDB][CouchDB] egy dokumentum orientált adatbáziskezelő, melyet
egy robusztus, funkcionális programozási nyelven, [Erlang][]-ban írtak.
Ez a nyelv ideális konkurrens, elosztott rendszerek fejlesztésére.

A CouchDB egy úgynevezett [NoSQL][] adatbáziskezelő.
A [NoSQL][] (Not only SQL) kifejezés többféle dolgot takar. Definíciójáról,
és az ilyen elveken működő adatbáziskezelők listájáról bővebb információ
a [NoSQL][] oldalon található.

A CouchDB inkrementális replikációs mechanizmust és kétirányú konfliktus
detektálási és feloldási mechanizmust biztosít.

Az adatbázisok [MapReduce][] elven indexelhetőek és kérdezhetők le JavaScript
alkalmazásával.

Az adatbáziskezelő server [RESTful][] [JSON][] API-t nyújt,
amely bármely környezetből hozzáférhető, és képes HTTP kéréseket kiszolgálni.
Ezt kliens oldalról számtalan programozási nyelv támogatja saját
könyvtárakkal.

A CouchDB-hez akár akár egy web böngészővel is közvetlenül kapcsolódhatunk.
Sőt ezt megtehetjük egy egyszerű, parancssori segédprogrammal,
mint amilyen például a __curl__.

A CouchDB beépített web es adminisztrációs felületet biztosít, ami
a böngészőben futva, HTTP kéréseket küldve, közvetlenül az adatbáziskezelővel
kommunikál.

a CouchDB-n tárolt adatbázisok egy web-server-en keresztül HTTP protokollal
érhetők el, és [JSON][] formátumú dokumentumokat tárolnak, melyek mindegyike
egyedi azonosítóval (kulccsal) rendelkezik.

## CouchDB egy lépéssel közelebbről nézve

### Adatbázisok

A dokumentumok adatbázisokban foglalnak helyet, amelyeknek ugyancsak egyedi
azonosítójuk van és egy URL-en keresztül érhetőek el.
Például a lokális server-en futó CouchDB-ben
tárolt __contacts__ adatbázis URL-je az alábbi:

    http://localhost:5984/contacts/

### Dokumentumok

A CouchDB egy web-server, amelyben JSON dokumentumokat tárolhatunk.

A dokumentumok az egyedi azonosítójuk segítségével,
ugyancsak URL-en keresztül érhetőek el.
Például a __tombenke__ azonosítójú dokumentum URL-je az alábbi lehet:

    http://localhost:5984/contacts/tombenke

A dokumentum azonosítók "case-sensitive" stringek, amelyek egyedileg azonosítják
a dokumentumot. Két különböző dokumentum nem használhatja ugyanazt az azonosítót.
Amennyiben az azonosítók megegyeznek, akkor a két dokumentum azonosnak tekintendő.

A dokumentum azonosítók elvileg tetszőleges stringek lehetnek,
de az egyszerűbb URL kódolás/dekódolás érdekében célszerű a speciális
karaktereket mellőzni.

Az "\_" karakterrel kezdődő azonosítók speciális dokumentumra utalnak.
Ezekből kétféle típus létezik:

* "\_design/" kezdetűek az úgynevezett design dokumentumok. Ezekben tárolja
  az adatbáziskezelő például a web-es alkalmazásokat, programokat.
  Ezeket külön fejezetekben részletesen tárgyaljuk, mivel fő célunk az volt,
  hogy az ilyenfajta dokumentumok létrehozását bemutassuk.

* "\_local/" lokális dokumentumra utal. Ezek nem kerülnek replikációra.

A dokumentum azonosítókban, azok részeként, használhatjuk a "/" karaktert is,
de ügyeljünk rá, hogy amikor egy URL-be kódolva hivatkozunk a dokumentumra,
akkor ezt a karaktert is megfelelően kódolnunk kell %2F-re.

Ezalól egy speciális kivétel van, a "\_design/" kezdetű úgynevezett
design dokumentumok azonosítója.
Ez használhatja mindkét formát az URL-ekben, de ajánlott, hogy
az első "/" karakter, ami a "\_design" szót követi az maga a "/"-jel legyen, a
továbbiak pedig a %2F kódolással kerüljenek be az URL-be kódolt id-be.

A dokumentumok tetszőleges, szabályos JSON struktúrát tartalmazhatnak.
Továbbá bármi egyebet, ami úgymond JSON-osítható.

Ennek megfelelően bináris dokumentumok is létrehozhatók, sőt, a CouchDB-ben,
server oldalon futtatott alkalmazások, és statikus tartalmak (HTML, CSS, jpeg, stb.)
is mind dokumentumokként vannak tárolva.

Egy ilyen dokumentumra mutat példát az alábbi kódrészlet:

    {
       "_id": "tombenke",
       "_rev": "8-3e233c0978218ceef5a4a899a31ca1f5",
       "firstName": "Tam\u00e1s",
       "lastName": "Benke",
       "email": "tombenke@gmail.com",
       "phone": "+36 1 9999-999",
       "country": "Hungary",
       "name": "Tam\u00e1s Benke",
       "age": 47,
       "_attachments": {
           "PICT0894.JPG": {
               "content_type": "image/jpeg",
               "revpos": 5,
               "length": 635558,
               "stub": true
           },
           "PICT0899.JPG": {
               "content_type": "image/jpeg",
               "revpos": 4,
               "length": 656730,
               "stub": true
           }
       }
    }

Jól látható, hogy a fenti kódrészlet egy szabályos JSON adatstruktúra.
Mindőssze annyi megkötöttség van hogy az adatstruktúra legmagasabb szintjén
lévő "\_" karakterrel kezdődő mező nevek továbbá a dokumentum nevek a CouchDB
számára vannak fenntartva, és speciális jelentésük lehet.

Két mező minden dokumentum esetében létezik, ezek az __\_id__ , és a __\_rev__ .

Az ___id__ az egyedi azonosító, melyet vagy maga az adatbáziskezelő generál a
dokumentum szmára a létrehozáskor (POST során), vagy a kliens adhat meg (PUT metódussal).

A __\_rev__ a dokumentum verziószáma, amely folyamatosan, automatikusan változik,
ahogy a dokumentum módosításra kerül. A verzionálás teszi lehetővé, hogy az adatbázis
lekérdezése, és módosítása egyidejűleg, lockolás-mentesen végrehajtható legyen,
továbbá azt, hogy az adatbázis tartalom replikációja, szinkronizálása
konzisztensen végrehajtható legyen.

A minta tartalmaz még egy további speciális mezőt __\_attachments__ névvel.
Ebben speciális (pl.: bináris) tartalmakat, képeket, stb. tárolhatunk.

A dokumentumok az alábbi speciális ("\_" karakterrel kezdődő nevű)
mezőkkel rendelkezhetnek:

<table>
<thead><tr><th>Mezőnév</th><th>Leírás</th></tr></thead>
<tbody>
<tr><th>_id</th><td>A dokumentum egyedi azonosítója (kötelező, nem módosítható)</td></tr>
<tr><th>_rev</th><td>Az aktuális MVCC-token/revision száma (kötelező, nem módosítható)</td></tr>
<tr><th>_attachments</th><td>Ha a dokumentumnak vannak csatolmányai, akkor ez a mező meta információkat hordozó adatstrutúrákat tartalmaz azokra vonatkozóan</td></tr>
<tr><th>_deleted</th><td>Jelzi, hogy ez a dokumentum törlésre lett kijelölve,
és a soron következő "compaction" művelet során véglegesen törlésre kerül.</td></tr>
<tr><th>_revisions</th><td>Amennyiben a dokumentumot a ?revs=true paraméterekkel kérdeztük le,
 akkor a dokumentum történetét adja vissza egy egyszerű lista formájában.</td></tr>
<tr><th>_revs_info</th><td>Hasonló a _revisions mezőhöz, és a régebbi verziók rendelkezésre állásáról szolgáltat információt.</td></tr>
<tr><th>_conflicts</th><td>Információ a konfliktusokról</td></tr>
<tr><th>_deleted_conflicts</th><td>Információ a konfliktusokról</td></tr>
</tbody>
</table>

A dokumentumokról és az adatbázisokról bővebben a [HTTP_Document_API][] wiki
oldalon olvashatunk.

### REST API

A CouchDB valójában nem más, mint egy JSON dokumentum repository, melyet
egy REST API-n keresztül tudunk elérni.

A REST API az alapvető adatbázis CRUD műveleteket nyújtja HTTP method-ok
formájában az alábbiak szerint:

                    CRUD művelet       HTTP method
                    ------------       -----------
                      Create     <-->     POST
                      Retrieve   <-->     GET
                      Update     <-->     PUT
                      Delete     <-->     DELETE

Tegyük fel, hogy egy azonosító nélküli (__\_id__ mezőt nem tartalmazó)
dokumentum létre lett hozva egy __tombenke\_without\_id.json__
nevű file-ban. Ezt a következő paranccsal tölthetjük fel az adatbázisba:

    curl -X POST http://localhost:5984/contacts \
         -d@tombenke_without_id.json \
         -H "Content-type: application/json"

A server válasza:

    {
        "ok":true,
        "id":"5fba9edd70b5b718d4bbfcb62b0010d0",
        "rev":"1-e619675825cff38fa01741f2b09bf7d2"
    }

Ez azt jelenti, hogy a server kiosztott a dokumentum számára egy egyedi azonosítót,
és egy kezdeti verziószámot.

A példában látható, hogy az URL-ben csak az adatbázis nevét adtuk meg, a
dokumentum azonosítóját nem.

Ha azt szeretnénk, hogy mi adhassuk meg az azonosítót is, akkor a dokumentumnak
tartalmaznia kell az __\_id__ és a __\_rev__ mezőket is. Továbbá a PUT parancsot
kell használnunk, és meg kell adnunk az URL-ben a dokumentum azonosítóját is.

Tegyük fel, hogy a __tombenke__ azonosítójú dokumentum egy __tombenke.json__
nevű file-ban található (id-vel és revision számmal együtt).
Ezt a következő paranccsal tölthetjük fel az adatbázisba:

    curl -X PUT http://localhost:5984/contacts/tombenke -d@tombenke.json

Siker esetén, a válasz a következő lesz:

    {"ok":true,"id":"tombenke","rev":"9-a188fafe83c851371a1a28c100213cbe"}


Ugyanezzel a paranccsal módosíthatunk egy már, az adatbázisban meglévő dokumentumot.

Az előző példából láthatjuk, hogy a dokumentum azonosítója ugyanaz maradt,
de a verziószám első számjegyéből látszik, hogy az megváltozott, vagyis korábban volt
már egy 8-as verzió, ami most 9-esre módosult.

Ha egy dokumentumot szeretnénk lekérdezni a serverről, akkor azt a GET metódussal
tehetjük meg, mint az az alábbi parancsból látszik:

    curl -X GET http://localhost:5984/contacts/tombenke

az eredményt rövidítve ábrázoljuk:

    {"_id":"tombenke","_rev":"8-3e233c0978218ceef5a4a899a31ca1f5", ... }

Ugyanezt a dokumentumot a következőképpen törölhetjük:

    curl -X DELETE http://localhost:5984/contacts/tombenke


### A CouchDB alkalmazások architektúrája

Az alkalmazások alapesetben két rétegből állnak:


        Client: Browser (UI HTML tartalom és linkek az oldalak között)
    -------------------------------- HTTP ---------------------------------
     Server: CouchDB (perzisztencia, üzleti logika, template-mechanizmus)


A Server, ahogy azt az előző pontban röviden említettük, egy web server, ami
REST API-n keresztül elérhető JSON dokumentum tárként működik.

A kliens oldalon egy szabványos HTTP kliens helyezkedik el.
Ez lehet egy böngésző motor, de lehet egy tetszőleges nyelven megírt,
célorientált HTTP kliens program, vagy egy utility, amivel HTTP kéréseket tudunk
végrehajtani.

Ha böngészőről beszélünk, akkor egyszerűbb esetben a böngészőben
hagyományos statikus HTML tartalmat képzeljünk el,
természetesen CSS-sel és JavaScript-tel kiegészítve.

Ha ki akarjuk használni a [CouchDB][] teljes funkcionalitását,
akkor a megjelenítő rétegben aktív komponenseket is kell alkalmaznunk.

A kliens Ajax-os hívásokkal tudja megszólítani a servert.
Ez legkényelmesebben [jQuery][] plugin-ok formájában valósítható meg.
A CouchDB saját plugin-ekkel és kiegészítő modulokkal támogatja a fejlesztőket.
Ezek használatát később részletesen tárgyaljuk.
