module.exports = async function (context, req) {
    const orderId = (req.query.orderId || (req.body && req.body.orderId)) || Math.floor(Math.random() * 100000);
    const customerEmail = (req.query.email || (req.body && req.body.email)) || "customer@example.com";

    context.log(`Processing order confirmation for order ${orderId}`);

    // In a real implementation, this would call an email service (SendGrid, etc.)
    // For this demo, we just simulate the confirmation and return it.
    const confirmation = {
        orderId: orderId,
        email: customerEmail,
        status: "confirmed",
        message: `Order ${orderId} confirmed - confirmation would be sent to ${customerEmail}`,
        processedAt: new Date().toISOString()
    };

    context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: confirmation
    };
};