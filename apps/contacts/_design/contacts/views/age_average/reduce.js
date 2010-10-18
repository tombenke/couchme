function( key, values, rereduce )
{
    var totals = sum( values );
    return Math.round( (totals / values.length) * 100 / 100);
}