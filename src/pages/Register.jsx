import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {register} = useAuth()
    const navigate = useNavigate()
    async function handleRegister() {
        if(email ==='' || password==='') {
            setError('Please fill in all fields')
            return 
        }
        if(password!== confirmPassword) {
            setError('Passwords do not match!')
            return 
        }
        try {
            setError('')
            setLoading(true)
            await register(email, password)
            navigate ('/')
        } catch(err) {
            setError('Failed to create account. Email may already be in use .')
        }
        setLoading(false)
    }
    return (
            <div className="auth-container">
      <div className="auth-card">
        <h2>🛡️ Create Account</h2>
        <p>Join SafeHer to stay protected</p>

        {error && <p className="auth-error">{error}</p>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="auth-input"
          onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
        />
        <button
          onClick={handleRegister}
          disabled={loading}
          className="auth-btn"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
