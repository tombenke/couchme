function(doc) {
     if( ! doc.country ) return;
     emit( [doc.country, doc.name ], { id: doc._id, name: doc.name } );
}
