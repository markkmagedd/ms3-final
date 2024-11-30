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

app.get("/customer-wallet", async (req, res) => {
  //2.1
  try {
    await mssql.connect(config);
    const result = await mssql.query("Select * From CustomerWallet");
    console.log(result);

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

app.get("/customer-wallet", async (req, res) => {
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

app.get("/cashback-number", async (req, res) => {
  //2.4
  try {
    await mssql.connect(config);
    const result = await mssql.query("Select * From Num_of_cashback");
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
        DECLARE @result BIT;
        SET @result = dbo.Wallet_Cashback_Amount(@walletId , @planId);
        SELECT @result AS result;
      `);

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
        DECLARE @result BIT;
        SET @result = dbo.Wallet_Transfer_Amount(@walletId , @startDate , @endDate);
        SELECT @result AS result;
      `);

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

app.post("/account-login-validation", async (req, res) => {
  //3.2
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Both Username and Password must be provided",
        data: null,
      });
    }
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input("username", mssql.Char(11), username);
    request.input("password", mssql.Char(11), password);

    const result = await request.query(`
          DECLARE @result BIT;
          SET @result = dbo.AccountLoginValidation(@username , @password);
          SELECT @result AS result;
        `);

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

app.get("/all-benefits", async (req, res) => {
  //4.1
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query("SELECT * FROM dbo.allBenefits");

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
    const result = await request.query(
      "EXEC dbo.Cashback_Wallet_Customer @NID"
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

app.listen(8080, () => {
  console.log("server running on 8080");
});
