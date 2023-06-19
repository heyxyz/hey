FROM nvidia/cuda:11.7.0-runtime-ubuntu20.04

# Set non-interactive mode
ARG DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3 python3-pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Install Python dependencies
RUN pip install -r requirements.txt

# Download models
RUN python3 download_models.py

# Expose port
EXPOSE 8000

# Run the application
CMD ["python3", "app.py"]
