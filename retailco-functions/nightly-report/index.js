module.exports = async function (context, myTimer) {
    const timestamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        context.log('Nightly report function is running late');
    }

    context.log(`Nightly report starting at ${timestamp}`);

    // In a real implementation, this would query the SQL database from
    // Modules 1-3 and generate an actual report. For this demo, we just
    // simulate the work and log a result - the point is the SCHEDULE and
    // SCALE-TO-ZERO behavior, not the report content itself.
    const mockOrderCount = Math.floor(Math.random() * 500) + 100;
    const mockRevenue = (mockOrderCount * 47.5).toFixed(2);

    context.log(`Report generated: ${mockOrderCount} orders, $${mockRevenue} revenue`);
    context.log('Nightly report complete - function will scale back to zero until tomorrow');
};