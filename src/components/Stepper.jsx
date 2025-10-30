export default function Stepper({ currentStep }) {
  const steps = [1, 2, 3];

  return (
    <div className="flex justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center w-full">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center 
            text-white font-bold 
            ${currentStep >= step ? "bg-blue-500" : "bg-gray-300"}`}
          >
            {step}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 w-full ${
                currentStep > step ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
