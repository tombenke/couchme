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
