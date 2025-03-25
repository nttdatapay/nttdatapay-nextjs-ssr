# nttdatapay-nextjs-ssr
 
## Introduction
This is a demo project for NextJS AIPAY, tested up to Node version 20.12.1. The project demonstrates how to implement AIPAY in a sample merchant shop.
 
## Prerequisites
- Next.js (v15.2.1)
- npm (Node Package Manager)
 
## Install all the dependencies
- npm install
 
## Integration Flow
    1. Modify the JSON: Adjust the JSON data according to your specific requirements (e.g., contact number, email, etc.).
 
    2. Initiate API Call: After modifying the JSON, an API call will be made to the AIPAY authentication URL.
 
    3. Get Atom Token ID: Upon a successful response, you will receive the Atom Token ID.
 
    4. Open Payment Page: The payment page will open after clicking on the "Pay Now" option using the obtained Atom Token ID.
 
    5. Make the Payment: Proceed with the payment on the payment page.
 
    6. Handle the Response: Process the payment response to verify the transaction status and handle success or failure accordingly.
 
## How to Use
    1. Install all the project dependencies by running the following command:
    - npm install
 
    2. Once the application is launched, the Atom Token ID will be fetched, and you’ll see a sample merchant shop UI with the Atom Token ID, Transaction ID, and Amount.
 
    3. Click the "Pay Now" button to initiate the payment process.
 
    4. Make the payment on the payment page. The response will be processed, and you will be redirected to the response page.