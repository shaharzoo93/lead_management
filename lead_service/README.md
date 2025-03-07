## Required 
Node.js v22.14.0
npm@10.9.2

## How to use

    ## Change the DB configuration in /src/config/db/connect.ts file

    ```bash
    npm i
    npm run build
    npm run start
    ```

    ## Run the test case using below command
    
    ```bash
    npm run build
    npm run test
    ```
## API LIST
    ## POST - /api/v1/common/createAllTable - Create Tables
    ## POST - /api/v1/common/deleteAllDatabaseSchema/true - Delete/Drop Tables
    ## POST - /api/v1/leads/add - Add Lead   
        ## Body - 
            ```bash
            {
                "name": "abv",
                "email_address": "test@example.com",
                "status": "New"
            }
    ## Get - /api/v1/leads/getAll - Get all the leads