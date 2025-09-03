import { ethers } from 'ethers';

export default function PayWithEthereum({ token, navigate, children }) {
  async function handlePayWithEth() {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        alert('MetaMask is not installed. Please install it to continue.');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const prep = await fetch('/api/checkout/prepare', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());

      const amountWei = ethers.parseEther(prep.amountETH.toString());

      const tx = await signer.sendTransaction({
        to: prep.sellers[0].address,
        value: amountWei,
      });

      const result = await fetch('/api/checkout/ebooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          txHash: tx.hash,
          amountETH: prep.amountETH,
          rateUsed: prep.rateUsed,
        }),
      }).then((r) => r.json());

      if (!result.orderId)
        throw new Error(result.message || 'Order creation failed');

      navigate(`/orders/${result.orderId}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <button className='btn btn-success' onClick={handlePayWithEth}>
      {children || 'Pay with ETH'}
    </button>
  );
}
