

## About

Reference Industry 4.0 architecture bridging simulated PLC/OPC-UA systems with Node-RED, MQTT, Kafka, time-series storage and operational monitoring.
# Industrial Cloud Platform

Reference architecture connecting simulated operational technology (OT) to cloud-style data services for monitoring and controlled industrial commands.

## Objective

Demonstrate a complete OT/IT path:

~~~text
PLC / OPC-UA simulator
        ↓
Node-RED edge gateway
        ↓ MQTT
Mosquitto broker → Kafka event backbone
        ↓
InfluxDB time-series storage
        ↓
Grafana operations dashboards
~~~

## Architecture components

| Layer | Technology | Responsibility |
|---|---|---|
| Simulation | Factory I/O or Python OPC-UA simulator | Machine and sensor events |
| PLC protocol | OPC-UA | Industrial machine interface |
| Edge gateway | Node-RED | Protocol translation and routing |
| Messaging | Mosquitto MQTT, Apache Kafka | Decoupling and event transport |
| Storage | InfluxDB | Telemetry and time-series queries |
| Monitoring | Grafana | Dashboards and operational signals |
| Identity | Keycloak | Authentication and role-based access concept |

## Key scenarios

- real-time telemetry from simulated machines;
- START/STOP/RESET commands routed through the edge boundary;
- logical separation between OT and IT networks;
- time-series monitoring of production signals;
- audit-oriented handling of control actions;
- dashboard visibility for operators and engineers.

## Quick start

~~~bash
docker compose up -d
~~~

For the OT simulator:

~~~bash
cd services/ot-simulator
pip install -r requirements.txt
python simulator.py
~~~

The Node-RED flow publishes telemetry to the factory MQTT topic:

~~~text
factory/line1/telemetry
~~~

Typical local interfaces:

- Node-RED: http://localhost:1880
- Grafana: http://localhost:3000
- InfluxDB: http://localhost:8086

## Engineering considerations

The project focuses on protocol boundaries, message routing, time-series storage and observability. Production deployment would require tested authentication, encrypted transport, command authorization, network segmentation, retention policies and failure-injection tests.

## Status

Portfolio architecture and local industrial simulation. Hardware integration, security hardening and production-scale validation remain future work.

## Author

**Achraf BRIKI** · [LinkedIn](https://www.linkedin.com/in/achrafbriki/) · [Portfolio](https://achrafbriki.com)

## Delivery profile

**Status:** Prototype  
**Demo:** Local Docker environment with Node-RED, MQTT, Kafka, InfluxDB and Grafana.  
**Prerequisites:** Docker Compose and Python for the OPC-UA simulator.  
**Validation:** Telemetry delivery, command validation, broker restart and OT/IT separation.  
**Performance plan:** Measure messages/second, MQTT-to-Kafka latency, write throughput and recovery time.  
**Roadmap:** Integration tests, TLS, service authentication, retention policies and recovery objectives.
