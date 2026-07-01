// hooks/useMqttTopic.ts
"use client";

import { useEffect, useRef, useState } from "react";
import mqtt, { MqttClient } from "mqtt";

type MqttMessage = {
  topic: string;
  payload: string;
  connected: boolean;
  error: string | null;
};

export function useMqttTopic(topic: string) {
  const clientRef = useRef<MqttClient | null>(null);
  const [data, setData] = useState<MqttMessage>({
    topic: "",
    payload: "",
    connected: false,
    error: null,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (!topic) return;

    const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_URL as string, {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME || undefined,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD || undefined,
      reconnectPeriod: 3000,
      connectTimeout: 30_000,
    });

    clientRef.current = client;

    client.on("connect", (t) => {
      setData((prev) => ({ ...prev, connected: true, error: null }));

      client.subscribe(topic, { qos: 0 }, (err) => {
        if (err) {
          setData((prev) => ({
            ...prev,
            error: `Subscribe failed: ${err.message}`,
          }));
        }
      });
    });

    client.on("message", (receivedTopic, message) => {
      if (receivedTopic === topic) {
        setData({
          topic: receivedTopic,
          payload: message.toString(),
          connected: true,
          error: null,
        });
      }
    });

    client.on("error", (err) => {
      setData((prev) => ({
        ...prev,
        connected: false,
        error: err.message,
      }));
    });

    client.on("close", () => {
      setData((prev) => ({ ...prev, connected: false }));
    });

    return () => {
      if (client.connected) {
        client.unsubscribe(topic);
      }
      client.end(true);
    };
  }, [topic]);

  return data;
}
