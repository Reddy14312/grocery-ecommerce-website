import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './reset-password.css';

export default function ResetPassword() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { updatePassword } = useAuth();
    const history = useHistory();

    const validateForm = () => {
        const { password, confirmPassword } = formData;

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
            const { error: updateError } = await updatePassword(formData.password);

            if (updateError) {
                setError(updateError.message);
            } else {
                setMessage('Password updated successfully! Redirecting to login...');
                setTimeout(() => {
                    history.push('/login');
                }, 2000);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Password update error:', err);
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
                    <h3>Reset Password</h3>
                    <h4><Link to="/">Home</Link><label>/</label>Reset Password</h4>
                    <div className="clearfix"></div>
                </div>
            </div>

            <div className="login">
                <div className="main-agileits">
                    <div className="form-w3agile">
                        <h3>Create New Password</h3>
                        <p className="reset-description">
                            Please enter your new password below.
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
                                <i className="fa fa-lock" aria-hidden="true" />
                                <input
                                    type="password"
                                    placeholder="New Password"
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
                                    placeholder="Confirm New Password"
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
                                value={loading ? "Updating..." : "Update Password"}
                                disabled={loading}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
