import axios from 'axios';

/**
 * Verify a Flutterwave payment transaction.
 * @param {string} transactionId - The transaction ID to verify.
 * @returns {Promise<object>} - Returns the transaction data if successful.
 */
export async function verifyPayment(transactionId: string) {
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`, // Secure this key in your environment variables
        },
      }
    );

    // Ensure the payment was successful
    const data = response.data;
    if (data.status === 'success' && data.data.status === 'successful') {
      return data.data; // Return transaction details
    } else {
      throw new Error('Payment verification failed');
    }
  } catch (error) {
    console.error('Payment verification error:', error.message);
    throw new Error('Could not verify payment');
  }
}
