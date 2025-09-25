import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'https://veena-jj-backend.vercel.app';

export default function Success() {
  const [params] = useSearchParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const orderId = params.get('order_id')
    if (!orderId) {
      navigate('/failure?reason=missing_order_id')
      return
    }
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/order/${orderId}`)
        if (!data?.order) throw new Error('Order not found')
        const ord = data.order
        // If not paid, redirect to failure page with status reason
        if (ord?.order_status && ord.order_status !== 'PAID') {
          navigate(`/failure?reason=${encodeURIComponent(ord.order_status)}`)
          return
        }
        setOrder(ord)
      } catch (e) {
        setError(e?.message || 'Failed to fetch order')
      }
    })()
  }, [params, navigate])

  if (error) return (
    <div>
      <h2>Payment Verification Failed</h2>
      <p style={{ color: 'red' }}>{error}</p>
      <Link to="/">Back to Plans</Link>
    </div>
  )

  if (!order) return <p>Verifying payment...</p>

  const txns = order?.payments || []
  const status = order?.order_status

  return (
    <div>
      <h2>Payment Success</h2>
      <p>Order ID: {order.order_id}</p>
      <p>Status: {status}</p>
      <p>Amount: ₹{order.order_amount} {order.order_currency}</p>
      {txns.length > 0 && (
        <div>
          <h3>Transactions</h3>
          <ul>
            {txns.map(t => (
              <li key={t.cf_payment_id}>
                {t.payment_status} - {t.payment_group} - {t.payment_message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link to="/">Back to Plans</Link>
    </div>
  )
}


