# redchain
/* ---------------------------- */

/*   The Red Chain project      */

/* ---------------------------- */



Steps to make redchain working:

1. Download the source code from github

2. Install required packages

   npm install

3. Test the project (Control-C to cancel)

   npm start

4. If the project still not working install next packages manually:

   npm install pg-promise --save
   
   npm install bluebird --save

   npm install ini --save

5. Install postgres

6. Run the crebas.sql and create the database.

   psql -f crebas.sql
   
7. For SSL You need to generate certificates:

   cd bin
   
   openssl genrsa 1024 > private.key
   
   openssl req -new -key private.key -out cert.csr
   
   openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem

8. Start project

   cd ..

   npm start

