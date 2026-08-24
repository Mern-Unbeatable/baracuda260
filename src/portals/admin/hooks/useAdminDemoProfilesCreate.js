import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES } from '@/shared/config';
import {
  EMPTY_DEMO_PROFILE_FORM,
  appendDemoProfile,
  buildDemoProfileFromForm,
  isDemoProfileFormValid,
  isEmailValid,
  isRequiredTextValid,
} from '@/portals/admin/data/adminDemoProfilesData';

export default function useAdminDemoProfilesCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY_DEMO_PROFILE_FORM);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = (field) => (event) => {
    const nextValue = event.target.value;
    setValues((current) => ({ ...current, [field]: nextValue }));
  };

  const handleBioChange = (event) => {
    setValues((current) => ({ ...current, bio: event.target.value }));
  };

  const handleSocialLinkChange = (index) => (event) => {
    const nextValue = event.target.value;
    setValues((current) => ({
      ...current,
      socialLinks: current.socialLinks.map((link, linkIndex) =>
        linkIndex === index ? nextValue : link,
      ),
    }));
  };

  const handleAddSocialLink = () => {
    setValues((current) => ({
      ...current,
      socialLinks: [...current.socialLinks, ''],
    }));
  };

  const handleRemoveSocialLink = (index) => {
    setValues((current) => ({
      ...current,
      socialLinks:
        current.socialLinks.length <= 1
          ? ['']
          : current.socialLinks.filter((_, linkIndex) => linkIndex !== index),
    }));
  };

  const handleToggleActive = () => {
    setValues((current) => ({ ...current, isActive: !current.isActive }));
  };

  const handlePhotoChange = (field, previewField) => (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setValues((current) => ({
      ...current,
      [field]: file.name,
      [previewField]: previewUrl,
    }));
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN_DEMO_PROFILES);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAttempted(true);
    if (!isDemoProfileFormValid(values)) return;

    setSubmitting(true);
    try {
      appendDemoProfile(buildDemoProfileFromForm(values));
      toast.success(t('adminDemoProfiles.create.success'));
      navigate(ROUTES.ADMIN_DEMO_PROFILES);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    values,
    attempted,
    submitting,
    fullNameValid: isRequiredTextValid(values.fullName),
    usernameValid: isRequiredTextValid(values.username),
    phoneValid: isRequiredTextValid(values.phone),
    emailValid: isEmailValid(values.email),
    bioValid: values.bio.length <= 250,
    formValid: isDemoProfileFormValid(values),
    handleFieldChange,
    handleBioChange,
    handleSocialLinkChange,
    handleAddSocialLink,
    handleRemoveSocialLink,
    handleToggleActive,
    handleProfilePhotoChange: handlePhotoChange('profilePhotoName', 'profilePhotoPreview'),
    handleCoverPhotoChange: handlePhotoChange('coverPhotoName', 'coverPhotoPreview'),
    handleCancel,
    handleSubmit,
  };
}
