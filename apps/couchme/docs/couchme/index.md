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

## Kapcsolat

Szeretném, ha az erőfeszítéseim valóban használható eredményt hoznának,
ezért azt kérem a tisztelt olvasótól, hogy észrevételeit, javaslatait és a
cikkekben fellelt hibákat, küldje el nekem a
<mailto:tombenke@gmail.com> e-mail címre.
