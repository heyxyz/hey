FROM node:alpine

# Set the working directory
WORKDIR /lenster/packages/sns

# Copy pnpm-workspace.yaml from monorepo root
COPY ../../../pnpm-workspace.yaml /lenster/

# Copy the current package (sns) 
COPY . .

# If you have other packages in the /packages directory that sns depends on,
# you'll need to copy them too. For example:
COPY ../../config /lenster/packages/config
COPY ../../lib /lenster/packages/lib

# Copy any other necessary files, such as the .env.example file
COPY .env.example .env

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --recursive

# Expose the port
EXPOSE 5001

# Start the app
CMD ["npm", "start"]
