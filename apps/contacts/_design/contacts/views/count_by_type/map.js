function(doc) {
     if(doc.email && doc.fax)
             emit("Both", 1);
       else if(doc.email)
             emit("Email", 1);
       else if(doc.fax)
             emit("Fax", 1);
       else
             emit("Neither", 1);
}
