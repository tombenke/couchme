
    http://almafa.couchone.com/marketa/_design/marketa/_list/VIR/users

Ha az "Accept: text/html" Header változót állítják be a HTTP kliensen, akkor HTML-lel tér vissza, ha "Accept: text/xml"-t, akkor XML-lel.
Figyelem! A böngésző alapértelmezésben HTML-t kér, ezért ezt egy dedikált klienssel lehet megnézni, pl az alábbiak szerint:

    curl -X GET http://almafa.couchone.com/marketa/_design/marketa/_list/VIR/users -H "Accept: text/xml"

Az alábbiaknál nem kell beállítani (csak HTML-t, és csak XML-t szolgáltatnak):

    http://almafa.couchone.com/marketa/_design/marketa/_list/basicHTML/users
    http://almafa.couchone.com/marketa/_design/marketa/_list/basicXML/users


A list-beli függvény két paramétere az alábbihoz hasonló adatszerkezettel
rendelkezik:

    var head = {
        "total_rows":1,
        "offset":0,
        "update_seq":15
    };

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
