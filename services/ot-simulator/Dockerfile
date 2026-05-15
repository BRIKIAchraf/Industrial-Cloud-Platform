FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run both simulators using a small supervisor script or just one for now
# For simplicity, we'll run a shell script that starts both
CMD ["sh", "-c", "python simulator.py & python modbus_simulator.py"]
