const express = require("express");
const app = express();
const cors = require("cors");
const adminUsername = "admin";
const adminPassword = "admin";
const mssql = require("mssql");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const config = {
  user: "sa", // Your database username
  password: "VeryStr0ngP@ssw0rd", // Your database password
  server: "localhost", // Your SQL Server hostname or IP
  database: "Milestone2DB_24", // Your database name
  options: {
    encrypt: true, // Use encryption for data transfer (recommended)
    trustServerCertificate: true, // If you're using a self-signed certificate
  },
};
mssql.on("error", (err) => {
  console.log("SQL error", err);
});
app.get("/", (req, res) => {});

app.post("/admin-login", (req, res) => {
  //1.1
  const { username, password } = req.body;
  if (username != adminUsername || password != adminPassword) {
    return res.status(200).json({
      error: "Username or Password is Incorrect",
      success: false,
      data: null,
    });
  }
  return res.status(200).json({ error: null, success: true, data: null });
});

app.get("/all-customer-accounts", async (req, res) => {
  //1.2
  try {
    await mssql.connect(config);
    const result = await mssql.query("Select * from allCustomerAccounts");

    res.json({
      error: null,
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    await mssql.close();
  }
});

app.get("/physical-store-vouchers", async (req, res) => {
  //1.3
  try {
    await mssql.connect(config);
    const result = await mssql.query("Select * from PhysicalStoreVouchers");

    res.json({
      error: null,
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    await mssql.close();
  }
});

app.get("/all-resolved-tickets", async (req, res) => {
  //1.4
  try {
    await mssql.connect(config);
    const result = await mssql.query("Select * from allResolvedTickets");

    res.json({
      error: null,
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    await mssql.close();
  }
});

app.get("/account-plan", async (req, res) => {
  //1.5
  try {
    await mssql.connect(config);
    const result = await mssql.query("EXEC Account_Plan");

    res.json({
      error: null,
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    await mssql.close();
  }
});

app.post("/account-plan-date", async (req, res) => {
  //1.6
  try {
    const { date, planId } = req.body;
    if (!planId || !date) {
      return res.status(400).json({
        success: false,
        error: "Both Plan Id and Date must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("date", mssql.Date, date);
    request.input("planId", mssql.Int, planId);

    const result = await request.query(
      "SELECT * FROM dbo.Account_Plan_date( @date , @planId )"
    );

    res.json({
      error: null,
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      data: null,
    });
  } finally {
    await mssql.close();
  }
});

app.post("/account-usage-plan", async (req, res) => {
  //1.7
  try {
    const { mobileNum, date } = req.body;
    if (!mobileNum || !date) {
      return res.status(400).json({
        success: false,
        error: "Both Mobile Number and Date must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("date", mssql.Date, date);
    request.input("mobileNum", mssql.Char(11), mobileNum);

    const result = await request.query(
      "SELECT * FROM dbo.Account_Usage_Plan( @mobileNum , @date )"
    );

    res.json({
      error: null,
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      data: null,
    });
  } finally {
    await mssql.close();
  }
});

app.post("/benefits-account", async (req, res) => {
  //1.8
  try {
    const { mobileNum, planId } = req.body;
    if (!mobileNum || !planId) {
      return res.status(400).json({
        success: false,
        error: "Both Mobile Number and Plan Id must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("planId", mssql.Int, planId);
    request.input("mobileNum", mssql.Char(11), mobileNum);

    const result = await request.query(
      "EXEC Benefits_Account @mobileNum  , @planId "
    );

    res.json({
      error: null,
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      data: null,
    });
  } finally {
    await mssql.close();
  }
});

app.post("/account-sms-offers", async (req, res) => {
  //1.9
  try {
    const { mobileNum } = req.body;
    if (!mobileNum) {
      return res.status(400).json({
        success: false,
        error: "A Mobile Number must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("mobileNum", mssql.Char(11), mobileNum);

    const result = await request.query(
      "SELECT * FROM dbo.Account_SMS_Offers( @mobileNum  )"
    );

    res.json({
      error: null,
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      data: null,
    });
  } finally {
    await mssql.close();
  }
});

app.listen(8080, () => {
  console.log("server running on 8080");
});
