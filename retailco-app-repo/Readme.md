# RetailCo Order-Management Demo App

Minimal Node.js/Express app for Module 4 — demonstrates load balancing (hostname identification) and real health-probe behavior (a togglable dependency check, not just "process is up").

## Endpoints

- `GET /` — returns the instance's hostname and a timestamp
- `GET /health` — returns 200 if `dependencyHealthy` is true, 503 if false (this is what the Load Balancer / Application Gateway probe should check)
- `GET /toggle-dependency` — demo-only, flips the health flag on this specific instance without killing it

## Run Locally

```bash
npm install
npm start
```

## Deploy on an Azure VM or VMSS Instance (via SSH)

```bash
sudo apt-get update
sudo apt-get install -y nodejs npm git

git clone https://github.com/<your-username>/<your-repo>.git retailco-app
cd retailco-app
npm install --production

sudo cp deploy/retailco-app.service /etc/systemd/system/retailco-app.service
sudo systemctl daemon-reload
sudo systemctl enable retailco-app
sudo systemctl start retailco-app

curl http://localhost:8080/health
```

See the parent Module 4 project's `deploy/` scripts for Application Gateway wiring and autoscale configuration.