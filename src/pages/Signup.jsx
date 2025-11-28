import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Auth.module.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ADOPTER', // Default role in uppercase
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert role to uppercase before setting state
    const newValue = name === 'role' ? value.toUpperCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate the form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    if ((formData.role === 'SHELTER' || formData.role === 'ADMIN') && !formData.address) {
      newErrors.address = 'Address is required for shelter/admin accounts';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage('');
 
    try {
      // Send data to backend
      const response = await axios.post('http://localhost:8082/api/auth/register', formData);

      setSuccessMessage('Account created successfully! You can now login.');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'ADOPTER',
        phone: '',
        address: ''
      });
    } catch (error) {
      setErrors({ apiError: error.response?.data || 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Create Account</h1>
          <p className={styles.authSubtitle}>Join PetHome and help pets find loving homes</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? styles.inputError : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? styles.inputError : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role" className="form-label">Account Type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="ADOPTER">Pet Adopter</option>
              <option value="SHELTER">Shelter/Pet Owner</option>
              <option value="ADMIN">Administrator</option>
            </select>
            {formData.role === 'SHELTER' && (
              <small className={styles.roleDescription}>
                As a shelter, you can list pets for adoption and manage adoption requests.
              </small>
            )}
            {formData.role === 'ADMIN' && (
              <small className={styles.roleDescription}>
                Administrators can manage all users and verify shelter accounts.
              </small>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-input ${errors.phone ? styles.inputError : ''}`}
              placeholder="Enter your phone number"
            />
            {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
          </div>

          {/* Address */}
          {(formData.role === 'SHELTER' || formData.role === 'ADMIN') && (
            <div className="form-group">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`form-input ${errors.address ? styles.inputError : ''}`}
                placeholder="Enter your address"
                rows="3"
              />
              {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
            </div>
          )}

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? styles.inputError : ''}`}
              placeholder="Enter your password"
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? styles.inputError : ''}`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
          </div>

          {/* API error */}
          {errors.apiError && <p className={styles.errorMessage}>{errors.apiError}</p>}

          {/* Success message */}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary ${styles.authButton}`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>
            Already have an account?{' '}
            <Link to="/login" className={styles.authLink}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
