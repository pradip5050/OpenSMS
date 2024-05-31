import { Button } from "@/components/ui/button";
import { MouseEvent, useEffect, useRef } from "react";

export default function RazorpayGateway() {
  const Razorpay = useRef(null);

  useEffect(() => {
    let options = {
      key_id: "rzp_test_sBx6tHv6MbbSSV",
      amount: "50000", // In paise
      currency: "INR",
      name: "MSDC",
      description: "Test Transaction",
      //   image: "https://example.com/your_logo",
      order_id: "",
      callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
      // Customer
      prefill: {
        name: "Sagar Kumar",
        email: "ragas5432100@gmail.com",
        contact: "9035908111",
      },
      notes: {
        address: "MSDC",
      },
      theme: {
        color: "#1E293B",
      },
    };

    const scriptTag = document.createElement("script");
    scriptTag.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(scriptTag);

    scriptTag.onload = () => {
      Razorpay.current = new window.Razorpay(options);
    };
  }, [Razorpay]);

  function pay(event: MouseEvent<HTMLElement>) {
    if (Razorpay.current) {
      console.log("heii");
      Razorpay.current.open();
      event.preventDefault();
    }
  }

  return (
    <>
      <script async src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <div>
        <div id="razorpay"></div>
        <Button onClick={pay} id="rzp-button1">
          Pay
        </Button>
      </div>
    </>
  );
}
