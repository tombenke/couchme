function(doc) {
  if( doc.fax )
  {
    emit(doc._id, {id: doc._id, name: doc.name, fax: doc.fax} );
  }
}