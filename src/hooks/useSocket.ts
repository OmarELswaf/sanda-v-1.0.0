import { useEffect } from "react";
import { socket } from "@/lib/socket";

export const useSocket = <TData = Record<string, unknown>>(event: string, callback: (data: TData) => void) => {
  useEffect(() => {
    const listener = callback as (data: Record<string, unknown>) => void;

    socket.on(event, listener);

    return () => {
      socket.off(event, listener);
    };
  }, [event, callback]);

  return socket;
};

export const useSocketConnect = () => {
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);
};
