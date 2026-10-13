FROM node:20-alpine

WORKDIR /app

# Copy all project files
COPY . .

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose default port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
