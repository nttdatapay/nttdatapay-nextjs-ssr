import { decrypt } from "../utils";

export default async function handler(req, res) {
  console.log("Received POST request on '/api/response' route.");
  console.log("Request body:", req.body);

  const { encData } = req.body;
  const decrypted_data = decrypt(encData);
  console.log("Decrypted data:", decrypted_data);

  let jsonData = JSON.parse(decrypted_data);
  console.log("Parsed JSON data:", jsonData);

  let resArray = Object.keys(jsonData).map((key) => jsonData[key]);
  console.log("Response array constructed:", resArray);

  if (resArray[0]["responseDetails"]["statusCode"] == "OTS0000") {
    console.log("Transaction successful.");
    res.json("Transaction successful");
    console.log("Complete response array:", resArray);
    res.json(resArray);
  } else {
    console.log(
      "Transaction failed with status code:",
      resArray[0]["responseDetails"]["statusCode"]
    );
    res.json("Transaction failed");
  }
}
