const formatCurrency = (amount) => {
  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount)) {
    throw new Error('Invalid numeric value for formatting as currency');
  }

  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numericAmount);

  return formattedAmount;
};

module.exports = formatCurrency;
