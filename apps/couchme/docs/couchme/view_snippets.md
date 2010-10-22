View receptek
=============


## contact-ok listázása JSON formátumban

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


## Életkor lekérdezése contact dokumentumokból

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

## viewName

A _map()_ függvény:


A _reduce()_ függvény:


Lekérdezés:

    http://localhost:5984/contacts/_design/contacts/_view/...

Eredmény:

