
export const clerkLoginAppearance = {
  variables: {
    colorBackground: "transparent",
    colorPrimary: "white",
    colorText: "#000",
    borderRadius: "10px",
    colorTextOnPrimaryBackground: "white",
    colorInputBackground: "white",
    colorInputText: "black",
  },
  elements: {
    card: {
      boxShadow: "none",
      
    },
    
    
    header: {
      display: "none",
    },
    formFieldLabel: {
      color: "black",
    },
    formFieldInput: {
      color: "black",
      background: "",
      border: "1px solid #707070",
    },
    formFieldAction__password: {
      color: "black",
      "&:hover": {
        color: "gray",
      }
    },
    socialButtons: {
      background: "black",
      borderRadius: "0.5rem",
      color: "white"
    },
    socialButtonsBlockButtonText__google: {
      color: "white",
    },
    formButtonPrimary: {
      color: "white",
      backgroundColor: "black",  
    },
 
    footerActionLink: {
      color: "black",
      "&:hover": {
        color: "gray",
      }
    },
    formResendCodeLink: {
      color: "#C5B5A4",
    },
    
  },
}