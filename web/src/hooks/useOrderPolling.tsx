import { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GetOrderDocument } from "@/generated/graphql";
import { notifications } from "@mantine/notifications";

type OrderStatus = "CREATED" | "PAID" | "FAILED";

export function useOrderPolling() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const errorHandledRef = useRef(false);

  const {
    data,
    startPolling,
    stopPolling,
    refetch,
    error,
  } = useQuery(GetOrderDocument, {
    variables: { id: orderId as string },
    skip: !orderId,
    notifyOnNetworkStatusChange: true,
  });

  /* ===================== HANDLE QUERY ERROR ===================== */

  useEffect(() => {
    if (!error || !orderId || errorHandledRef.current) return;

    errorHandledRef.current = true;

    stopPolling();
    setOrderId(null);

    notifications.show({
      title: "Payment error",
      message: error.message,
      color: "red",
    });
  }, [error, orderId, stopPolling]);

  /* ===================== START / STOP POLLING ===================== */

  useEffect(() => {
    if (!orderId) return;

    errorHandledRef.current = false;
    startPolling(2000);

    return () => stopPolling();
  }, [orderId, startPolling, stopPolling]);

  /* ===================== TIMEOUT SAFEGUARD ===================== */

  useEffect(() => {
    if (!orderId) return;

    const timeout = setTimeout(() => {
      stopPolling();
      setOrderId(null);

      notifications.show({
        title: "Payment pending",
        message:
          "Payment confirmation is taking longer than usual. Please refresh after some time.",
        color: "orange",
      });
    }, 2 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [orderId, stopPolling]);

  /* ===================== VISIBILITY REFETCH ===================== */

  useEffect(() => {
    if (!orderId) return;

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [orderId, refetch]);

  /* ===================== EXPOSED STATE ===================== */

  const status =
    data?.getOrder?.status;

  const stop = () => {
    stopPolling();
    setOrderId(null);
  };

  return {
    start: setOrderId, // pass razorpay_order_id
    stop,
    status,
    isPolling: !!orderId,
  };
}