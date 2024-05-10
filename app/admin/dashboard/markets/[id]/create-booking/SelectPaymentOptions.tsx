const SelectPaymentOptions = ({setIsPayNowSelected} : {
  setIsPayNowSelected: (value: boolean) => void;
}) => {
  return (
    <section>
      <h2 className="font-bold">
        Payment Option
      </h2>

      <div className="flex flex-col gap-4">
        <label htmlFor="pay-option-full" className="flex items-center gap-2">
          <input
            type="radio"
            id="pay-option-full"
            name="payment-option"
            className=""
            value="paid-in-full"
            onClick={() => setIsPayNowSelected(true)}
            />
          <span>Paid in full</span>
        </label>
        <label htmlFor="pay-option-deposit" className="flex items-center gap-2">
          <input
            type="radio"
            id="pay-option-deposit"
            name="payment-option"
            className=""
            value="deposit"
            onClick={() => setIsPayNowSelected(false)}
          />
          <span>Deposit</span>
        </label>
      </div>

      <h2 className="font-bold">Payment Types</h2>
      <div className="flex flex-col gap-4">
        <label htmlFor="pay-now" className="flex items-center gap-2">
          <input
            type="radio"
            id="pay-now"
            name="payment-type"
            className=""
            value="cash"
          />
          <span>Cash</span>
        </label>
        <label htmlFor="pay-later" className="flex items-center gap-2">
          <input
            type="radio"
            id="pay-later"
            name="payment-type"
            className=""
            value="stripe"
          />
          <span>Stripe</span>
          <input type="text" name="stripePaymentId" placeholder="Stripe Payment Id" className="border border-black rounded-lg p-4" />
        </label>
      </div>
    </section>
  );
}

export default SelectPaymentOptions;