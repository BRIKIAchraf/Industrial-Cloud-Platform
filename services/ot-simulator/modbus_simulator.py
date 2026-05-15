from pymodbus.server import StartTcpServer
from pymodbus.device import ModbusDeviceIdentification
from pymodbus.datastore import ModbusSequentialDataBlock, ModbusSlaveContext, ModbusServerContext
import random
import threading
import time

def update_context(context):
    """Simulates real-world Modbus data changes"""
    while True:
        # Register 0: Voltage (220-240)
        voltage = random.randint(220, 240)
        # Register 1: Current (0-50)
        current = random.randint(10, 50)
        # Register 2: Power (V*I)
        power = (voltage * current) // 100
        
        context[0].setValues(3, 0, [voltage, current, power])
        time.sleep(1)

def run_server():
    # Setup data store (discrete inputs, coils, holding registers, input registers)
    store = ModbusSlaveContext(
        di=ModbusSequentialDataBlock(0, [0]*100),
        co=ModbusSequentialDataBlock(0, [0]*100),
        hr=ModbusSequentialDataBlock(0, [0]*100),
        ir=ModbusSequentialDataBlock(0, [0]*100)
    )
    context = ModbusServerContext(slaves=store, single=True)
    
    # Start background update
    t = threading.Thread(target=update_context, args=(context,))
    t.daemon = True
    t.start()

    identity = ModbusDeviceIdentification()
    identity.VendorName = 'Industrial-Cloud-Platform'
    identity.ProductCode = 'Modbus-PLC-Sim'
    identity.VendorUrl = 'http://github.com/industrial'
    identity.ProductName = 'Virtual-Energy-Meter'
    identity.ModelName = 'EM-3000'
    identity.MajorMinorRevision = '1.0'

    print("Starting Modbus TCP Server on 0.0.0.0:5020")
    StartTcpServer(context=context, identity=identity, address=("0.0.0.0", 5020))

if __name__ == "__main__":
    run_server()
