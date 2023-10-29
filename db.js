require("dotenv").config();
const mongoose = require("mongoose");
const { DB_URI } = process.env;

async function main() {
    await mongoose.connect(`${DB_URI}`);
    console.log(`Connected successfully!`);
}

main().catch(err => console.log(err)); 