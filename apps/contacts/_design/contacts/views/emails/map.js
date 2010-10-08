function(doc) {
  if( doc.email )
  {
    emit(doc._id, {id: doc._id, email: doc.email} );
  }
}