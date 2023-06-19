FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt update && apt install -y \
    python3 python3-pip \
    && rm -rf /var/lib/apt/lists

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

RUN ls
# Install Python dependencies
RUN pip install -r requirements.txt

# Download models
RUN python3 download_models.py

# Expose port
EXPOSE 5000

# Run the application
CMD ["flask", "run"]
