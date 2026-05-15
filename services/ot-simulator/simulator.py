import asyncio
import random
from asyncua import ua, Server
from datetime import datetime

async def main():
    # Setup Server
    server = Server()
    await server.init()
    server.set_endpoint("opc.tcp://0.0.0.0:4840/freeopcua/server/")
    server.set_server_name("Industrial_CODESYS_Simulator")

    # Setup namespace
    uri = "http://factory.simulation.io"
    idx = await server.register_namespace(uri)

    # Create Objects/Folders
    factory = await server.nodes.objects.add_folder(idx, "Factory_Line_1")
    plc = await server.nodes.objects.add_folder(idx, "CODESYS_PLC_01")

    # Add Variables (Sensors)
    temp_node = await plc.add_variable(idx, "Temperature", 25.0)
    pressure_node = await plc.add_variable(idx, "Pressure", 1.0)
    vibration_node = await plc.add_variable(idx, "Vibration", 0.05)
    power_node = await plc.add_variable(idx, "PowerUsage", 0.0)
    status_node = await plc.add_variable(idx, "Status", "IDLE")

    # Set variables to be writable (for commands)
    await temp_node.set_writable()
    await status_node.set_writable()

    # Start Server
    print(f"Starting OPC-UA Server (PLC Simulator) at opc.tcp://0.0.0.0:4840")
    async with server:
        while True:
            # Simulate PLC Logic
            current_status = await status_node.get_value()
            
            if current_status == "RUNNING":
                # Fluctuations
                t = await temp_node.get_value() + random.uniform(-0.1, 0.2)
                p = max(0, await pressure_node.get_value() + random.uniform(-0.05, 0.05))
                v = max(0, 0.05 + random.uniform(-0.01, 0.02))
                pow_val = 12.5 + random.uniform(-0.5, 0.5)

                await temp_node.write_value(t)
                await pressure_node.write_value(p)
                await vibration_node.write_value(v)
                await power_node.write_value(pow_val)
            else:
                await power_node.write_value(0.1)

            await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main())
