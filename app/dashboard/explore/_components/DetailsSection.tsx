import "./details.css"
const NewDetailsSection = ({ datesToDisplay, hours, loadInInstructions, phone }: {
  datesToDisplay: string;
  hours?: string;
  loadInInstructions?: string | null;
  phone?: string
}) => {
  return (
    <details className="market-details border-t-2 border-[#C5B5A4]">
      <summary className="text-center cursor-pointer">See Details</summary>
      <div className={`details w-full flex p-10 flex-col border-b-2 border-[#C5B5A4] 
      `}>
        <div className="flex flex-col">
          <strong>Dates</strong>
          <span>{datesToDisplay}</span>
        </div>
        {hours && (
          <div className="flex flex-col">
            <strong>Hours</strong>
            <span>{hours}</span>
          </div>
        )}
        {phone && (
          <div className="flex flex-col">
            <strong>Phone</strong>
            <span>{phone}</span>
          </div>
        )}
        {loadInInstructions && (

          <div className="flex flex-col">
            <strong>Load In Instructions:</strong>
            <span>{loadInInstructions}</span>
          </div>
        )}
      </div>
    </details>
  )
}

export default NewDetailsSection;