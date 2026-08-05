import { useState } from 'react';
import {
  DEFAULT_ADMIN_PROFILE,
  validatePasswordChange,
  validateProfileUpdate,
} from './profileData';

/**
 * Account + password form state for Admin My Profile.
 */
export default function useAdminProfile(initialProfile = DEFAULT_ADMIN_PROFILE) {
  const [displayName, setDisplayName] = useState(initialProfile.displayName);
  const [displayEmail, setDisplayEmail] = useState(initialProfile.displayEmail);
  const [name, setName] = useState(initialProfile.name);
  const [email, setEmail] = useState(initialProfile.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNameChange = (value) => {
    setName(value);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handleCurrentPasswordChange = (value) => {
    setCurrentPassword(value);
  };

  const handleNewPasswordChange = (value) => {
    setNewPassword(value);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
  };

  /**
   * @param {(key: string) => string} t
   * @returns {boolean}
   */
  const submitProfile = (t) => {
    const next = validateProfileUpdate({ name, email }, t);
    if (Object.keys(next).length > 0) {
      setProfileErrors(next);
      return false;
    }
    setProfileErrors({});
    setDisplayName(name.trim());
    setDisplayEmail(email.trim());
    return true;
  };

  /**
   * @param {(key: string) => string} t
   * @returns {boolean}
   */
  const submitPassword = (t) => {
    const next = validatePasswordChange(
      { currentPassword, newPassword, confirmPassword },
      t,
    );
    if (Object.keys(next).length > 0) {
      setPasswordErrors(next);
      return false;
    }
    setPasswordErrors({});
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    return true;
  };

  return {
    displayName,
    displayEmail,
    name,
    email,
    currentPassword,
    newPassword,
    confirmPassword,
    profileErrors,
    passwordErrors,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    handleNameChange,
    handleEmailChange,
    handleCurrentPasswordChange,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleToggleShowCurrentPassword: () => setShowCurrentPassword((show) => !show),
    handleToggleShowNewPassword: () => setShowNewPassword((show) => !show),
    handleToggleShowConfirmPassword: () => setShowConfirmPassword((show) => !show),
    submitProfile,
    submitPassword,
  };
}
