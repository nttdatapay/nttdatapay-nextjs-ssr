import { encrypt, decrypt } from "../utils";

const merchId = "317157";
const merchPass = "Test@123";
const prodId = "NSE";
const Authurl = "https://caller.atomtech.in/ots/aipay/auth"; // this is uat URL only

export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("GET request received");

    let txnId = "123";
    let txnDate = "2023-03-10 20:46:00";
    let amount = "1";
    let userEmailId = "test.user@atomtech.in";
    let userContactNo = "8888888888";

    const jsondata = `{
      "payInstrument": {
        "headDetails": {
          "version": "OTSv1.1",
          "api": "AUTH",
          "platform": "FLASH"
        },
        "merchDetails": {
          "merchId": "${merchId}",
          "userId": "",
          "password": "${merchPass}",
          "merchTxnId": "${txnId}",
          "merchTxnDate": "${txnDate}"
        },
        "payDetails": {
          "amount": "${amount}",
          "product": "${prodId}",
          "custAccNo": "213232323",
          "txnCurrency": "INR"
        },
        "custDetails": {
          "custEmail": "${userEmailId}",
          "custMobile": "${userContactNo}"
        },
        "extras": {
          "udf1": "udf1",
          "udf2": "udf2",
          "udf3": "udf3",
          "udf4": "udf4",
          "udf5": "udf5"
        }
      }
    }`;

    const JSONString = jsondata.toString();
    console.log("JSONString created:", JSONString);
    let encDataR = encrypt(JSONString);
    console.log("Encrypted data ready for sending:", encDataR);

    try {
      const response = await fetch(Authurl, {
        method: "POST",
        headers: {
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          encData: encDataR,
          merchId: merchId,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const datas = await response.text();
      console.log("Response received:", datas);

      var arr = datas.split("&").map((val) => val);
      var arrTwo = arr[1].split("=").map((val) => val);

      var decrypted_data = decrypt(arrTwo[1]);
      console.log("Decrypted data:", decrypted_data);

      let jsonData = JSON.parse(decrypted_data);

      if (jsonData["responseDetails"]["txnStatusCode"] === "OTS0000") {
        console.log("Transaction successful");
        res.status(200).json({
          token: jsonData["atomTokenId"],
          txnId: txnId,
          merchId: merchId,
        });
      } else {
        console.log(
          "Transaction failed with status code:",
          jsonData["responseDetails"]["txnStatusCode"]
        );
        res.status(400).json({
          error: jsonData["responseDetails"]["txnStatusCode"],
        });
      }
    } catch (error) {
      console.error("Error in fetch request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    console.log("POST request received with body:", req.body);

    var decrypted_data = decrypt(req.body.encData);
    console.log("Decrypted data:", decrypted_data);

    let jsonData = JSON.parse(decrypted_data);
    let respArray = Object.keys(jsonData).map((key) => jsonData[key]);

    let signature = generateSignature(respArray);
    console.log("Generated signature:", signature);

    if (signature === respArray[0]["payDetails"]["signature"]) {
      if (respArray[0]["responseDetails"]["statusCode"] === "OTS0000") {
        console.log("Transaction successful");
        res.status(200).json("Transaction successful");
      } else {
        console.log(
          "Transaction failed with status code:",
          respArray[0]["responseDetails"]["statusCode"]
        );
        res.status(400).json("Transaction failed");
      }
    } else {
      console.log("Signature mismatch");
      res.status(400).json("Signature mismatched!! Transaction failed.");
    }
  }
}
