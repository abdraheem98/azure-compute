# RetailCo Serverless Functions — Order Confirmation & Nightly Report

Two small Azure Functions demonstrating the "bursty, event-driven" compute pattern from Module 4 — work that shouldn't live on the always-on VMSS, because it's short-lived, unpredictable in timing, and should cost nothing between runs.

## Project Structure

```
retailco-functions/
├── host.json                          # Functions runtime config
├── package.json
├── order-confirmation/
│   ├── function.json                  # HTTP trigger binding
│   └── index.js                       # simulates sending an order confirmation
└── nightly-report/
    ├── function.json                  # Timer trigger binding
    └── index.js                       # simulates a nightly reporting job
```

## What Each Function Does

**`order-confirmation` (HTTP trigger)**
Simulates the "order placed → confirmation sent" flow. Accepts an `orderId` and `email` (via query string or POST body), returns a JSON confirmation. In a real system this would call an actual email service (SendGrid, etc.) instead of just returning JSON.

**`nightly-report` (Timer trigger)**
Simulates a nightly reporting job — runs on a schedule (`0 0 0 * * *` = midnight daily), logs a mock order count and revenue figure, then goes back to costing nothing until the next run. This is the exact workload theory called out as a poor fit for always-on compute.

---

## Deploy Steps (Portal Only — No CLI Required)

### Step 1 — Create the Function App

1. Azure Portal → **Function App** → **+ Create**
2. Resource group: your existing group (same one as your VM/VMSS work)
3. Function App name: `retailco-functions-<yourinitials>` (must be globally unique across Azure)
4. Publish: **Code**
5. Runtime stack: **Node.js**, Version: **18 LTS**
6. Hosting: **Consumption (Serverless)** — this is what gives scale-to-zero behavior
7. Region: same as your other resources
8. **Review + create** → **Create**

### Step 2 — Create the HTTP-Triggered Function

1. Function App → left menu → **Functions** → **+ Create**
2. Development environment: **Develop in portal**
3. Template: **HTTP trigger**
4. Name: `order-confirmation`
5. Authorization level: **Function**
6. **Create**
7. Click into the new function → **Code + Test**
8. Replace the default boilerplate with the contents of `order-confirmation/index.js` from this repo
9. **Save**

**Test it:**
1. In **Code + Test**, click **Get Function Url** and copy it
2. Run:
   ```bash
   curl "https://retailco-functions-<yourinitials>.azurewebsites.net/api/order-confirmation?code=<function-key>&orderId=1234&email=test@retailco.com"
   ```
3. Expect a JSON response with `"status": "confirmed"`

### Step 3 — Create the Timer-Triggered Function

1. Functions → **+ Create** → Develop in portal
2. Template: **Timer trigger**
3. Name: `nightly-report`
4. Schedule (NCRONTAB): `0 0 0 * * *`
5. **Create** → **Code + Test** → replace with `nightly-report/index.js` contents → **Save**

**Test it without waiting for midnight:**
1. **Code + Test** → **Test/Run** → **Run**
2. Check the **Logs** pane for `Nightly report starting...` and `Report generated...` output

**Optional — see it fire on a visible interval during a demo:**
Temporarily change the schedule (function's **Integration** tab) to `0 */2 * * * *` (every 2 minutes). Remember to change it back to `0 0 0 * * *` afterward.

### Step 4 — Confirm Scale-to-Zero

1. Function App → **Overview** — notice there's no "instance count" setting like VMSS has; that's deliberate.
2. Leave both functions idle for a few minutes.
3. Go to either function → **Monitor** → **Invocations** — activity only appears exactly when you called it, nothing running in between.
4. Compare this to the VMSS project: that had instances running (and billing) continuously regardless of traffic. These functions cost nothing between invocations.

---

## Local Development (Optional)

If you want to run these locally before deploying, install the Azure Functions Core Tools, then from the project root:

```bash
npm install
func start
```

This starts a local runtime and gives you local URLs for both functions to test against before pushing to Azure.

## Next Step / Extension Idea

Right now `order-confirmation` is triggered manually via HTTP. The more realistic version of this pattern — matching the Module 1 discussion of "order confirmation emails triggered by a queue message" — would swap the HTTP trigger for a **Storage Queue trigger**, so the function fires automatically when an order-placed message lands in a queue, with volume scaling automatically from near-zero to spikes without any manual intervention.