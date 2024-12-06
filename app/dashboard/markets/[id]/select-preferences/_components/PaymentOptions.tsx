import Box from "./Box";

const PaymentOptions = ({
  areTablesSelected,
  credits,
  dueNow,
  totalToPay,
  // isEventInLessThan60Days,
  isPayNowSelected,
  setIsPayNowSelected,
  useCredits,
  setUseCredits,
  creditsToUse,
  setCreditsToUse,
  totalWithHst
}: {
  isEventInLessThan60Days: boolean | null | 0;
  isPayNowSelected: boolean;
  setIsPayNowSelected: (value: boolean) => void;
  totalToPay: number | null;
  dueNow: number;
  credits: number | null | undefined;
  areTablesSelected: boolean;
  useCredits: boolean;
  setUseCredits: (value: boolean) => void;
  creditsToUse: number;
  setCreditsToUse: (value: number) => void;
  totalWithHst: number;
}) => {

  return (
    <Box className="items-start font-darker-grotesque text-black">
      <h2 className="text-black font-bold">Payment Options</h2>
      {areTablesSelected ? (
        <>
          {/* Commenting out the deposit option */}
          {/* <label htmlFor="pay-now" className="flex text-[19px] items-center gap-2 relative z-10">
            <input type="radio" name="pay-now" className="accent-title-color pointer-events-none relative z-[2]" id="pay-now" checked={isPayNowSelected} onChange={() => setIsPayNowSelected(true)} />
            <span className="text-black">Pay in Full</span>
          </label>
         {!isEventInLessThan60Days && (
            <>
              <label htmlFor="pay-later" className="flex text-[19px] items-center gap-2 relative z-10" onClick={() => setIsPayNowSelected(false)}>
                <input
                  type="radio"
                  name="pay-later"
                  id="pay-later"
                  className="border-red-200 accent-title-color pointer-events-none relative z-[2]"
                  checked={!isPayNowSelected}
                  onChange={() => setIsPayNowSelected(false)}
                />
                <span>Deposit</span>
              </label>
              <p>Vendors can pay a $50/day non-refundable deposit to secure their table reservation. The remaining amount of the booking is due 60 days before the first day of the market</p>
            </>
          )} */}
          {credits && credits > 0 && (
            <label htmlFor="pay-with-credits" className="flex text-[19px] items-center gap-2 relative z-10">
              <input
                type="checkbox"
                checked={useCredits}
                onChange={(e) => {
                  setUseCredits(e.currentTarget.checked)
                }}
                name="pay-with-credits"
                className="pointer-events-none relative z-[2] accent-title-color"
                id="pay-with-credits"
              />
              <span>Use Credit (available credit: ${credits})</span>
              {useCredits && <input
                value={creditsToUse}
                onChange={(e) => setCreditsToUse(+e.target.value)}
                type="number"
                max={totalToPay || 0}
                placeholder={`${totalToPay}` || ""}
                min={0}
                name="credits-applied"
                className="border border-[#777571] font-darker-grotesque outline-[#777571] rounded-md px-1 w-[8ch] "
              />
              }
            </label>
          )}

          {typeof totalToPay === "number" ? (
            totalToPay < 1 ? (

              <span className="">* Please select at least one date and a table</span>
            ) : (
              <section className="flex flex-col gap-2 font-darker-grotesque">
                <h3 className="font-bold">Price:</h3>
                <span>${totalToPay}</span>
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
                  <h3 className="font-bold">HST:</h3>
                  <p>${(dueNow * .13).toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-bold">{isPayNowSelected ? "Total Booking Cost" : "Total Deposit"}:</h3>
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