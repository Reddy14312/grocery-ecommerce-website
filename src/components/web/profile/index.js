import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Paper, Button } from '@material-ui/core';
import { useAuth } from '../../../contexts/AuthContext';
import './profile.css';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.user_metadata?.name || '',
                phone: user.user_metadata?.phone || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }

        setLoading(true);

        try {
            const { error: updateError } = await updateProfile(formData);

            if (updateError) {
                setError(updateError.message);
            } else {
                setMessage('Profile updated successfully!');
                setEditing(false);
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Profile update error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setError('');
        setMessage('');
        if (user) {
            setFormData({
                name: user.user_metadata?.name || '',
                phone: user.user_metadata?.phone || ''
            });
        }
    };

    return (
        <div>
            <div className="banner-top">
                <div className="container">
                    <h3>My Profile</h3>
                    <h4><Link to="/">Home</Link><label>/</label>Profile</h4>
                    <div className="clearfix"></div>
                </div>
            </div>

            <div className="profile-container">
                <Grid container>
                    <Grid item xs={12} sm={2} md={2} lg={2}></Grid>
                    <Grid item xs={12} sm={8} md={8} lg={8}>
                        <Paper className="profile-paper">
                            <div className="profile-header">
                                <h3>Account Information</h3>
                                {!editing && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </div>

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

                            {editing ? (
                                <form onSubmit={handleSubmit} className="profile-form">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="disabled-input"
                                        />
                                        <small className="form-text">Email cannot be changed</small>
                                    </div>

                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={loading}
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            onClick={handleCancel}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="profile-info">
                                    <div className="info-item">
                                        <label>Full Name</label>
                                        <p>{user?.user_metadata?.name || 'Not provided'}</p>
                                    </div>

                                    <div className="info-item">
                                        <label>Email</label>
                                        <p>{user?.email || 'Not provided'}</p>
                                    </div>

                                    <div className="info-item">
                                        <label>Phone Number</label>
                                        <p>{user?.user_metadata?.phone || 'Not provided'}</p>
                                    </div>

                                    <div className="info-item">
                                        <label>Member Since</label>
                                        <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                            )}

                            <div className="profile-links">
                                <Link to="/change-password" className="profile-link">
                                    <i className="fa fa-lock" aria-hidden="true"></i>
                                    Change Password
                                </Link>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={2} md={2} lg={2}></Grid>
                </Grid>
            </div>
        </div>
    );
}
