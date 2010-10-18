
    http://almafa.couchone.com/marketa/_design/marketa/_list/VIR/users

Ha az "Accept: text/html" Header változót állítják be a HTTP kliensen, akkor HTML-lel tér vissza, ha "Accept: text/xml"-t, akkor XML-lel.
Figyelem! A böngésző alapértelmezésben HTML-t kér, ezért ezt egy dedikált klienssel lehet megnézni, pl az alábbiak szerint:

    curl -X GET http://almafa.couchone.com/marketa/_design/marketa/_list/VIR/users -H "Accept: text/xml"

Az alábbiaknál nem kell beállítani (csak HTML-t, és csak XML-t szolgáltatnak):

    http://almafa.couchone.com/marketa/_design/marketa/_list/basicHTML/users
    http://almafa.couchone.com/marketa/_design/marketa/_list/basicXML/users