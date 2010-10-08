function(doc) {
     if( ! doc.age ) return;
     emit( "age_max_min", doc.age );
}
