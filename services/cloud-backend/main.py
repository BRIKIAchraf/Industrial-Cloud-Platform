from fastapi import FastAPI, BackgroundTasks
import paho.mqtt.client as mqtt
import json
import asyncio
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from datetime import datetime
import os

app = FastAPI(title="Industrial Cloud Platform API")

# Configuration (In production use env vars)
INFLUX_URL = "http://localhost:8086"
INFLUX_TOKEN = "adminpassword" # Simplified for demo
INFLUX_ORG = "industrial_org"
INFLUX_BUCKET = "telemetry"
MQTT_BROKER = "localhost"

# Global state for latest data
latest_telemetry = {}
active_alarms = []

# InfluxDB Client
client_influx = InfluxDBClient(url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG)
write_api = client_influx.write_api(write_options=SYNCHRONOUS)

def on_mqtt_message(client, userdata, msg):
    global active_alarms
    try:
        topic = msg.topic
        payload = json.loads(msg.payload.decode())
        
        if "telemetry" in topic:
            machine_id = payload.get("machine_id")
            latest_telemetry[machine_id] = payload
            
            # Store in InfluxDB
            point = Point("machine_data") \
                .tag("machine_id", machine_id) \
                .field("status", payload["status"])
            
            for k, v in payload["metrics"].items():
                if isinstance(v, (int, float)):
                    point.field(k, v)
                elif isinstance(v, list):
                    for i, val in enumerate(v):
                        point.field(f"{k}_{i}", val)
            
            write_api.write(bucket=INFLUX_BUCKET, record=point)
            
        elif "alarms" in topic:
            active_alarms.insert(0, payload)
            if len(active_alarms) > 50:
                active_alarms.pop()
                
    except Exception as e:
        print(f"MQTT Processing Error: {e}")

# MQTT Startup
def start_mqtt():
    client = mqtt.Client("Cloud_Backend")
    client.on_message = on_mqtt_message
    client.connect(MQTT_BROKER, 1883, 60)
    client.subscribe("cloud/telemetry/#")
    client.subscribe("cloud/alarms")
    client.loop_start()

@app.on_event("startup")
async def startup_event():
    start_mqtt()

@app.get("/api/v1/monitoring/latest")
async def get_latest_monitoring():
    return latest_telemetry

@app.get("/api/v1/alarms")
async def get_alarms():
    return active_alarms

@app.post("/api/v1/control")
async def send_command(command: dict):
    # command format: {"machine_id": "PLC_01", "command": "START"}
    client = mqtt.Client("Cloud_Commander")
    client.connect(MQTT_BROKER, 1883, 60)
    client.publish(f"factory/commands/{command['machine_id']}", json.dumps(command))
    client.disconnect()
    return {"status": "command_sent", "details": command}

@app.post("/api/v1/ota/update")
async def trigger_ota(update: dict):
    # update format: {"machine_id": "PLC_01", "version": "v1.2.3"}
    client = mqtt.Client("Cloud_OTA_Manager")
    client.connect(MQTT_BROKER, 1883, 60)
    
    ota_payload = {
        "action": "FIRMWARE_UPDATE",
        "machine_id": update["machine_id"],
        "version": update["version"],
        "checksum": "sha256_mock_abc123",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    client.publish(f"factory/ota/{update['machine_id']}", json.dumps(ota_payload))
    client.disconnect()
    return {"status": "ota_started", "details": update}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
