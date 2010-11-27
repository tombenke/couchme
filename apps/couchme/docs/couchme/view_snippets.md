View receptek
=============

Tesztadatok a mintapéldákhoz:

    /* action dokumentumok: */

    { "docs": [
      {
        "type": "action",
        "_id": "action1",
        "owner": "tombenke",
        "assignedTo": "tombenke",
        "summary": "Create the cogito web application skeleton with initial data",
        "estimatedEffort": "100",
        "effortDimension": "hour",
        "created": "2010-10-20",
        "started": "2010-10-20",
        "finished": "",
        "status": "CREATED",
        "tags": ["task","GTD"]
      }
    ]
    }

    /* contact-ok */
    { "docs": [
      {
        "type": "user",
        "_id": "tombenke",
        "familyName": "Benke",
        "sureName": "Tamás",
        "company": "LSYH",
        "taxIdNumber": "15446385-213",
        "city": "Verőce",
        "zipCode": "2621",
        "street": "Dévai u.",
        "number": "8",
        "mobile": "+36703175024",
        "phone": "+3618824802",
        "fax": "+3618824977",
        "email": "tombenke@gmail.com",
        "web": "http://tombenke.ath.cx",
        "dateOfBirth": "1963-04-19"
      }
    ]
    }

    /* project-ek */
    { "docs": [
      {
        "type": "project",
        "_id": "cogito",
        "sponsor": "tombenke",
        "manager": "tombenke",
        "created": "2010-10-20",
        "started": "",
        "deadline": "2010-12-15",
        "summary": "cogito GTD-like web application",
        "details": "Develop a web based application with CouchDB",
        "tags": ["project","GTD"]
      },
      {
        "type": "project",
        "_id": "csvconv",
        "sponsor": "tombenke",
        "manager": "tombenke",
        "created": "2010-06-01",
        "started": "",
        "deadline": "2010-10-18",
        "summary": "CSV converter utility",
        "details": "Develop a utility to convert CSV files to XML and to JSON format",
        "tags": ["project","CouchDB","CSV"]
      },
      {
        "type": "project",
        "_id": "couchme",
        "sponsor": "tombenke",
        "manager": "tombenke",
        "created": "2010-09-15",
        "started": "",
        "deadline": "2010-12-23",
        "summary": "CouchMe how to use CouchDB",
        "details": "Readings about how to develop web applications with CouchDB and CouchApp",
        "tags": ["project","CouchDB","CouchApp"]
      }
    ]
    }

### Az összes project lekérdezése

A __map()__ függvény:

    function( doc )
    {
        if( doc.type == 'project' )
        {
            emit( null, doc );
        }
    };

A __reduce()__ függvény: &mdash;

