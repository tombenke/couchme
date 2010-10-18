function( head, req )
{
    send("head");
    var row;
    while( row = getRow() )
    {
        log( "row: " + toJSON( row ) );
        send( row. key );
    };
    return "tail";
}