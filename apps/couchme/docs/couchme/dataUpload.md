Adatok feltöltése adatbázisba
=============================

Ebben a fejezetben azt tárgyaljuk, hogyan lehet egyszerűen feltölteni adatokkal
egy adatbázist, például törzsadatok felvitele, vagy teszt-adatbázis előállítása céljából.

## Adatok feltöltése

1. Előszőr létrehozunk egy adatbázist, majd
2. feltöltjük egyedi dokumentumokkal
   (az azonosítókat az adatbáziskezelő rendeli hozzá a dokumentumokhoz).

Az itt bemutatott adatfile-ok és scriptek megtalálhatóak a
[contacts.zip](downloads/contacts.zip) file-ban.

Ha kibontjuk a file-t, akkor találunk benne egy __data__ nevű aldirectory-t,
amiben a feltöltendő dokumentumok vannak JSON formátumban:

    contacts/data
    |-- charlesb.json
    |-- emma.json
    |-- ericq.json
    |-- jsmith.json
    |-- jthomas.json
    `-- uploadData.sh

A __charlesb.json__ file tartalma például a következő:

    {
        "name": "Charles Bing",
        "age": 43,
        "country": "USA",
        "phone": "555-821345",
        "email": "charlesb@exmaple.com"
    }

Ugyancsak a __data__ directoryban találjuk az __uploadData.sh__ bash scriptet
ami feltölti az összes _json_ kiterjesztésű file-t az adatbázisba:

    #!/bin/bash

    declare -rx SERVER_URL=http://localhost:5984
    declare -rx DATABASE=contacts

    for datafile in *.json
    do
        curl -X POST \
             -d @$datafile \
             -H "Content-type: application/json" \
             "$SERVER_URL/$DATABASE"
    done

Figyeljük meg, hogy a script a __curl__ parancs használatakor a __POST__ metódust
alkalmazza. Ebben az esetben az adatbáziskezelő létrehoz egy új dokumentumot
a feltöltött tartalommal, és hozzárendel egy egyedi azonosítót.

Az egyedi azonosító egy úgynevezett UUID vagy más néven GUID.
A rövidítések az angol "Universally (Globally) Unique IDentifier" kifejezésnek
a megfelelői.

Véletlenszerűen generált azonosítók, melyek ismétlődési valószínűsége
gyakorlatilag elhanyagolható a dokumentumok létrehozási gyakoriságához viszonyítva.

Ha többször egymás után végrehajtjuk a parancsot, akkor a dokumentumok,
ugyanazon tartalommal, de különböző azonosítókkal, több példányban létre fognak jönni.

Mielőtt a feltöltést végrehajtanánk, ellenőrizzük,
hogy létezik-e már __contacts__ nevű adatbázis:

    curl -X GET http://localhost:5984/contacts

Ha még nincs, akkor a következő üzenetet kapjuk:

    {"error":"not_found","reason":"no_db_file"}


Hozzuk létre az adatbázist:

    curl -X PUT http://localhost:5984/contacts

Ha korábban beállítottuk, hogy csak authorizált userek hajthassanak végre
adatbázis létrehozást, akkor az alábbi hibaüzenetet kapjuk:

    {"error":"unauthorized","reason":"You are not a server admin."}

Hogy miként lehet az authorizációt beállítani, azt egy
[külön fejezetben](authorization.html) tárgyaljuk.

Ha a műveletet csak az __admin__ user hajthatja végre, akkor
(feltéve, hogy a jelszó _adminpwd_) az alábbi parancsot kell végrehajtanunk:

    curl -X PUT http://admin:adminpwd@localhost:5984/contacts

A sikeres végrehajtást a következő válasz jelzi:

    {"ok":true}

Ezek után feltölthetjük a dokumentumokat a bash script elindításával:

    ./uploadData.sh

Az eredmény a következő:

    {"ok":true,"id":"5fba9edd70b5b718d4bbfcb62b00c76b","rev":"1-4e2fc63dee5ccbab9850d5e77e6f7afa"}
    {"ok":true,"id":"5fba9edd70b5b718d4bbfcb62b00d022","rev":"1-1f87adcd58afa900d8082b2f796f4f44"}
    {"ok":true,"id":"5fba9edd70b5b718d4bbfcb62b00de63","rev":"1-c70e670073125c53aae0109d727eb368"}
    {"ok":true,"id":"5fba9edd70b5b718d4bbfcb62b00ecc5","rev":"1-91bd3e132e9f378568df697db8a68804"}
    {"ok":true,"id":"5fba9edd70b5b718d4bbfcb62b00f3d3","rev":"1-8010f0b12b720288fe180db488827aec"}

Ellenőrzésképpen kérdezzük le most ismét az adatbázis URL-jét GET művelettel:

    curl -X GET http://localhost:5984/contacts

Eredményként a következőt kapjuk:

    {
        "db_name":"contacts",
        "doc_count":5,
        "doc_del_count":0,
        "update_seq":5,
        "purge_seq":0,
        "compact_running":false,
        "disk_size":4185,
        "instance_start_time":"1286356445951353",
        "disk_format_version":5,
        "committed_update_seq":5
    }

Ha a _Futon_-nal megtekintjük az adatbázis tartalmát, akkor láthatjuk, hogy
a dokumentumok, a server által generált __\_id__-kkel létre lettek hozva.

![A contacts adatbázisban létrehozott dokumentumok listája](images/contacts1.png "A contacts adatbázisban létrehozott dokumentumok listája")

Ha beletekintünk a létrehozott dokumentumba, akkor láthatjuk benne a server által
hozzárendelt kötelező mezőket (__\_id__, és __\_rev__):

    {
       "_id": "5fba9edd70b5b718d4bbfcb62b00c76b",
       "_rev": "1-4e2fc63dee5ccbab9850d5e77e6f7afa",
       "name": "Charles Bing",
       "age": 43,
       "country": "USA",
       "phone": "555-821345",
       "email": "charlesb@exmaple.com"
    }

## Meglévő dokumentum módosítása

Készítsünk most a __charlesb.json__ dokumentumról egy másolatot

__charlesb.update__ néven, és módosítsuk annak tartalmát az alábbiak szerint:

    {
       "_id": "5fba9edd70b5b718d4bbfcb62b00c76b",
       "_rev": "1-4e2fc63dee5ccbab9850d5e77e6f7afa",
       "name": "Charles Bronson",
       "age": 75,
       "profession": "actor",
       "country": "USA",
       "phone": "555-821345",
       "email": "charlesb@exmaple.com"
    }

Látható, hogy az azonosító és a revision szám módosítatlan maradt,
de a _name_ és az _age_ mezők értéke megváltozott, továbbá hozzáadtunk egy
_profession_ mezőt.

Az ilymódon elkészített dokumentummal felülírhatjuk a korábban feltöltött változatot.
Ehhez a PUT metódust használjuk, továbbá az __\_id__-vel azonosítjuk,
hogy melyik dokumentumra hivatkozunk a __\_rev__-vel pedig, hogy annak melyik
változatát kívánjuk felülírni:

    curl -X PUT \
        -d@charlesb.update \
        -H "Content-type: application/json" \
         http://localhost:5984/contacts/5fba9edd70b5b718d4bbfcb62b00c76b

Sikeres esetben az alábbi választ kapjuk:

    {"ok":true,"id":"5fba9edd70b5b718d4bbfcb62b00c76b","rev":"2-0a109832b84939d574bd5174a43ffee6"}

Mindig a teljes dokumentumot kell megadnunk, vagyis nem lehet annak csak egy-egy
részét, vagy mezőjét felülírni.

Elenőrizzük most, hogy mi tárolódik az adatbázisban:

    curl -X GET http://localhost:5984/contacts/5fba9edd70b5b718d4bbfcb62b00c76b

Az eredmény (a jobb olvashatóság kedvéért formázva):

    {
       "_id": "5fba9edd70b5b718d4bbfcb62b00c76b",
       "_rev": "2-0a109832b84939d574bd5174a43ffee6",
       "name": "Charles Bronson",
       "age": 75,
       "profession": "actor",
       "country": "USA",
       "phone": "555-821345",
       "email": "charlesb@exmaple.com"
    }

A verziószám első számjegye 2-re változott.
Most már két verzió létezik a dokumentumból az adatbázisban.

## Tömeges adatfeltöltés és módosítás

A CouchDB lehetőséget biztosít arra, hogy ne csak egyenként, hanem egyszerre
tömeges méretekben lehessen feltölteni, illetve módosítani dokumentumokat.

Ha a CouchDB-től várjuk, hogy azonosítót rendeljen a dokumentumokhoz, akkor
az alábbi formátumot alkalmazzuk (bulk/contacts_without_id.json):

    {
      "docs": [
        {
            "name": "Charles Bing",
            "age": 43,
            "country": "USA",
            "phone": "555-821345",
            "email": "charlesb@exmaple.com"
        },
        {
            "name": "Emma Watson",
            "age": 33,
            "country": "Great Britain",
            "phone": "555-726531",
            "email": "emma@example.com",
            "fax": "555-726532"
        },
        {
            "name": "Eric Quinn",
            "age": 23,
            "country": "USA",
            "phone": "555-012796",
            "fax": "555-098245"
        },
        {
            "name": "John Smith",
            "age": 54,
            "country": "Australia",
            "phone": "55-372589",
            "email": "jsmith@example.com",
            "fax": "555-372590"
        },
        {
            "name": "Jane Thomas",
            "age": 14,
            "country": "USA",
            "phone": "555-210897",
            "email": "jthomas@example.com"
        }
      ]
    }

A feltöltést a __/{dbname}/\_bulk\_docs__ URI-re kell POST metódussal feltölteni:

    curl -X POST \
         -d @contacts_without_id.json \
         -H "Content-type: application/json" \
         http://admin:admin@localhost:5984/contacts/_bulk_docs

A válaszból látjuk, hogy a CouchDB azonosítókat rendelt a dokumentumokhoz:

    [{"id":"dd1c43608c7b07afd2c2a99f420002ce",
      "rev":"1-4e2fc63dee5ccbab9850d5e77e6f7afa"},
     {"id":"dd1c43608c7b07afd2c2a99f420010dd",
      "rev":"1-1f87adcd58afa900d8082b2f796f4f44"},
     {"id":"dd1c43608c7b07afd2c2a99f42001823",
      "rev":"1-c70e670073125c53aae0109d727eb368"},
     {"id":"dd1c43608c7b07afd2c2a99f42002130",
      "rev":"1-91bd3e132e9f378568df697db8a68804"},
     {"id":"dd1c43608c7b07afd2c2a99f420026c8",
      "rev":"1-8010f0b12b720288fe180db488827aec"}]

Ha a CouchDB-től várjuk, hogy azonosítót rendeljen a dokumentumokhoz, akkor
az alábbi formátumot alkalmazzuk (bulk/contacts_without_id.json):

    {
      "docs": [
        {
            "_id": "charlesb",
            "name": "Charles Bing",
            "age": 43,
            "country": "USA",
            "phone": "555-821345",
            "email": "charlesb@exmaple.com"
        },
        {
            "_id": "emma",
            "name": "Emma Watson",
            "age": 33,
            "country": "Great Britain",
            "phone": "555-726531",
            "email": "emma@example.com",
            "fax": "555-726532"
        },
        {
            "_id": "ericq",
            "name": "Eric Quinn",
            "age": 23,
            "country": "USA",
            "phone": "555-012796",
            "fax": "555-098245"
        },
        {
            "_id": "jsmith",
            "name": "John Smith",
            "age": 54,
            "country": "Australia",
            "phone": "55-372589",
            "email": "jsmith@example.com",
            "fax": "555-372590"
        },
        {
            "_id": "jthomas",
            "name": "Jane Thomas",
            "age": 14,
            "country": "USA",
            "phone": "555-210897",
            "email": "jthomas@example.com"
        }
      ]
    }

A feltöltéshez ugyanazt a parancsot használjuk, de értelemszerűen az
id-vel ellátott dokumentumokat tartalmazó file-lal ((bulk/contacts_with_id.json)):

    curl -X POST \
         -d @contacts_with_id.json \
         -H "Content-type: application/json" \
         http://admin:admin@localhost:5984/contacts/_bulk_docs


a válasz pedig a következő lesz:

    [{"id":"charlesb","rev":"1-4e2fc63dee5ccbab9850d5e77e6f7afa"},
     {"id":"emma","rev":"1-1f87adcd58afa900d8082b2f796f4f44"},
     {"id":"ericq","rev":"1-c70e670073125c53aae0109d727eb368"},
     {"id":"jsmith","rev":"1-91bd3e132e9f378568df697db8a68804"},
     {"id":"jthomas","rev":"1-8010f0b12b720288fe180db488827aec"}]

<!-- TODO

## Bulk / UPDATE

There are now two bulk update models supported:

    * non-atomic
     This is the default behavior.
     Some documents may successfully be saved and some may not.
     The response will tell the application which documents were saved or not.
     In the case of a power failure,
     when the database restarts some may have been saved and some not.

    * all-or-nothing
      To use this mode, include "all_or_nothing":true as part of the request.
      In the case of a power failure,
      when the database restarts either all the changes will have been saved
      or none of them. However,
      it does not do conflict checking,
      so the documents will be committed even if this creates conflicts.

## Bulk / DELETE

-->

A témával kapcsolatos további részletek a [HTTP_Bulk_Document_API][]
wiki oldalon találhatóak.
