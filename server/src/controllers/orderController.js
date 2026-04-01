exports.getOrderStatus = (req, res) => {
  const { orderId } = req.params;
  
  const statuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  res.json({
    orderId,
    status: randomStatus,
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString(), // +3 days
    carrier: 'Fast-Track Logistics'
  });
};

exports.createReturn = (req, res) => {
  const { orderId, reason } = req.body;
  if (!orderId) return res.status(400).json({ error: 'Order ID required' });

  const rmaCode = 'RMA-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  res.json({
    success: true,
    orderId,
    returnCode: rmaCode,
    status: 'Return Authorized',
    instructions: 'Please package your item securely, attach the RMA code, and drop it off at any authorized shipping center within 14 days.'
  });
};

exports.getRefundStatus = (req, res) => {
  const { id } = req.params;
  res.json({
    refundId: id,
    status: 'Processing',
    amount: '₹ ' + (Math.floor(Math.random() * 5000) + 500),
    expectedArrival: '3-5 Business Days'
  });
};
