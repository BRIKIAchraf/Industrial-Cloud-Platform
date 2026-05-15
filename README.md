# Industrial Cloud Platform (Professional Stack)

A complete Industry 4.0 architecture bridging OT and IT. For a deep dive into the architecture, protocols, and data flows, please refer to the **[Technical Documentation](file:///C:/Users/Ashra/.gemini/antigravity/brain/577a59d5-ea94-46f4-888f-441465530740/DOCUMENTATION.md)**.

## 🏗️ Architecture Stack
| Level | Software | Role |
| :--- | :--- | :--- |
| **Simulation** | Factory I/O (Ext) | Machine & Sensor Simulation |
| **PLC** | CODESYS (Simulated) | Industrial Automation Logic (OPC-UA Server) |
| **Edge Gateway**| Node-RED | OPC-UA Client & MQTT Publisher |
| **Broker** | Mosquitto | Real-time Messaging Hub |
| **Streaming** | Apache Kafka | Industrial Event Streaming |
| **Storage** | InfluxDB | Time-series Telemetry Data |
| **Monitoring** | Grafana | Industrial Dashboards |
| **Identity** | Keycloak | Security & RBAC |

## 🚀 Getting Started

### 1. Infrastructure
```bash
docker-compose up -d
```
Starts: Mosquitto, InfluxDB, PostgreSQL, Node-RED, Grafana, Kafka, and Keycloak.

### 2. OT Simulation (PLC)
The PLC is simulated using a Python OPC-UA server:
```bash
cd services/ot-simulator
pip install -r requirements.txt
python simulator.py
```

### 3. Edge Gateway (Node-RED)
Access Node-RED at `http://localhost:1880`.
The flow in `infra/nodered/data/flows.json` is pre-configured to:
1.  Connect to `opc.tcp://ot-simulator:4840`
2.  Publish to `factory/line1/telemetry` via MQTT.

### 4. Monitoring (Grafana)
Access Grafana at `http://localhost:3000` (admin/adminpassword).
Import the dashboard from `infra/grafana/dashboards/factory_main.json`.

## 🛠 Features
- **Real-time Monitoring**: Live telemetry from simulated PLC/Robots.
- **Remote Control**: START/STOP/RESET commands routed through Cloud -> Edge -> OT.
- **Edge Intelligence**: Local threshold monitoring and alarm generation.
- **Industrial Design**: High-performance dashboard with glassmorphism and real-time charts.
- **Time-Series Storage**: Telemetry stored in InfluxDB for historical analysis.

## 🔒 Security Principles
- **Separation of Concerns**: OT and IT networks are logically separated via the Edge Gateway.
- **Command Validation**: All commands are routed through an authenticated API Gateway.
- **Audit Logging**: All control actions are logged (Simulated).
