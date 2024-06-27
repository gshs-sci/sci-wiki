# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm i

# Copy the entire project directory to the working directory
COPY . .

RUN npm run prisma:generate

# Expose the port on which the Next.js application will run
EXPOSE 3000
# debugging port for prisma studio
EXPOSE 5555
# Set the command to start the Next.js application
CMD ["npm", "run", "dev"]