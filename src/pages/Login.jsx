import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      // Allow quick access without credentials
      if (!email && !password) {
        login('guest-token', { id: 'guest', name: 'Guest User', email: 'guest@example.com' })
        navigate('/')
        return
      }
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      if (!data?.success) throw new Error(data?.message || 'Login failed')
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6, backgroundColor: 'hsl(0, 0%, 99%)' }}>
      <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px,hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px' }}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h4" fontWeight={700}>Sign in</Typography>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={onSubmit}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Email</Typography>
            <TextField type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} fullWidth size="medium" />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Password</Typography>
            <TextField type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
            <FormControlLabel control={<Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} />} label="Remember me" sx={{ mt: 1 }} />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 1.5, py: 1.2, background: 'linear-gradient(180deg,#1f2937,#0f172a)' }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 1 }}>Forgot your password?</Typography>

          <Divider>or</Divider>

          <Stack spacing={1}>
            <Button variant="outlined" fullWidth startIcon={<GoogleIcon />}>Sign in with Google</Button>
            <Button variant="outlined" fullWidth startIcon={<FacebookIcon color="primary" />}>Sign in with Facebook</Button>
          </Stack>

          <Typography variant="body2" align="center">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  )
}


