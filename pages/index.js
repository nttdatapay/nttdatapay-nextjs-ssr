import { useEffect } from 'react';

const Home = ({ token, txnId, merchId }) => {
  useEffect(() => {
    // Load AtomPaynetz script
    const cdnScript = document.createElement('script');
    cdnScript.setAttribute('src', `https://pgtest.atomtech.in/staticdata/ots/js/atomcheckout.js?v=${Date.now()}`);
    
    cdnScript.onload = () => {
      console.log("AtomPaynetz script loaded successfully.");
      
      // Event listener for AtomPaynetz responses
      const handleMessage = ({ data }) => {
        if (data === "cancelTransaction") {
          console.log("Payment has been cancelled by the user!");
        }
        if (data === "sessionTimeout") {
          console.log("Session Timeout");
        }
        if (data.ndpsResponse) {
          console.log("ndpsResponse response found");
          console.log(data.ndpsResponse.merchId);
          console.log(data.ndpsResponse.encData);
        }
      };

      window.addEventListener('message', handleMessage);

      // Clean up event listener on unmount
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    };

    document.head.appendChild(cdnScript);
  }, []);

  const openPay = () => {
    const options = {
      atomTokenId: token,
      merchId: merchId,
      custEmail: "test.user@gmail.com",
      custMobile: "8888888888",
      returnUrl: "http://localhost:3000/api/response"  // replace with your return URL
    };
    let atom = new AtomPaynetz(options, 'uat');
  };

  return (
    <div className="container my-5">
      <h3>Merchant Shop</h3>
      <p>Transaction Id: {txnId}</p>
      <p>Atom Token Id: {token}</p>
      <p>Pay Rs. 100</p>
      <button className="btn btn-primary" onClick={openPay}>Pay Now</button>
    </div>
  );
};

export async function getServerSideProps() {
  // Fetch token from API
  const response = await fetch('http://localhost:3000/api/auth');
  const data = await response.json();
  console.log(data);

  const token = data.token;
  const txnId = data.txnId;
  const merchId = data.merchId;

  return {
    props: {
      token,
      txnId,
      merchId,
    },
  };
}

export default Home;
