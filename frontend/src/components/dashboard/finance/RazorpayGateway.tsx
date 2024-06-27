import { useAuth } from "@/components/AuthProvider";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useOrder } from "@/lib/dashboard/finance";
import { Student } from "@/lib/dashboard/students";
import { MouseEvent, useEffect, useRef } from "react";

export interface RazorpayGatewayProps {
  amount: number;
  student: Student;
}

export default function RazorpayGateway({
  amount,
  student,
}: RazorpayGatewayProps) {
  const loaded = useRef<boolean>(false);
  const { token } = useAuth();
  const { data, trigger, isMutating, error } = useOrder(amount);
  const { toast } = useToast();

  useEffect(() => {
    const scriptTag = document.createElement("script");
    scriptTag.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(scriptTag);

    scriptTag.onload = () => {
      loaded.current = true;
    };
  }, []);

  async function pay(event: MouseEvent<HTMLElement>) {
    await trigger({ token: token });

    // TODO: Handle error UI
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to create the payment",
      });
      return;
    }
    let orderId = data!.id;

    if (loaded.current) {
      let options = {
        key: "rzp_test_0LGTNFXkqWdoSH",
        amount: amount, // In paise
        currency: "INR",
        name: "MSDC",
        description: "Test Transaction",
        //   image: "https://example.com/your_logo",
        order_id: orderId,
        callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
        // Customer
        prefill: {
          name: student.user.value.name,
          email: student.user.value.email,
          contact: student.number,
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
      <div id="razorpay"></div>
      <Button disabled={isMutating} onClick={pay}>
        {isMutating ? <Spinner size={"12"} /> : "Pay"}
      </Button>
    </>
  );
}
