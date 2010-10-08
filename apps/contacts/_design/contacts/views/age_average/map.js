function(doc) {
     if( ! doc.age ) return;
     emit( "average", doc.age );
}
