function(doc) {
     if( ! doc.country ) return;
     emit( doc.country, doc.age );
}
