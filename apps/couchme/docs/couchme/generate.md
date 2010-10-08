Alkalmazások generálása
=======================

<!--
help

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

klónozás

    couchapp clone http://localhost:5984/contacts/_design/contacts

Visszatöltés

    couchapp push http://admin:admin@localhost:5984/contacts

-->



We've made it nearly to the end of this post. The last thing to cover are the various JavaScript libraries for making CouchApps. I won't try to document them, just name them, and say a little about their purpose.

I have a mental plan to clean up and consolidate some of these libraries,
so they are more modular.
This should make it so that CouchApp code loads faster, among other things.

The jQuery CouchDB Client API

We already used jquery.couch.js in the Tiny CouchApp example HTML above.
This is the basic CouchDB library for jQuery.
It handles things like saveDoc and openDoc, view queries, replication requests,
etc. Essentially it wraps the CouchDB API in Ajaxy goodness.
This library ships as part of CouchDB, as it is used by Futon.

The CouchApp Code Loader

The CouchApp toolchain ships with jquery.couch.app.js,
which is tasked with one job -- loading your application code into the page.
This CouchApp jQuery plugin loads your design document
(the JSON saved as a result of a couchapp push command),
so that the browser has access to your view definitions,
show and list functions, etc. It is invoked like so:

    $.couch.app(function(app){
        // app.db is your jquery.couch.js object
        // app.require("lib/foo") gives you access to libraries
    });

Essentially, all this function does, is inspect the page you are on,
determine how to load the design document, load it,
and gives you an object that references it and allows you to require libraries
from it. (There is some legacy featuritis in there, but I'm working to remove that.)

Evently

Evently is a convenience library I wrote for myself.
Essentially it does two things:

* One is it allows you to write complex jQuery code in a declarative fashion.
  This makes code reuse easier, by avoiding the tangled web of dependencies
  you often see in deeply nested jQuery code.

* The other is that Evently knows a bunch of CouchDB tricks,
  so you can get it to run a view query and hand you the results,
  without having to write nested callbacks in the Ajax style.

As a coincidence, Evently's declarative structures happen to map onto JSON objects nicely.
It also happens that couchapp push maps filesystem structures to JSON code as well.
It was only after I'd written lots of Evently code all in one file,
that I realized I could nest the JSON structures into a tree of folders and JavaScript files.

People think that Evently and the deeply-nested folders and files things must go together, but it is just one way of doing things. For more Evently docs, visit this link.
Pathbinder

Pathbinder makes it so you can assign events to be triggered when the hash part
of the browser URL changes.
Evently knows how to use it, so you can declaratively link paths and events.

Pathbinder docs are here.


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

