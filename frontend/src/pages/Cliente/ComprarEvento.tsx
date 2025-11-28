import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const { eventoId } = useParams<{ eventoId?: string }>();
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

  // Timeout: 4 minutes to complete the whole flow. If it expires,
  // redirect back to the event detail page for the same eventoId.
  const timeoutRef = React.useRef<number | undefined>(undefined);
  const intervalRef = React.useRef<number | undefined>(undefined);
  const endTimeRef = React.useRef<number | undefined>(undefined);
  const initialMs = 4 * 60 * 1000; // 4 minutes
  const [remainingMs, setRemainingMs] = React.useState<number>(initialMs);

  React.useEffect(() => {
    // start timeout on mount
    const ms = initialMs;
    const end = Date.now() + ms;
    endTimeRef.current = end;

    const id = window.setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      if (eventoId) {
        navigate(`/cliente/ver-detalle-evento/${eventoId}`);
      } else {
        navigate("/home");
      }
    }, ms);
    timeoutRef.current = id as unknown as number;

    // start interval to update remaining time every second
    intervalRef.current = window.setInterval(() => {
      if (!endTimeRef.current) return;
      const rem = Math.max(0, endTimeRef.current - Date.now());
      setRemainingMs(rem);
    }, 1000) as unknown as number;

    // initialize remaining immediately
    setRemainingMs(Math.max(0, end - Date.now()));

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      endTimeRef.current = undefined;
    };
    // we intentionally include eventoId and navigate so redirect works correctly if they change
  }, [eventoId, navigate]);

  // if the user reaches confirmation (purchase finished), clear the timeout/interval
  React.useEffect(() => {
    if (currentStep === "confirmation") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      endTimeRef.current = undefined;
    }
  }, [currentStep]);

  const formatMs = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const isLowTime = remainingMs <= 60 * 1000; // 1 minute or less

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
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
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
                      Pago
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

              {/* Timer (derecha) */}
              <div
                style={{
                  marginLeft: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  style={{
                    padding: "0.35rem 0.6rem",
                    borderRadius: 8,
                    backgroundColor: isLowTime ? "#fff1f1" : "#f4f6fb",
                    color: isLowTime ? "#a10000" : "#0f62fe",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.02)",
                    border: isLowTime
                      ? "1px solid rgba(161,0,0,0.15)"
                      : undefined,
                  }}
                >
                  Tiempo restante: {formatMs(remainingMs)}
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
