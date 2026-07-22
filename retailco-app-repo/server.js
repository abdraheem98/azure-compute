const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 8080;

// Simulates a real dependency (e.g., a DB connection pool) being healthy or not.
// In a real app this would be an actual check against SQL/Redis/etc.
// Here it's just an in-memory flag so we can flip it on demand during the demo.
let dependencyHealthy = true;

app.get('/', (req, res) => {
  res.json({
    message: 'RetailCo order-management app',
    hostname: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

// This is the endpoint the Application Gateway / Load Balancer health probe hits.
// It deliberately checks "dependencyHealthy" rather than just returning 200 always -
// that's the difference between a shallow probe and a real one, covered in theory.
app.get('/health', (req, res) => {
  if (dependencyHealthy) {
    res.status(200).json({ status: 'healthy', hostname: os.hostname() });
  } else {
    res.status(503).json({ status: 'unhealthy', hostname: os.hostname() });
  }
});

// DEMO-ONLY endpoint: lets you simulate a dependency failure on ONE specific
// instance without deallocating it, so you can watch the health probe react
// before doing the harder "kill the whole instance" test.
app.get('/toggle-dependency', (req, res) => {
  dependencyHealthy = !dependencyHealthy;
  res.json({ dependencyHealthy, hostname: os.hostname() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, hostname ${os.hostname()}`);
});