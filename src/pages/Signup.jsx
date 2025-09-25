import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      const { data } = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password, phone })
      if (!data?.success) throw new Error(data?.message || 'Signup failed')
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
            <Typography variant="h4" fontWeight={700}>Create an account</Typography>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={onSubmit}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Name</Typography>
            <TextField value={name} onChange={e => setName(e.target.value)} fullWidth />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Email</Typography>
            <TextField type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Phone</Typography>
            <TextField value={phone} onChange={e => setPhone(e.target.value)} fullWidth />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Password</Typography>
            <TextField type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2, py: 1.2, background: 'linear-gradient(180deg,#1f2937,#0f172a)' }}>
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </Box>

          <Divider>or</Divider>

          <Stack spacing={1}>
            <Button variant="outlined" fullWidth startIcon={<GoogleIcon />}>Sign up with Google</Button>
            <Button variant="outlined" fullWidth startIcon={<FacebookIcon color="primary" />}>Sign up with Facebook</Button>
          </Stack>

          <Typography variant="body2" align="center">
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  )
}


