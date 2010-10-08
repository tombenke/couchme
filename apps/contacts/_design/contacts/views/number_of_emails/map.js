function(doc) {
  if( doc.email )
  {
    emit("numberOfEmails", 1 );
  }
}