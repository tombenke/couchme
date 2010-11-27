Web-es alkalmazások fejlesztése CouchDB-vel
===========================================

Az itt olvasható rövid írásokkal abban próbálok segíteni,
hogy az első lépéseket megtegyük a [CouchDB][]-vel,
és [CouchApp][]-pal történő web-es alkalmazások fejlesztésében.

Voltaképpen azokat az ismereteket próbálom áttekinthető,
visszakereshető formába rendezni, amelyeket a CouchDBvel
való munka során összegyűjtök.

Az egyes fejezetek egy-egy témakört foglalnak össze, gyakorlatias megközelítéssel.
Igyekeztem úgy megírni őket, hogy bevezető tananyagként, és szakácskönyvként
egyaránt használni lehessen azokat.

Eddig az alábbi fejezetek készültek el:

* [Bevezetés](intro.html)  
  Röviden áttekinti, hogy mi is a CouchDB.

* [Installálás](install.html)  
  A fejlesztéshez szükséges eszközöket ismerteti,
  és azt, hogy, hogyan kell installálnunk azokat.

* [Adatfeltöltés](dataUpload.html)  
  Egyedi dokumentumok, és tömeges adatok feltöltése adatbázisba.

* [Lekérdezések](views.html)  
  Adatbázis lekérdezések készítése.

* [Lekérdezési receptek](view_snippets.html)  
  Kód részletek, minták tipikus lekérdezési feladatokhoz.

* [Egyedi dokumentumok megjelenítése](shows.html)  
  Statikus és dinamikus oldalak server oldali előállítása dokumentumokból
  és statikus tartalom elemekből.

* [Listák megjelenítése](lists.html)  
  Eredménylisták előállítása lekérdezések eredményéből.

* [Aktív megjelenítő komponensek készítése](widgets.html)  
  Böngésző oldali, kiterjesztett jQuery alapú eseménykezelés,
  adatkezelés és megjelenítés.

* [Widget receptek](http://tombenke.couchone.com/widgets/_design/widgets/index.html)  
  Példák aktív megjelenítő komponensek készítésére.

A fenti fejezetekhez kapcsolódó egyéb anyagok:

* [Letöltések](downloads.html)  
  Letölthető mintapéldák

* [Linkek](resources.html)  
  Hasznos linkek és egyéb forrásanyagok gyűjteménye


## Mire lesz szükségünk?

Ahhoz, hogy az itt leírtakat reprodukáljuk, néhány előfeltételnek
teljesülnie kell. A minta programok és végrehajtott parancsok
_Ubuntu 10.04_ rendszeren, _CouchDB 1.0.1_ serverrel és _CouchApp 0.7.0_
segédprogrammal lettek létrehozva, ill. végrehajtva.

A következő eszközöket fogjuk még ezen felül használni:

* _Python 2.6.4_ futtató környezet
* __curl__ parancs-sori HTTP kliens alkalmazás
* web böngésző (Firefox, Chromium, stb.)

## A legjobb dokumentáció a forráskód

A felinstallált couchdb directoryja alatt megtalálható a forráskód.

Ha mintára van szükségünk, ami biztosan működik,
és kompatibilis az aktuálisan felinstallált verzióval,
akkor tanulmányozzuk a forrás file-okat az alábbi helyen:

    $COUCHDB\_HOME/share/couchdb/www/scripts/*.js
    $COUCHDB\_HOME/share/couchdb/www/scripts/test/*.js

A $COUCHDB\_HOME Ubuntu-n pl a következő lehet: /opt/couchdb-1.0.1


## Kapcsolat

Szeretném, ha az erőfeszítéseim valóban használható eredményt hoznának,
ezért azt kérem a tisztelt olvasótól, hogy észrevételeit, javaslatait és a
cikkekben fellelt hibákat, küldje el nekem a
<mailto:tombenke@gmail.com> e-mail címre.
