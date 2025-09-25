import { useSearchParams, Link } from 'react-router-dom'

export default function Failure() {
  const [params] = useSearchParams()
  const reason = params.get('reason') || 'Payment failed or cancelled.'
  return (
    <div>
      <h2>Payment Failed</h2>
      <p>{reason}</p>
      <Link to="/">Back to Plans</Link>
    </div>
  )
}


