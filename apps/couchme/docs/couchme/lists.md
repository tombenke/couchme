Listakészítés
=============

## Ismerkedés a list függvényekkel

A list funkciók nagyon hasonlítanak a show függvényekre.
A feladatuk az, hogy egy kiválasztott view által visszaadott eredménylistát
a kliens számára megfelelőre formázva állítsanak elő.

Ezt a művelet a show függvényekhez hasonlóan server oldalon hajtódik végre.

A list függvény hívásakor mindenképpen azonosítanunk kell a view-t, szemben a
show-val, ahol a dokumentum megadása opcionális.

A visszaadott végeredmény itt is különféle tartalom típus lehet.

A list URL mintázata a következő:

    /{db-name}/{design-doc-name}/_list/{list-name}/{view-name}

Ahol a __{list-name}__ megegyezik a JavaScript file nevével, ami a megjelenítő funkciót
tartalmazza. A __{view-name}__ megadása kötelező.

Egy érvényes list URL-re mutat példát az alábbi kódrészlet:

    /cogito/_design/cogito/_list/json/projects

Ahhoz, hogy erre az URL-re válaszoljon a server, a design dokumentum alatt
egy \_list nevű directory-ban, létre kell hoznunk egy json.js nevű file-t.

Ennek a file-nak a tartalma egyetlen függvény lesz, aminek a mintázata a következő:

    function( head, req )
    {
        var listgen = require( "vendor/droids/lib/listgen" );

        listgen.to_json( head, req );
    }

A __head__ paraméter tartalmazza a view által visszaadott eredménylistát:

    var head = {
        "total_rows":1,
        "offset":0,
        "update_seq":15
    };

A __req__ paraméter a HTTP request paramétereit adja át a függvénynek:

    var req = {
        "info": {
            "db_name":"cogito",
            "doc_count":6,
            "doc_del_count":0,
            "update_seq":15,
            "purge_seq":0,
            "compact_running":false,
            "disk_size":979033,
            "instance_start_time":"1287590666651113",
            "disk_format_version":5,
            "committed_update_seq":15
        },
        "id":null,
        "uuid":"7c007ce47cefb6ab501469886800a888",
        "method":"GET",
        "path":["cogito","_design","actions","_list","json","all"],
        "query":{},
        "headers":{
            "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Charset":"ISO-8859-2,utf-8;q=0.7,*;q=0.7",
            "Accept-Encoding":"gzip,deflate",
            "Accept-Language":"en-us,en;q=0.5",
            "Connection":"keep-alive",
            "Cookie":"GLog=%7B%0D%20%20%20%20left%3A43%2C%20%0D%20%20%20%20top%3A47%2C%20%0D%20%20%20%20width%3A916%2C%20%0D%20%20%20%20height%3A480%2C%20%0D%20%20%20%20priorityDefaults%3A%7B%0D%20%20%20%20%20%20%20%20Log%3A4%0D%20%20%20%20%7D%2C%20%0D%20%20%20%20defaultPriority%3A3%2C%20%0D%20%20%20%20trackRPC%3Anull%0D%7D; SaveStateCookie=root",
            "Host":"localhost:5984",
            "If-None-Match":"\"2N0X8P4FZ4BMJFDFR2LYJ4ZCQ\"",
            "Keep-Alive":"115",
            "User-Agent":"Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.10) Gecko/20100915 Ubuntu/9.10 (karmic) Firefox/3.6.10 GTB7.1"
        },
        "body":"undefined",
        "peer":"127.0.0.1",
        "form":{},
        "cookie":{
            "GLog":"%7B%0D%20%20%20%20left%3A43%2C%20%0D%20%20%20%20top%3A47%2C%20%0D%20%20%20%20width%3A916%2C%20%0D%20%20%20%20height%3A480%2C%20%0D%20%20%20%20priorityDefaults%3A%7B%0D%20%20%20%20%20%20%20%20Log%3A4%0D%20%20%20%20%7D%2C%20%0D%20%20%20%20defaultPriority%3A3%2C%20%0D%20%20%20%20trackRPC%3Anull%0D%7D",
            "SaveStateCookie":"root"
        },
        "userCtx":{
            "db":"cogito",
            "name":null,
            "roles":[]
        }
    };

    var rows = [
    {
        "id":"tombenke",
        "key":null,
        "value":{
            "_id":"tombenke",
            "_rev":"1-d66f461a971479cbbf0c1cac942372bc",
            "type":"user",
            "familyName":"Benke",
            "surName":"Tamás",
            "company":"LSYH",
            "taxIdNumber":"15446385-213",
            "city":"Verőce",
            "zipCode":"2621",
            "street":"Dévai u.",
            "number":"8",
            "mobile":"+36703175024",
            "phone":"+3618824802",
            "fax":"+3618824977",
            "email":"tombenke@gmail.com",
            "web":"http://tombenke.ath.cx",
            "dateOfBirth":"1963-04-19"
        }
    }];


