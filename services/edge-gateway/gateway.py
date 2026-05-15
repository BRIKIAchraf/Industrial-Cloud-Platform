import paho.mqtt.client as mqtt
import json
import time

LOCAL_BROKER = "localhost"
CLOUD_BROKER = "localhost" # Simulating cloud on same broker for now
LOCAL_TOPIC = "factory/telemetry/+"
CLOUD_TOPIC = "cloud/telemetry"
ALARM_TOPIC = "cloud/alarms"

def on_connect(client, userdata, flags, rc):
    print(f"Edge Gateway connected to local broker")
    client.subscribe(LOCAL_TOPIC)

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        machine_id = payload.get("machine_id")
        metrics = payload.get("metrics", {})
        
        # Local AI / Analytics: Predictive Maintenance & Threshold Monitoring
        health_score = 100
        if metrics.get("vibration", 0) > 0.15:
            health_score -= 30
        if metrics.get("temp", 0) > 75.0:
            health_score -= 20
        
        payload["health_score"] = health_score

        if metrics.get("temp", 0) > 85.0:
            alarm = {
                "machine_id": machine_id,
                "type": "CRITICAL_TEMP",
                "value": metrics["temp"],
                "timestamp": payload["timestamp"],
                "msg": f"Temperature too high on {machine_id}: {metrics['temp']}°C"
            }
            client.publish(ALARM_TOPIC, json.dumps(alarm))
            print(f"ALARM: High temperature on {machine_id}")

        # Forwarding to Cloud
        client.publish(f"{CLOUD_TOPIC}/{machine_id}", json.dumps(payload))
        
    except Exception as e:
        print(f"Edge Gateway error: {e}")

def run_gateway():
    client = mqtt.Client("Edge_Gateway")
    client.on_connect = on_connect
    client.on_message = on_message
    
    client.connect(LOCAL_BROKER, 1883, 60)
    client.loop_forever()

if __name__ == "__main__":
    run_gateway()
