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
    uri = "http://industrial.cloud.platform"
    idx = await server.register_namespace(uri)

    # 🏭 FACTORY STRUCTURE
    factory = await server.nodes.objects.add_folder(idx, "Global_Factory")
    
    # --- LINE 1: ASSEMBLY LINE (High Precision) ---
    line1 = await factory.add_folder(idx, "Assembly_Line_01")
    robot = await line1.add_folder(idx, "ABB_Robot_Arm")
    r_pos = await robot.add_variable(idx, "Position_XYZ", [0.0, 0.0, 0.0])
    r_torque = await robot.add_variable(idx, "Joint_Torque", 0.0)
    r_temp = await robot.add_variable(idx, "Motor_Temperature", 35.0)
    r_status = await robot.add_variable(idx, "Status", "IDLE")

    # --- LINE 2: FLUID PROCESSING (Chemical/Oil) ---
    line2 = await factory.add_folder(idx, "Fluid_Processing_02")
    tank = await line2.add_folder(idx, "Chemical_Tank_A")
    t_level = await tank.add_variable(idx, "Liquid_Level", 0.0)
    t_temp = await tank.add_variable(idx, "Liquid_Temperature", 22.0)
    t_valve = await tank.add_variable(idx, "Valve_State", False)
    t_flow = await tank.add_variable(idx, "Output_Flow_Rate", 0.0)

    # --- LINE 3: PACKAGING & LOGISTICS ---
    line3 = await factory.add_folder(idx, "Packaging_Line_03")
    conveyor = await line3.add_folder(idx, "Main_Conveyor")
    c_speed = await conveyor.add_variable(idx, "Belt_Speed", 0.0)
    c_vibration = await conveyor.add_variable(idx, "Bearing_Vibration", 0.02)
    c_load = await conveyor.add_variable(idx, "Load_Weight", 0.0)
    c_counter = await conveyor.add_variable(idx, "Items_Processed", 0)

    # Set command nodes to writable
    for node in [r_status, t_valve, c_speed]:
        await node.set_writable()

    print(f"Starting Industrial OPC-UA Factory at opc.tcp://0.0.0.0:4840")
    async with server:
        while True:
            # --- ROBOT LOGIC ---
            rs = await r_status.get_value()
            if rs == "RUNNING":
                await r_torque.write_value(45.2 + random.uniform(-2, 2))
                await r_temp.write_value(min(90, (await r_temp.get_value()) + 0.1))
                await r_pos.write_value([random.uniform(0, 100) for _ in range(3)])
            else:
                await r_temp.write_value(max(35, (await r_temp.get_value()) - 0.2))

            # --- TANK LOGIC ---
            tv = await t_valve.get_value()
            cl = await t_level.get_value()
            if tv: # Valve open
                await t_level.write_value(max(0, cl - 0.5))
                await t_flow.write_value(15.5 + random.uniform(-0.5, 0.5))
            else:
                await t_level.write_value(min(100, cl + 0.2)) # Slow filling
                await t_flow.write_value(0.0)

            # --- CONVEYOR LOGIC ---
            cs = await c_speed.get_value()
            if cs > 0:
                await c_vibration.write_value(0.05 + (cs/100) + random.uniform(-0.01, 0.01))
                await c_load.write_value(random.uniform(10, 50))
                if random.random() > 0.8:
                    cur_count = await c_counter.get_value()
                    await c_counter.write_value(cur_count + 1)

            await asyncio.sleep(0.5)

if __name__ == "__main__":
    asyncio.run(main())
