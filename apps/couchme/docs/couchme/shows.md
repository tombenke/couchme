Megjelenítés
============

## Create a show function


To display our hello we will create a show function.

    cd helloworld/
    couchapp generate show hello

Here the generate command create a file named hello.js in the folder shows.
The content of this file is :

    function(doc, req) {

    }

which is default template for show functions.

For now we only want to display the string "Hello World".
Edit your show function like this:

    function(doc, req) {
        return "Hello World";
    }