A függvény visszatérő értéke jelenik meg a kliens felé továbbított reprezentációként.
Például az alábbi kódrészlet egy JSON formátumú üzenettel fog visszatérni:

    function( head, req )
    {
        start({
            "headers" : {
                "Content-Type" : "application/json"
            }
        });
        send( '{"head":' + toJSON( head ) + ', ' );
        send( '"req":' + toJSON( req )+', ' );
        send( '"rows":[' );
        var row, sep = '\n';
        while( row = getRow() )
        {
            send( sep + toJSON( row ) );
            sep = ', \n';
        }
        return "]}";
    }


Például a fentebb példakét említett lekérdezés URL-je:

    http://localhost:5984//cogito/_design/cogito/_list/json/projects

Az eredmény:

    {"head":{"total_rows":3,"offset":0,"update_seq":43}, "req":{"info":{"db_name":"cogito","doc_count":6,"doc_del_count":0,"update_seq":43,"purge_seq":0,"compact_running":false,"disk_size":5161049,"instance_start_time":"1290804375904338","disk_format_version":5,"committed_update_seq":43},"id":null,"uuid":"22956cb61ab2d65b04d61be48c0000b9","method":"GET","path":["cogito","_design","cogito","_list","json","projects"],"query":{},"headers":{"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8","Accept-Charset":"ISO-8859-1,utf-8;q=0.7,*;q=0.7","Accept-Encoding":"gzip,deflate","Accept-Language":"en-us,en;q=0.5","Connection":"keep-alive","Cookie":"AuthSession=a2VydGVzejo0Q0U5MzM0QjrY7aX62VBIdraS7goCZt-j2Vh2Tg","Host":"localhost:5984","Keep-Alive":"115","User-Agent":"Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.12) Gecko/20101027 Ubuntu/10.04 (lucid) Firefox/3.6.12"},"body":"undefined","peer":"127.0.0.1","form":{},"cookie":{"AuthSession":"a2VydGVzejo0Q0U5MzM0QjrY7aX62VBIdraS7goCZt-j2Vh2Tg"},"userCtx":{"db":"cogito","name":null,"roles":[]}}, "rows":[
    {"id":"cogito","key":null,"value":{"_id":"cogito","_rev":"1-b18ec420bfcd56b362fbb2d9c8447988","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-10-20","started":"","deadline":"2010-12-15","summary":"cogito GTD-like web application","details":"Develop a web based application with CouchDB","tags":["project","GTD"]}},


## Tartalom-típus egyeztetés

Az alábbi kódrészlet kétféle tartalom típust képes visszaadni: HTML-t és XML-t.

    function()
    {
        provides('html',function(){

            send( '<html><body><div id="users" xmlns="http://www.cogito.org/1.0/users">' );

            send('<ul>');
            while( row = getRow() )
            {
                send('<li>');

                send( '<span class="_id">_id : "' + row.value._id + '"</span></br>');
                send( '<span class="_id">_rev : "' + row.value._rev + '"</span></br>');
                send( '<span class="_id">type : "' + row.value.type + '"</span></br>');

                send( '<span class="_id">familyName : "' + row.value.familyName + '"</span></br>');
                send( '<span class="_id">surName : "' + row.value.surName + '"</span></br>');
                send( '<span class="_id">company : "' + row.value.company + '"</span></br>');

                /* Other entries ... */

                send( '</li>' );
            }
            send( '</ul>' );
            return "</div></body></html>";
        });

        provides('xml',function(){
            send( '<users xmlns="http://www.cogito.org/1.0/users">' );

            while( row = getRow() )
            {
                var entry = new XML( '<user/>' );

                entry._id = row.value._id;
                entry._rev = row.value._rev;
                entry.type = row.value.type;

                entry.familyName = row.value.familyName;
                entry.surName = row.value.surName;

                /* Other entries ... */

                send( entry );
            }
            return "</users>";
        })
    }


Hogy adott esetben melyik formátum fog létrejönni, azt a kérésben, a kliens által
megadott _"Accept:"_ header paraméter fogja meghatározni.

Ha az _"Accept: text/html"_ Header változót állítják be a HTTP kliensen,
akkor HTML-lel tér vissza, ha _"Accept: text/xml"_-t, akkor XML-lel.

Figyelem! A böngésző alapértelmezésben HTML-t kér,
ezért ezt egy dedikált klienssel lehet megnézni, pl az alábbiak szerint:

    curl -X GET http:///_list/http://localhost:5984//cogito/_design/cogito/_list/contacts/contacts -H "Accept: text/xml"

<!-- TODO: Működő példa programot írni a cogito-ba -->

Az ilyen fajta megoldások alkalmasak arra például, hogy az adatbázisunkat lekérdezhetővé
tegyük más rendszerek számára, RESTful felületen keresztül.
