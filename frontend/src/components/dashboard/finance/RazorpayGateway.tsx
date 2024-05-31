import { Button } from "@/components/ui/button";
import { MouseEvent, useEffect, useRef } from "react";

export default function RazorpayGateway() {
  // const Razorpay = useRef<any>(null);
  const loaded = useRef<boolean>(false);

  useEffect(() => {
    const scriptTag = document.createElement("script");
    scriptTag.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(scriptTag);

    scriptTag.onload = () => {
      loaded.current = true;
    };
  }, []);

  async function pay(event: MouseEvent<HTMLElement>) {
    // TODO: Do a basic fetch to fetch order info
    let orderId = "order_OH9Ecja5k9PiK9";
    let amount = 5000;

    if (loaded.current) {
      let options = {
        key_id: "rzp_test_0LGTNFXkqWdoSH",
        amount: amount, // In paise
        currency: "INR",
        name: "MSDC",
        description: "Test Transaction",
        //   image: "https://example.com/your_logo",
        order_id: orderId,
        callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
        // Customer
        prefill: {
          name: "ABC",
          email: "email@gmail.com",
          contact: "1111111111",
        },
        notes: {
          address: "MSDC",
        },
        theme: {
          color: "#1E293B",
        },
      };

      // TODO: Find a better way to escape type checks
      const razorpay = new (window as any).Razorpay(options);

      razorpay.open();
      event.preventDefault();
    }
  }

  return (
    <>
      <div>
        <div id="razorpay"></div>
        <Button onClick={pay}>Pay</Button>
      </div>
    </>
  );
}
