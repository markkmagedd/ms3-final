const express = require("express");
const app = express();
const adminUsername = "admin";
const adminPassword = "admin";
const mssql = require("mssql");
const bodyParser = require("body-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    store: new FileStore({ path: "./sessions", secret: "mySecret" }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 },
  })
);

const config = {
  user: "sa", // Your database username
  password: "VeryStr0ngP@ssw0rd", // Your database password
  server: "localhost", // Your SQL Server hostname or IP
  database: "Milestone2DB_24", // Your database name
  pool: {
    max: 10, // Max number of connections in the pool
    min: 0, // Min number of connections
    idleTimeoutMillis: 30000, // Timeout before a connection is closed
  },
  options: {
    encrypt: true, // Use encryption for data transfer (recommended)
    trustServerCertificate: true, // If you're using a self-signed certificate
  },
};
mssql.on("error", (err) => {
  console.log("SQL error", err);
});
app.get("/", (req, res) => {});

//------------ Admin Components ------------/

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
  //err handling done
  //1.2
  try {
    await mssql.connect(config);
    const result = await mssql.query("Select * from allCustomerAccounts");
    if (result.recordset.length === 0) {
      res.json({
        error: "No Subscribed Accounts At The Moment !",
        success: false,
        data: result.recordset,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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
  //err handling done
  //1.3
  try {
    await mssql.connect(config);
    const result = await mssql.query("Select * from PhysicalStoreVouchers");
    if (result.recordset.length === 0) {
      res.json({
        error: "No Physical Shops Available At The Moment !",
        success: false,
        data: result.recordset,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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
  //err handling done
  //1.4
  try {
    await mssql.connect(config);
    const result = await mssql.query("Select * from allResolvedTickets");
    if (result.recordset.length === 0) {
      res.json({
        error: " There Are No Resolved Tickets !",
        success: false,
        data: result.recordset,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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
  //err handling done
  //1.5
  try {
    await mssql.connect(config);
    const result = await mssql.query("EXEC Account_Plan");
    if (result.recordset.length === 0) {
      res.json({
        error: "No Subscribed Accounts At The Moment !",
        success: false,
        data: result.recordset,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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
  //err handling done
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
    if (result.recordset.length === 0) {
      res.json({
        error: "No Customer Accounts Found!",
        success: false,
        data: result.recordset,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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
    if (result.recordset.length === 0) {
      res.json({
        error: "This Mobile Number Is Doesn't Have A Valid Subscription !",
        success: false,
        data: result.recordset,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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
  //err done
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
      error: "Benefits Deleted Successfully !",
      success: true,
      data: null,
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
  //err done
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
    if (result.recordset.length === 0) {
      res.json({
        error: "There Are No SMS Offers At The Moment !",
        success: false,
        data: null,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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

app.get("/customer-wallet", async (req, res) => {
  //2.1
  try {
    await mssql.connect(config);
    const result = await mssql.query("Select * From CustomerWallet");
    if (result.recordset.length === 0) {
      res.json({
        error: "No Customer Wallets Available  !!",
        success: false,
        data: null,
      });
    }
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

app.get("/e-shop-vouchers", async (req, res) => {
  //2.2
  try {
    await mssql.connect(config);
    const result = await mssql.query("Select * From E_shopVouchers");
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

app.get("/account-payments", async (req, res) => {
  //2.3
  try {
    await mssql.connect(config);
    const result = await mssql.query("Select * From AccountPayments");
    if (result.recordset.length === 0) {
      res.json({
        error: "No Account Payments Available !!",
        success: false,
        data: null,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    await mssql.close();
  }
});

app.get("/cashback-number", async (req, res) => {
  //2.4
  try {
    await mssql.connect(config);
    const result = await mssql.query("Select * From Num_of_cashback");
    if (result.recordset.length === 0) {
      res.json({
        error: "No Customer Wallets Available  !!",
        success: false,
        data: null,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    await mssql.close();
  }
});

app.post("/account-payment-points", async (req, res) => {
  //2.5
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
      "EXEC Account_Payment_Points @mobileNum "
    );
    if (result.recordset.length === 0) {
      res.json({
        error: "No Payments Available  !!",
        success: false,
        data: null,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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

app.post("/wallet-Cashback-amount", async (req, res) => {
  //2.6
  try {
    const { walletId, planId } = req.body;
    if (!walletId || !planId) {
      return res.status(400).json({
        success: false,
        error: "Both Wallet Id and Plan Id must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("planId", mssql.Int, planId);
    request.input("walletId", mssql.Int, walletId);

    const result = await request.query(`
        DECLARE @result int;
        SET @result = dbo.Wallet_Cashback_Amount(@walletId , @planId);
        SELECT @result AS result;
      `);
    if (result.recordset.length === 0) {
      res.json({
        error: "No Cashback Available  !!",
        success: false,
        data: null,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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

app.post("/wallet-transfer-amount", async (req, res) => {
  //2.7
  try {
    const { walletId, startDate, endDate } = req.body;
    if (!walletId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: "Both Wallet Id and Date must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("startDate", mssql.Date, startDate);
    request.input("walletId", mssql.Int, walletId);
    request.input("endDate", mssql.Date, endDate);

    const result = await request.query(`
        DECLARE @result int;
        SET @result = dbo.Wallet_Transfer_Amount(@walletId , @startDate , @endDate);
        SELECT @result AS result;
      `);

    if (result.recordset.length === 0) {
      res.json({
        error: "There Are No Transactions Amounts In The Following Duration!!",
        success: false,
        data: null,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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

app.post("/wallet-mobileno", async (req, res) => {
  //2.8
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
    const result = await request.query(`
        DECLARE @result BIT;
        SET @result = dbo.Wallet_MobileNo(@mobileNum);
        SELECT @result AS result;
      `);
    if (result.recordset[0].result === false) {
      res.json({
        error: "The Following Number Doesn't Have An Active Wallet !!",
        success: false,
        data: result.recordset,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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

app.post("/total-points-account", async (req, res) => {
  //2.9
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
    const result = await request.query("Exec Total_Points_Account @mobileNum");

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

// ----------- Customer Components --------- //

app.get("/all-service-plans", async (req, res) => {
  //3.1
  try {
    await mssql.connect(config);
    const result = await mssql.query("Select * from allServicePlans");
    if (result.recordset.length === 0) {
      res.json({
        error: "There Are No Service Plan At The Moment !!",
        success: false,
        data: null,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    await mssql.close();
  }
});

app.post("/account-login-validation", async (req, res) => {
  //3.2
  try {
    const { mobileNum, password } = req.body;
    if (!mobileNum || !password) {
      return res.status(400).json({
        success: false,
        error: "Both MobileNum and Password must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("mobileNum", mssql.Char(11), mobileNum);
    request.input("password", mssql.VarChar(50), password);

    const result = await request.query(`
          DECLARE @result BIT;
          SET @result = dbo.AccountLoginValidation(@mobileNum , @password);
          SELECT @result AS result;
        `);
    if (result.recordset[0].result === false) {
      res.json({
        error: "Incorrect Username Or Password !!",
        success: false,
        data: result.recordset,
      });
    } else {
      req.session.user = { mobileNum };
      res.json({
        error: null,
        success: true,
        data: mobileNum,
      });
    }
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

app.post("/consumption", async (req, res) => {
  //3.3
  try {
    const { planName, startDate, endDate } = req.body;
    if (!planName || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: "Both Plan Name and Date must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("startDate", mssql.Date, startDate);
    request.input("planName", mssql.VarChar(50), planName);
    request.input("endDate", mssql.Date, endDate);

    const result = await request.query(
      " SELECT * FROM dbo.Consumption(@planName , @startDate , @endDate)"
    );

    if (result.recordset.length === 0) {
      res.json({
        error: "Consumption Is Unavailable At The Moment !!",
        success: false,
        data: null,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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

app.post("/unsubscribed-plans", async (req, res) => {
  //3.4
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
    const result = await request.query("Exec Unsubscribed_Plans @mobileNum");
    if (result.recordset.length === 0) {
      res.json({
        error: "This Customer Is Subscribed To All Plans !!",
        success: false,
        data: null,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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

app.post("/usage-plan-current-month", async (req, res) => {
  //3.5
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
      "SELECT * FROM dbo.Usage_Plan_CurrentMonth(@mobileNum)"
    );
    if (result.recordset.length === 0) {
      res.json({
        error: "No Usage Available !!",
        success: false,
        data: null,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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

app.post("/cashback-wallet-customer", async (req, res) => {
  //3.6
  try {
    const { NID } = req.body;
    if (!NID) {
      return res.status(400).json({
        success: false,
        error: "A National Id must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();
    request.input("NID", mssql.Int, NID);
    const result = await request.query(
      "SELECT * FROM dbo.Cashback_Wallet_Customer(@NID)"
    );
    if (result.recordset.length === 0) {
      res.json({
        error:
          "There Are No Cashback Transactions Available For This Wallet !!",
        success: false,
        data: null,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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

app.get("/all-benefits", async (req, res) => {
  //4.1
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query("SELECT * FROM allBenefits");
    if (result.recordset.length === 0) {
      res.json({
        error: "There Are No Active Benefits Available At The Moment!!",
        success: false,
        data: null,
      });
    } else {
      res.json({
        error: null,
        success: true,
        data: result.recordset,
      });
    }
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

app.post("/ticket-account-customer", async (req, res) => {
  //4.2
  try {
    const { NID } = req.body;
    if (!NID) {
      return res.status(400).json({
        success: false,
        error: "A National Id must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();
    request.input("NID", mssql.Int, NID);
    const result = await request.query("EXEC dbo.Ticket_Account_Customer @NID");

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

app.post("/account-highest-voucher", async (req, res) => {
  //4.3
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
      "EXEC Account_Highest_Voucher @mobileNum"
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

app.post("/remaining-plan-amount", async (req, res) => {
  //4.4
  try {
    const { planName, mobileNum } = req.body;
    if (!planName || !mobileNum) {
      return res.status(400).json({
        success: false,
        error: "Both Plan Number and Mobile Number must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("planName", mssql.VarChar(50), planName);
    request.input("mobileNum", mssql.Char(11), mobileNum);

    const result = await request.query(` 
            DECLARE @result INT;
            SET @result = dbo.Remaining_plan_amount(@mobileNum , @planName );
            SELECT @result AS result;
          `); //it is written wrong in the schema

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

app.post("/extra-plan-amount", async (req, res) => {
  //4.5
  try {
    const { planName, mobileNum } = req.body;
    if (!planName || !mobileNum) {
      return res.status(400).json({
        success: false,
        error: "Both Plan Number and Mobile Number must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("planName", mssql.VarChar(50), planName);
    request.input("mobileNum", mssql.Char(11), mobileNum);

    const result = await request.query(` 
                DECLARE @result INT;
                SET @result = dbo.Extra_plan_amount(@mobileNum , @planName );
                SELECT @result AS result;
            `); //it is written wrong in the schema

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

app.post("/top-successful-payments", async (req, res) => {
  //4.6
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
      "Exec Top_Successful_Payments @mobile_num"
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

app.get("/all-shops", async (req, res) => {
  //5.1
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query("SELECT * FROM allShops");

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

app.post("/subscribed-plans-5-months", async (req, res) => {
  //5.2
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
      "SELECT * FROM dbo.Subscribed_plans_5_Months(@mobileNum)"
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

app.post("/initiate-plan-payment", async (req, res) => {
  //5.3
  try {
    const { mobileNum, amount, paymentMethod, planId } = req.body;
    if (!mobileNum || !amount || !paymentMethod || !planId) {
      return res.status(400).json({
        success: false,
        error: "Both Plan Name and Date must be provided", // update the error
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("mobileNum", mssql.Char(11), mobileNum);
    request.input("amount", mssql.Decimal(10, 1), amount);
    request.input("paymentMethod", mssql.VarChar(50), paymentMethod);
    request.input("planId", mssql.Int, planId);

    const result = await request.query(
      "Exec Initiate_plan_payment @mobileNum, @amount, @paymentMethod,@planId"
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

app.post("/payment-wallet-cashback", async (req, res) => {
  //5.4
  try {
    const { mobileNum, paymentId, benefitId } = req.body;
    if (!mobileNum || !paymentId || !benefitId) {
      return res.status(400).json({
        success: false,
        error: "Mobile Number , Payment Id and Benefit Id must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("mobileNum", mssql.Char(11), mobileNum);
    request.input("paymentId", mssql.Int, paymentId);
    request.input("benefitId", mssql.Int, benefitId);

    const result = await request.query(
      " Exec Payment_wallet_cashback @mobileNum , @paymentId , @benefitId"
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

app.post("/initiate-balance-payment", async (req, res) => {
  //5.5
  try {
    const { mobileNum, amount, paymentMethod } = req.body;
    if (!mobileNum || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: "Mobile Number , Amount and Payment Method must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("mobileNum", mssql.Char(11), mobileNum);
    request.input("amount", mssql.Decimal(10, 1), amount);
    request.input("paymentMethod", mssql.VarChar(50), paymentMethod);

    const result = await request.query(
      " Exec Initiate_balance_payment @mobileNum , @amount , @paymentMethod"
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

app.post("/redeem-voucher-points", async (req, res) => {
  //5.6
  try {
    const { mobileNum, voucherId } = req.body;
    if (!mobileNum || !voucherId) {
      return res.status(400).json({
        success: false,
        error: "Mobile Number and Voucher Id must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();
    request.input("mobileNum", mssql.Char(11), mobileNum);
    request.input("voucherId", mssql.Int, voucherId);
    const result = await request.query(
      "Exec Redeem_voucher_points @mobile_num , @voucherId"
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
