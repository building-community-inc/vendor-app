"use client";

import { useEffect, useState } from "react";
import { SignUp } from "@clerk/nextjs";

const SignUpForm = () => {
  //   const [isInstagramBrowser, setIsInstagramBrowser] = useState(false);
  const [userAgent, setUserAgent] = useState("");
  // const userAgent = userAgent()
  useEffect(() => {
    // Client-side check for user agent as 'headers()' is server-only in App Router
    const userAgent = navigator.userAgent || "";
    setUserAgent(userAgent);

    // Simple checks for common Instagram in-app browser indicators
    const isInstagram = userAgent.includes("Instagram");
    const isWebkit = userAgent.includes("webkit"); // Most browsers use webkit, so be cautious

    // More specific checks to reduce false positives
    // const androidInstagram =
    //   userAgent.includes("Instagram") && userAgent.includes("Android");
    // const iosInstagram =
    //   userAgent.includes("Instagram") &&
    //   (userAgent.includes("iPhone") || userAgent.includes("iPad"));

    // setIsInstagramBrowser(isInstagram);
  }, []);

  return (
    <div className="mx-auto flex flex-col items-center px-5 gap-5">
      {userAgent.includes("Instagram") && (
        <p className="mt-4 text-sm text-gray-500">
          For the best Google login experience, please open this page in your
          device's browser (e.g., Chrome, Safari).
        </p>
      )}
      <SignUp
        appearance={{
          elements: {
            //   googl
            dividerRow: userAgent.includes("Instagram")
              ? {
                  //   googleButton: {
                  display: "none",
                  //   },
                }
              : {
                  //   googleButton: {},
                },
            socialButtons: userAgent.includes("Instagram")
              ? {
                  //   googleButton: {
                  display: "none",
                  //   },
                }
              : {
                  //   googleButton: {},
                },
          },
        }}
      />
    </div>
  );
};

export default SignUpForm;
