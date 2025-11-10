import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Grid, Paper, Button } from '@material-ui/core';
import { useAuth } from '../../../contexts/AuthContext';
import './change-password.css';

export default function ChangePassword() {
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
                setMessage('Password changed successfully!');
                setFormData({
                    password: '',
                    confirmPassword: ''
                });
                setTimeout(() => {
                    history.push('/profile');
                }, 2000);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Password change error:', err);
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
                    <h3>Change Password</h3>
                    <h4>
                        <Link to="/">Home</Link>
                        <label>/</label>
                        <Link to="/profile">Profile</Link>
                        <label>/</label>
                        Change Password
                    </h4>
                    <div className="clearfix"></div>
                </div>
            </div>

            <div className="change-password-container">
                <Grid container>
                    <Grid item xs={12} sm={2} md={3} lg={3}></Grid>
                    <Grid item xs={12} sm={8} md={6} lg={6}>
                        <Paper className="change-password-paper">
                            <h3>Change Your Password</h3>
                            <p className="change-password-description">
                                Enter a new password below to change your password.
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

                            <form onSubmit={handleSubmit} className="change-password-form">
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter new password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                        fullWidth
                                    >
                                        {loading ? 'Updating...' : 'Change Password'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={() => history.push('/profile')}
                                        disabled={loading}
                                        fullWidth
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={2} md={3} lg={3}></Grid>
                </Grid>
            </div>
        </div>
    );
}
