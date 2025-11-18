import React from "react";
import { EventSelection } from "../../components/Cliente/Compras/EventSelection";
import {
  BuyerInformation,
  type BuyerData,
} from "../../components/Cliente/Compras/BuyerInformation";
import { OrderSummary } from "../../components/Cliente/Compras/OrderSummary";
import { Confirmation } from "../../components/Cliente/Compras/Confirmation";
import HeaderEbentos from "../../components/Cliente/HeaderEbentos";
import Footer from "../../components/Cliente/Footer";

type Step = "selection" | "information" | "summary" | "confirmation";

export default function App() {
  const [currentStep, setCurrentStep] = React.useState<Step>("selection");
  const [selectedTickets, setSelectedTickets] = React.useState<{
    [key: string]: number;
  }>({});
  const [buyerData, setBuyerData] = React.useState<BuyerData | null>(null);

  const handleTicketSelection = (tickets: { [key: string]: number }) => {
    setSelectedTickets(tickets);
    setCurrentStep("information");
  };

  const handleBuyerInformation = (data: BuyerData) => {
    setBuyerData(data);
    setCurrentStep("summary");
  };

  const handleConfirm = () => {
    setCurrentStep("confirmation");
  };

  const handleStartOver = () => {
    setSelectedTickets({});
    setBuyerData(null);
    setCurrentStep("selection");
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case "selection":
        return 1;
      case "information":
        return 2;
      case "summary":
        return 3;
      case "confirmation":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <>
      <div style={{ minHeight: "100vh", backgroundColor: "#EEF0FF" }}>
        {/* Header Spacer - Reserved for existing header */}
        <HeaderEbentos />

        {/* Progress Indicator */}
        {currentStep !== "confirmation" && (
          <div
            style={{
              backgroundColor: "white",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <div
              style={{
                maxWidth: "1400px",
                margin: "0 auto",
                padding: "1rem 1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                {/* Step 1 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      backgroundColor:
                        getStepNumber() >= 1 ? "#0f62fe" : "#e5e5e5",
                      color: getStepNumber() >= 1 ? "white" : "#525252",
                    }}
                  >
                    1
                  </div>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: getStepNumber() >= 1 ? "#0f62fe" : "#525252",
                    }}
                  >
                    Selección
                  </span>
                </div>

                {/* Line 1-2 */}
                <div
                  style={{
                    flex: 1,
                    height: "2px",
                    marginBottom: "2rem",
                    backgroundColor:
                      getStepNumber() >= 2 ? "#0f62fe" : "#d1d1d1",
                  }}
                ></div>

                {/* Step 2 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      backgroundColor:
                        getStepNumber() >= 2 ? "#0f62fe" : "#e5e5e5",
                      color: getStepNumber() >= 2 ? "white" : "#525252",
                    }}
                  >
                    2
                  </div>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: getStepNumber() >= 2 ? "#0f62fe" : "#525252",
                    }}
                  >
                    Información
                  </span>
                </div>

                {/* Line 2-3 */}
                <div
                  style={{
                    flex: 1,
                    height: "2px",
                    marginBottom: "2rem",
                    backgroundColor:
                      getStepNumber() >= 3 ? "#0f62fe" : "#d1d1d1",
                  }}
                ></div>

                {/* Step 3 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      backgroundColor:
                        getStepNumber() >= 3 ? "#0f62fe" : "#e5e5e5",
                      color: getStepNumber() >= 3 ? "white" : "#525252",
                    }}
                  >
                    3
                  </div>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: getStepNumber() >= 3 ? "#0f62fe" : "#525252",
                    }}
                  >
                    Resumen
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div style={{ padding: "3rem 1.5rem" }}>
          {currentStep === "selection" && (
            <EventSelection onNext={handleTicketSelection} />
          )}

          {currentStep === "information" && (
            <BuyerInformation
              onNext={handleBuyerInformation}
              onBack={() => setCurrentStep("selection")}
            />
          )}

          {currentStep === "summary" && buyerData && (
            <OrderSummary
              tickets={selectedTickets}
              buyerData={buyerData}
              onBack={() => setCurrentStep("information")}
              onConfirm={handleConfirm}
            />
          )}

          {currentStep === "confirmation" && (
            <Confirmation onStartOver={handleStartOver} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
