import Box from "./Box";

const PaymentOptions = ({
  areTablesSelected,
  availableCredits,
  dueNow,
  totalToPay,
  useCredits,
  setUseCredits,
  creditsToUse,
  setCreditsToUse,
  totalWithHst
}: {
  isEventInLessThan60Days: boolean | null | 0;
  totalToPay: number | null;
  dueNow: number;
  availableCredits: number | null | undefined;
  areTablesSelected: boolean;
  useCredits: boolean;
  setUseCredits: (value: boolean) => void;
  creditsToUse: number;
  setCreditsToUse: (value: number) => void;
  totalWithHst: number;
}) => {
  const hst = +(dueNow * .13).toFixed(2);
  const total = dueNow + hst;
  const newCreditsToUse = availableCredits ? total > availableCredits ? availableCredits : total : 0;


  const onCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreditsToUse(newCreditsToUse);
  }

  return (
    <Box className="items-start font-darker-grotesque text-black">
      <h2 className="text-black font-bold">Payment Options</h2>
      {areTablesSelected ? (
        <>
          {availableCredits && availableCredits > 0 ? (
            <div className="flex gap-2">
              <label htmlFor="pay-with-credits" className="flex text-[19px] items-center gap-2 relative z-10">
                <input
                  type="checkbox"
                  checked={useCredits}
                  onChange={(e) => {
                    setUseCredits(e.currentTarget.checked)
                    onCreditChange(e)
                  }}
                  value={creditsToUse}
                  name="pay-with-credits"
                  className="pointer-events-none relative z-[2] accent-title-color"
                  id="pay-with-credits"
                />
                <span>Use Credit (available credit: ${availableCredits})</span>
              </label>
              
            </div>
          ) : null}


          {typeof totalToPay === "number" ? (
            totalToPay < 1 ? (

              <span className="">* Please select at least one date and a table</span>
            ) : (
              <section className="flex flex-col gap-2 font-darker-grotesque">
                <h3 className="font-bold">Price:</h3>
                <span>${totalToPay}</span>
                <div>
                  <h3 className="font-bold">HST:</h3>
                  <p>${(dueNow * .13).toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-bold">Total With HST:</h3>
                  <p>${dueNow + +(dueNow * .13).toFixed(2)}</p>
                </div>
                {useCredits && (

                  <div className="">
                    <h3 className="font-bold">
                      Credits Applied
                    </h3>
                    <p>
                      ${creditsToUse}
                    </p>
                  </div>
                )}

                {/* Commenting out the deposit amount section */}
                {/* {!isPayNowSelected && (
                  <div className="w-full">
                    <h3 className="font-bold">Deposit Amount:</h3>
                    <span>${dueNow}</span>
                  </div>
                )} */}

                <div>
                  <h3 className="font-bold">{"Due Now"}:</h3>
                  <p>$
                    {totalWithHst.toFixed(2)}</p>
                </div>
                {/* Commenting out the amount owing section */}
                {/* {!isPayNowSelected && (
                  <div>
                    <h3 className="font-bold">Amount Owing:</h3>
                    <p>$
                      {totalToPay - dueNow}</p>
                  </div>
                )} */}

              </section>
            )
          ) : (
            <span className="text-red-400">Something went wrong</span>
          )}
        </>

      ) : (
        <p>No tables are selected</p>
      )}

    </Box>
  )
}

export default PaymentOptions;