URL: [http://localhost:5984/cogito/_design/cogito/_view/projects](http://localhost:5984/cogito/_design/cogito/_view/projects)

Eredmény:

    {"total_rows":3,"offset":0,"rows":[
    {"id":"cogito","key":null,"value":{"_id":"cogito","_rev":"1-b18ec420bfcd56b362fbb2d9c8447988","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-10-20","started":"","deadline":"2010-12-15","summary":"cogito GTD-like web application","details":"Develop a web based application with CouchDB","tags":["project","GTD"]}},
    {"id":"couchme","key":null,"value":{"_id":"couchme","_rev":"1-8b4cdf4d6e29d085fa8459ba4d8215a8","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-09-15","started":"","deadline":"2010-12-23","summary":"CouchMe how to use CouchDB","details":"Readings about how to develop web applications with CouchDB and CouchApp","tags":["project","CouchDB","CouchApp"]}},
    {"id":"csvconv","key":null,"value":{"_id":"csvconv","_rev":"1-42ff3cab63e789fef89cebd06a9a3e7e","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-06-01","started":"","deadline":"2010-10-18","summary":"CSV converter utility","details":"Develop a utility to convert CSV files to XML and to JSON format","tags":["project","CouchDB","CSV"]}}
    ]}


### Tag-ek száma összesen:

A __map()__ függvény:

    function( doc )
    {
        if( doc.tags )
        {
            doc.tags.forEach( function( tag )
            {
                emit( tag, 1 );
            });
        }
    }

A __reduce()__ függvény:

    function( keys, values )
    {
        return sum( values );
    }


#### Tag-ek száma összesen:

URL: [http://localhost:5984/cogito/_design/cogito/_view/tags](http://localhost:5984/cogito/_design/cogito/_view/tags)

Eredmény:

    {"rows":[
    {"key":null,"value":10}
    ]}

#### Tag-ek száma tag-enként:

URL: [http://localhost:5984/cogito/_design/cogito/_view/tags?group=true](http://localhost:5984/cogito/_design/cogito/_view/tags?group=true)

Eredmény:

    {"rows":[
    {"key":"CouchApp","value":1},
    {"key":"CouchDB","value":2},
    {"key":"CSV","value":1},
    {"key":"GTD","value":2},
    {"key":"project","value":3},
    {"key":"task","value":1}
    ]}


### Dokumentum(ok) lekérdezése Tag-ek alapján

A __map()__ függvény:

    function( doc )
    {
        if( doc.tags )
        {
            doc.tags.forEach( function( tag )
            {
                emit( tag, doc );
            });
        }
    }

A __reduce()__ függvény: &mdash;

#### Dokumentum(ok) lekérdezése egy adott Tag alapján:

URL [http://localhost:5984/cogito/_design/cogito/_view/docByTag?key=%22GTD%22](http://localhost:5984/cogito/_design/cogito/_view/docByTag?key=%22GTD%22)

Eredmény:

    {"total_rows":10,"offset":4,"rows":[
    {"id":"action1","key":"GTD","value":{"_id":"action1","_rev":"1-a1ba5bbc864ea8037b61770a6e6a8ade","type":"action","owner":"tombenke","assignedTo":"tombenke","summary":"Create the cogito web application skeleton with initial data","estimatedEffort":"100","effortDimension":"hour","created":"2010-10-20","started":"2010-10-20","finished":"","status":"CREATED","tags":["task","GTD"]}},
    {"id":"cogito","key":"GTD","value":{"_id":"cogito","_rev":"1-b18ec420bfcd56b362fbb2d9c8447988","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-10-20","started":"","deadline":"2010-12-15","summary":"cogito GTD-like web application","details":"Develop a web based application with CouchDB","tags":["project","GTD"]}}
    ]}


#### Dokumentum(ok) lekérdezése Tag-range alapján:

URL: [http://localhost:5984/cogito/_design/cogito/_view/docByTag?startkey="GTD"&endkey="project"](http://localhost:5984/cogito/_design/cogito/_view/docByTag?startkey="GTD"&endkey="project")

Eredmény:

    {"total_rows":10,"offset":4,"rows":[
    {"id":"action1","key":"GTD","value":{"_id":"action1","_rev":"1-a1ba5bbc864ea8037b61770a6e6a8ade","type":"action","owner":"tombenke","assignedTo":"tombenke","summary":"Create the cogito web application skeleton with initial data","estimatedEffort":"100","effortDimension":"hour","created":"2010-10-20","started":"2010-10-20","finished":"","status":"CREATED","tags":["task","GTD"]}},
    {"id":"cogito","key":"GTD","value":{"_id":"cogito","_rev":"1-b18ec420bfcd56b362fbb2d9c8447988","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-10-20","started":"","deadline":"2010-12-15","summary":"cogito GTD-like web application","details":"Develop a web based application with CouchDB","tags":["project","GTD"]}},
    {"id":"cogito","key":"project","value":{"_id":"cogito","_rev":"1-b18ec420bfcd56b362fbb2d9c8447988","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-10-20","started":"","deadline":"2010-12-15","summary":"cogito GTD-like web application","details":"Develop a web based application with CouchDB","tags":["project","GTD"]}},
    {"id":"couchme","key":"project","value":{"_id":"couchme","_rev":"1-8b4cdf4d6e29d085fa8459ba4d8215a8","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-09-15","started":"","deadline":"2010-12-23","summary":"CouchMe how to use CouchDB","details":"Readings about how to develop web applications with CouchDB and CouchApp","tags":["project","CouchDB","CouchApp"]}},
    {"id":"csvconv","key":"project","value":{"_id":"csvconv","_rev":"1-42ff3cab63e789fef89cebd06a9a3e7e","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-06-01","started":"","deadline":"2010-10-18","summary":"CSV converter utility","details":"Develop a utility to convert CSV files to XML and to JSON format","tags":["project","CouchDB","CSV"]}}
    ]}


### Összes dokumentum, amiben előfordul legalább egy tag:

URL: [http://localhost:5984/cogito/_design/cogito/_view/docByTag](http://localhost:5984/cogito/_design/cogito/_view/docByTag)

Eredmény:

    {"total_rows":10,"offset":0,"rows":[
    {"id":"couchme","key":"CouchApp","value":{"_id":"couchme","_rev":"1-8b4cdf4d6e29d085fa8459ba4d8215a8","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-09-15","started":"","deadline":"2010-12-23","summary":"CouchMe how to use CouchDB","details":"Readings about how to develop web applications with CouchDB and CouchApp","tags":["project","CouchDB","CouchApp"]}},
    {"id":"couchme","key":"CouchDB","value":{"_id":"couchme","_rev":"1-8b4cdf4d6e29d085fa8459ba4d8215a8","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-09-15","started":"","deadline":"2010-12-23","summary":"CouchMe how to use CouchDB","details":"Readings about how to develop web applications with CouchDB and CouchApp","tags":["project","CouchDB","CouchApp"]}},
    {"id":"csvconv","key":"CouchDB","value":{"_id":"csvconv","_rev":"1-42ff3cab63e789fef89cebd06a9a3e7e","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-06-01","started":"","deadline":"2010-10-18","summary":"CSV converter utility","details":"Develop a utility to convert CSV files to XML and to JSON format","tags":["project","CouchDB","CSV"]}},
    {"id":"csvconv","key":"CSV","value":{"_id":"csvconv","_rev":"1-42ff3cab63e789fef89cebd06a9a3e7e","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-06-01","started":"","deadline":"2010-10-18","summary":"CSV converter utility","details":"Develop a utility to convert CSV files to XML and to JSON format","tags":["project","CouchDB","CSV"]}},
    {"id":"action1","key":"GTD","value":{"_id":"action1","_rev":"1-a1ba5bbc864ea8037b61770a6e6a8ade","type":"action","owner":"tombenke","assignedTo":"tombenke","summary":"Create the cogito web application skeleton with initial data","estimatedEffort":"100","effortDimension":"hour","created":"2010-10-20","started":"2010-10-20","finished":"","status":"CREATED","tags":["task","GTD"]}},
    {"id":"cogito","key":"GTD","value":{"_id":"cogito","_rev":"1-b18ec420bfcd56b362fbb2d9c8447988","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-10-20","started":"","deadline":"2010-12-15","summary":"cogito GTD-like web application","details":"Develop a web based application with CouchDB","tags":["project","GTD"]}},
    {"id":"cogito","key":"project","value":{"_id":"cogito","_rev":"1-b18ec420bfcd56b362fbb2d9c8447988","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-10-20","started":"","deadline":"2010-12-15","summary":"cogito GTD-like web application","details":"Develop a web based application with CouchDB","tags":["project","GTD"]}},
    {"id":"couchme","key":"project","value":{"_id":"couchme","_rev":"1-8b4cdf4d6e29d085fa8459ba4d8215a8","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-09-15","started":"","deadline":"2010-12-23","summary":"CouchMe how to use CouchDB","details":"Readings about how to develop web applications with CouchDB and CouchApp","tags":["project","CouchDB","CouchApp"]}},
    {"id":"csvconv","key":"project","value":{"_id":"csvconv","_rev":"1-42ff3cab63e789fef89cebd06a9a3e7e","type":"project","sponsor":"tombenke","manager":"tombenke","created":"2010-06-01","started":"","deadline":"2010-10-18","summary":"CSV converter utility","details":"Develop a utility to convert CSV files to XML and to JSON format","tags":["project","CouchDB","CSV"]}},
    {"id":"action1","key":"task","value":{"_id":"action1","_rev":"1-a1ba5bbc864ea8037b61770a6e6a8ade","type":"action","owner":"tombenke","assignedTo":"tombenke","summary":"Create the cogito web application skeleton with initial data","estimatedEffort":"100","effortDimension":"hour","created":"2010-10-20","started":"2010-10-20","finished":"","status":"CREATED","tags":["task","GTD"]}}
    ]}


### Dokumentum(ok) lekérdezése a summary mezőben előforduló szó alapján:

A __map()__ függvény:

    function( doc )
    {
        if( doc.summary )
        {
            var words = doc.summary.toLowerCase().replace(/[^a-z]+/g, ' ').split(' ');
            for( word in words )
            {
                emit( words[ word ], 1 );
            }
        }
    }


A __reduce()__ függvény:

    function( key, values, rereduce )
    {
        return sum( values );
    }


URL: [http://localhost:5984/cogito/_design/cogito/_view/docBySummary?key="gtd"&reduce=false](http://localhost:5984/cogito/_design/cogito/_view/docBySummary?key="gtd"&reduce=false)

Eredmény:

    {"total_rows":22,"offset":10,"rows":[
    {"id":"cogito","key":"gtd","value":1}
    ]}


### A _Summary_ mezőben előforduló szavak száma (unique)

URL [http://localhost:5984/cogito/_design/cogito/_view/docBySummary](http://localhost:5984/cogito/_design/cogito/_view/docBySummary)

Eredmény:

    {"rows":[
    {"key":null,"value":22}
    ]}


### A _Summary_ mezőben előforduló szavak száma (szavanként):

URL: [http://localhost:5984/cogito/_design/cogito/_view/docBySummary?group=true](http://localhost:5984/cogito/_design/cogito/_view/docBySummary?group=true)

Eredmény:

    {"rows":[
    {"key":"application","value":2},
    {"key":"cogito","value":2},
    {"key":"converter","value":1},
    {"key":"couchdb","value":1},
    {"key":"couchme","value":1},
    {"key":"create","value":1},
    {"key":"csv","value":1},
    {"key":"data","value":1},
    {"key":"gtd","value":1},
    {"key":"how","value":1},
    {"key":"initial","value":1},
    {"key":"like","value":1},
    {"key":"skeleton","value":1},
    {"key":"the","value":1},
    {"key":"to","value":1},
    {"key":"use","value":1},
    {"key":"utility","value":1},
    {"key":"web","value":2},
    {"key":"with","value":1}
    ]}






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

