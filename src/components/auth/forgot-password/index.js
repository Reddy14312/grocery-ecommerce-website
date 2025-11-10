import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './forgot-password.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { resetPassword } = useAuth();

    const validateForm = () => {
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const { error: resetError } = await resetPassword(email);

            if (resetError) {
                setError(resetError.message);
            } else {
                setMessage('Password reset link has been sent to your email. Please check your inbox.');
                setEmail('');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Password reset error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError('');
    };

    return (
        <div>
            <div className="banner-top">
                <div className="container">
                    <h3>Forgot Password</h3>
                    <h4><Link to="/">Home</Link><label>/</label>Forgot Password</h4>
                    <div className="clearfix"></div>
                </div>
            </div>

            <div className="login">
                <div className="main-agileits">
                    <div className="form-w3agile">
                        <h3>Reset Password</h3>
                        <p className="reset-description">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="alert alert-success" role="alert">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="key">
                                <i className="fa fa-envelope" aria-hidden="true" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    disabled={loading}
                                    required
                                />
                                <div className="clearfix" />
                            </div>

                            <input
                                type="submit"
                                value={loading ? "Sending..." : "Send Reset Link"}
                                disabled={loading}
                            />
                        </form>

                        <div className="forg">
                            <Link to="/login" className="forg-left">Back to Login</Link>
                            <Link to="/register" className="forg-right">Register</Link>
                            <div className="clearfix" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
