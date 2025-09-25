import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import CardMembershipIcon from '@mui/icons-material/CardMembership'

const API_BASE = 'http://localhost:5000';

const plans = [
  { id: 'bronze', title: 'Bronze Subscription (VeenaJJ - Pro)', subtitle: 'Unlimited Monthly Access to VeenaJJ Music', price: 399, icon: <MilitaryTechIcon sx={{ color: '#d2691e' }} /> },
  { id: 'silver', title: 'Silver Subscription (VeenaJJ - Pro)', subtitle: 'Unlimited Half Yearly Access to VeenaJJ Music', price: 1499, icon: <EmojiEventsIcon sx={{ color: '#c0c0c0' }} /> },
  { id: 'gold', title: 'Gold Subscription (VeenaJJ - Pro)', subtitle: 'Unlimited Annual Access to VeenaJJ Music', price: 1999, icon: <WorkspacePremiumIcon sx={{ color: '#DAA520' }} /> },
  { id: 'trial', title: '2 Days Free Trial', subtitle: 'Access all songs for free during this trial period Note:After this free trial period you will not be charged until you choose any of the above paid subscriptions', price: 0, expired: true, icon: <CardMembershipIcon color="disabled" /> },
]

export default function Plans() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const startCheckout = async (amount) => {
    try {
      setLoading(true)
      setError('')
      const { data } = await axios.post(`${API_BASE}/api/create-order`, {
        customer_name: user?.name || 'Customer',
        customer_email: user?.email || 'customer@example.com',
        customer_phone: user?.phone || '9999999999',
        amount
      })
      if (!data?.order?.payment_session_id) {
        throw new Error('Could not get payment_session_id')
      }
      const { load } = await import('@cashfreepayments/cashfree-js');
      // const mode = (import.meta.env.VITE_CASHFREE_ENV === 'production') ? 'production' : 'sandbox'
      const cashfreeInstance = await load({ mode: 'production' })
      const checkoutOptions = {
        paymentSessionId: data.order.payment_session_id,
        redirectTarget: '_self'
      }
      cashfreeInstance.checkout(checkoutOptions)
    } catch (e) {
      console.error(e)
      setError(e?.message || 'Failed to start payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ bgcolor: '#f6f4fb', minHeight: '100vh', pb: 10 }}>
      <Paper square sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: '#f6f4fb' }}>
        <Typography variant="h6" align="center" sx={{ py: 2 }}>Subscription</Typography>
        <Divider />
      </Paper>
      {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
      <Box>
        {plans.map((p, idx) => (
          <Box key={p.id} sx={{ px: 2 }}>
            {idx !== 0 && <Divider />}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, opacity: p.expired ? 0.5 : 1 }}>
              <Box sx={{ fontSize: 32 }}>
                {p.icon}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">{p.title}</Typography>
                <Typography variant="body2" color="text.secondary">{p.subtitle}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>{p.price === 0 ? '' : `₹ ${p.price}`}</Typography>
                {p.expired ? (
                  <Chip label="Already Expired" size="small" />
                ) : (
                  <Button variant="text" onClick={() => startCheckout(p.price)} disabled={loading}>Subscribe</Button>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Paper square sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2 }}>
        <Button fullWidth variant="contained" sx={{ bgcolor: '#0d6efd' }} startIcon={null}>
          Restore Purchase
        </Button>
      </Paper>
    </Box>
  )
}

