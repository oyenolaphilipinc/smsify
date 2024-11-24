import axios from 'axios';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const { transaction_id } = req.query;

    try {
      const response = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Payment verification failed' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
