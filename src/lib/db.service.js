const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

async function dbconnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL successfully connected");

    await sequelize.sync(); // models sync
    console.log("✅ Models synchronized");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  }
}

module.exports = { sequelize, dbconnection };

