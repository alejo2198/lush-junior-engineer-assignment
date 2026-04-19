FROM node:20-slim

WORKDIR /app

# Install dependencies first to maximize Docker layer caching.
COPY package*.json ./
RUN npm ci

# Copy application source.
COPY . .

# Generate Prisma client inside the container image.
RUN npx prisma generate

EXPOSE 4000

# Apply migrations and seeding on startup, then run the API.
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start"]
