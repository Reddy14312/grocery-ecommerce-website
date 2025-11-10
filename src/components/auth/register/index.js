import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './register.css';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { signUp, isAuthenticated } = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (isAuthenticated) {
            history.replace('/');
        }
    }, [isAuthenticated, history]);

    const validateForm = () => {
        const { name, email, password, confirmPassword } = formData;

        if (!name.trim()) {
            setError('Name is required');
            return false;
        }

        if (name.trim().length < 2) {
            setError('Name must be at least 2 characters');
            return false;
        }

        if (!email.trim()) {
            setError('Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!password) {
            setError('Password is required');
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
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
            const { error: signUpError } = await signUp(
                formData.email,
                formData.password,
                { name: formData.name }
            );

            if (signUpError) {
                if (signUpError.message.includes('already registered')) {
                    setError('This email is already registered. Please login instead.');
                } else if (signUpError.message.includes('password')) {
                    setError('Password must be at least 6 characters');
                } else {
                    setError(signUpError.message);
                }
            } else {
                setMessage('Registration successful! You can now login.');
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                setTimeout(() => {
                    history.push('/login');
                }, 2000);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    return (
        <div>
            <div className="banner-top">
                <div className="container">
                    <h3>Register</h3>
                    <h4><Link to="/">Home</Link><label>/</label>Register</h4>
                    <div className="clearfix"></div>
                </div>
            </div>

            <div className="login">
                <div className="main-agileits">
                    <div className="form-w3agile form1">
                        <h3>Register</h3>

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
                                <i className="fa fa-user" aria-hidden="true" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                />
                                <div className="clearfix" />
                            </div>

                            <div className="key">
                                <i className="fa fa-envelope" aria-hidden="true" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                />
                                <div className="clearfix" />
                            </div>

                            <div className="key">
                                <i className="fa fa-lock" aria-hidden="true" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                />
                                <div className="clearfix" />
                            </div>

                            <div className="key">
                                <i className="fa fa-lock" aria-hidden="true" />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                />
                                <div className="clearfix" />
                            </div>

                            <input
                                type="submit"
                                value={loading ? "Creating Account..." : "Register"}
                                disabled={loading}
                            />
                        </form>

                        <div className="forg register-links">
                            <p>Already have an account? <Link to="/login">Login here</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
