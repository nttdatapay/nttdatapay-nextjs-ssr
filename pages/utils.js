import crypto from "crypto";

const req_enc_key = "A4476C2062FFA58980DC8F79EB6A799E";
const req_salt = "A4476C2062FFA58980DC8F79EB6A799E";
const res_dec_key = "75AEF0FA1B94B3C10D4F5B268F757F11";
const res_salt = "75AEF0FA1B94B3C10D4F5B268F757F11";

const algorithm = "aes-256-cbc";
const reqPassword = Buffer.from(req_enc_key, "utf8");
const reqSalt = Buffer.from(req_salt, "utf8");
const resPassword = Buffer.from(res_dec_key, "utf8");
const resSalt = Buffer.from(res_salt, "utf8");
const iv = Buffer.from(
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  "utf8"
);

export const encrypt = (text) => {
  console.log("Encrypt function called with text:", text);
  var derivedKey = crypto.pbkdf2Sync(reqPassword, reqSalt, 65536, 32, "sha512");
  console.log("Derived key for encryption generated:", derivedKey);
  const cipher = crypto.createCipheriv(algorithm, derivedKey, iv);
  console.log("Cipher created for encryption.", cipher);
  let encrypted = cipher.update(text);
  console.log("Partial encrypted text:", encrypted);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  console.log("Final encrypted text:", encrypted);
  return `${encrypted.toString("hex")}`;
};

export const decrypt = (text) => {
  console.log("Decrypt function called with text:", text);
  const encryptedText = Buffer.from(text, "hex");
  console.log("Encrypted text converted to buffer:", encryptedText);
  var derivedKey = crypto.pbkdf2Sync(resPassword, resSalt, 65536, 32, "sha512");
  console.log("Derived key for decryption generated:", derivedKey);
  const decipher = crypto.createDecipheriv(algorithm, derivedKey, iv);
  console.log("Decipher created for decryption.");
  let decrypted = decipher.update(encryptedText);
  console.log("Partial decrypted text:", decrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  console.log("Final decrypted text:", decrypted);
  return decrypted.toString();
};

export const generateSignature = (respArray, resHashKey) => {
  console.log("Generating signature using response array.");
  var signatureString =
    respArray[0]["merchDetails"]["merchId"].toString() +
    respArray[0]["payDetails"]["atomTxnId"] +
    respArray[0]["merchDetails"]["merchTxnId"].toString() +
    respArray[0]["payDetails"]["totalAmount"].toFixed(2).toString() +
    respArray[0]["responseDetails"]["statusCode"].toString() +
    respArray[0]["payModeSpecificData"]["subChannel"][0].toString() +
    respArray[0]["payModeSpecificData"]["bankDetails"]["bankTxnId"].toString();
  console.log("Constructed signature string:", signatureString);
  var hmac = crypto.createHmac("sha512", resHashKey);
  console.log("HMAC initialized with key.");
  data = hmac.update(signatureString);
  console.log("HMAC updated with signature string.");
  const gen_hmac = data.digest("hex");
  console.log("Generated HMAC (signature):", gen_hmac);
  return gen_hmac;
};
