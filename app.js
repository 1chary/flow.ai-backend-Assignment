const express = require("express")
const app = express();

const path = require("path")
const dbPath = path.join(__dirname,"userdata.db")
const { open } = require("sqlite")
const sqlite3 = require("sqlite3")

let db = null
app.use(express.json())

const initializeTheServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })
        app.listen(3002, () => {
            console.log("server is running at http://localhost:3002 ")
        })
    }
    catch(e) {
        console.log(`DB ERROR ${e.message}`)
        process.exit(1)
    }
}

// Retriving all the transactions
app.get("/transactions", async(request,response) => {
    const getUserData = `
    SELECT *
    FROM transactions
    `;
    const queryResult = await db.all(getUserData)
    response.send(queryResult)
})

// Adding a new transactions
app.post("/transactions/add", async(request,response) => {
    const transactionDetails = request.body;
    const {
        id,
        type,
        category,
        amount,
        date,
        description,
        user_id
    } = transactionDetails;
    const addNewTransaction = `
    INSERT INTO transactions(id,type,category,amount,date,description,user_id)
    VALUES (
        ${id},
        '${type}',
        '${category}',
        ${amount},
        '${date}',
        '${description}',
        ${user_id}
    )
    `
    const queryResult = await db.run(addNewTransaction)
    response.send("New Transaction Added Successfully")
}) 


// Retriving transaction by id
app.get("/transactions/:id",async(request,response) => {
    const {id} = request.params;
    const retrieveSpecificUserData = `
    SELECT *
    from transactions
    where id = ${id};`;
    const result = await db.get(retrieveSpecificUserData);
    response.send(result)
})

// deleting transaction by id
app.delete("/transactions/delete/:id", async(request,response) => {
    const {id} = request.params;
    const deleteTransaction = `
    DELETE FROM transactions
    where id = ${id}
    `;
    db.run(deleteTransaction);
    response.send("Transaction Deleted Successfully")
})


initializeTheServer()