# Jones County XC

A full-stack web application with a React frontend and Go backend.

## Project Structure

```
jones-county-xc/
├── frontend/     # React app (Vite + Tailwind CSS)
├── backend/      # Go HTTP server
├── docs/         # Documentation
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Go (v1.21+)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at http://localhost:5173

### Backend

```bash
cd backend
go run main.go
```

The backend runs at http://localhost:8080

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/hello` | GET | Returns greeting message |

## Development

Run both servers simultaneously:
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && go run main.go`

The frontend is configured to proxy API requests to the backend with CORS enabled for local development.

## Deployment

Deployment scripts are in the `/deploy` folder for deploying to an Ubuntu server (e.g., AWS Lightsail).

### First-time Server Setup

1. SSH into your server and copy the deploy folder:
   ```bash
   scp -r deploy/ ubuntu@your-server-ip:~/
   ```

2. Run the setup script on the server:
   ```bash
   ssh ubuntu@your-server-ip
   chmod +x ~/deploy/*.sh
   ~/deploy/server-setup.sh
   ```

3. Set up MySQL database:
   ```bash
   sudo mysql_secure_installation
   sudo mysql -e "CREATE DATABASE jonescountyxc;"
   sudo mysql -e "CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'your-password';"
   sudo mysql -e "GRANT ALL PRIVILEGES ON jonescountyxc.* TO 'appuser'@'localhost';"
   ```

4. Configure nginx and systemd:
   ```bash
   ~/deploy/configure-server.sh
   ```

5. Update the database password in the service file:
   ```bash
   sudo nano /etc/systemd/system/jonescountyxc.service
   sudo systemctl daemon-reload
   ```

### Deploying Updates

1. Edit `deploy/deploy.sh` and set your server IP and SSH key path

2. Run from your local machine:
   ```bash
   ./deploy/deploy.sh
   ```

### SSL Setup (Optional)

After pointing your domain to the server:
```bash
./deploy/setup-ssl.sh your-domain.com
```


