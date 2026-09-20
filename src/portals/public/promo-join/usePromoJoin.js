import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  ABOUT_MAX_WORDS,
  DEFAULT_THEME_ID,
  EMPTY_STORY,
  ZODIAC_SIGNS,
  countWords,
  findPromoLinkByCode,
  getSlotsForTheme,
} from '@/portals/public/promo-join/promoJoinData';

const revokePreview = (url) => {
  if (url?.startsWith?.('blob:')) URL.revokeObjectURL(url);
};

export default function usePromoJoin(code) {
  const promoLink = useMemo(() => findPromoLinkByCode(code), [code]);

  const {
    register,
    handleSubmit: hookFormSubmit,
        formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      phone: '',
      country: '',
      paypal: '',
      about: '',
      password: '',
    },
  });

  const [socialLinks, setSocialLinks] = useState(['']);
  const [profilePreview, setProfilePreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [introVideoName, setIntroVideoName] = useState('');
  const [astroSignId, setAstroSignId] = useState('virgo');
  const [astroOpen, setAstroOpen] = useState(false);

  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [sixPreviews, setSixPreviews] = useState({});
  const [twelvePreviews, setTwelvePreviews] = useState({});
  const [sixVideos, setSixVideos] = useState([]);
  const [twelveVideos, setTwelveVideos] = useState([]);

  const [sixStory, setSixStory] = useState(EMPTY_STORY);
  const [twelveStory, setTwelveStory] = useState(EMPTY_STORY);
  const [aiCreated, setAiCreated] = useState('');
  const [copyrightOk, setCopyrightOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const introVideoRef = useRef(null);
  const sixSlotInputRef = useRef(null);
  const twelveSlotInputRef = useRef(null);
  const sixVideoInputRef = useRef(null);
  const twelveVideoInputRef = useRef(null);
  const activeSixSlotRef = useRef(null);
  const activeTwelveSlotRef = useRef(null);

  const selectedSign = ZODIAC_SIGNS.find((sign) => sign.id === astroSignId) || ZODIAC_SIGNS[5];
  const sixSlots = getSlotsForTheme(themeId);

  const patchSixStory = (field, value) => {
    setSixStory((current) => ({ ...current, [field]: value }));
  };

  const patchTwelveStory = (field, value) => {
    setTwelveStory((current) => ({ ...current, [field]: value }));
  };

  const handleSocialChange = (index, value) => {
    setSocialLinks((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const handleAddSocial = () => {
    setSocialLinks((current) => [...current, '']);
  };

  const readImagePreview = (file, onReady) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    onReady(url);
  };

  const handleProfileChange = (event) => {
    const file = event.target.files?.[0];
    readImagePreview(file, (url) => {
      setProfilePreview((prev) => {
        revokePreview(prev);
        return url;
      });
    });
    event.target.value = '';
  };

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];
    readImagePreview(file, (url) => {
      setCoverPreview((prev) => {
        revokePreview(prev);
        return url;
      });
    });
    event.target.value = '';
  };

  const handleIntroVideoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIntroVideoName(file.name);
    event.target.value = '';
  };

  const handleSixSlotPick = (slotId) => {
    activeSixSlotRef.current = slotId;
    sixSlotInputRef.current?.click();
  };

  const handleTwelveSlotPick = (slotId) => {
    activeTwelveSlotRef.current = slotId;
    twelveSlotInputRef.current?.click();
  };

  const handleSixSlotFile = (event) => {
    const file = event.target.files?.[0];
    const slotId = activeSixSlotRef.current;
    if (!file || !slotId) return;
    const url = URL.createObjectURL(file);
    setSixPreviews((current) => {
      revokePreview(current[slotId]);
      return { ...current, [slotId]: url };
    });
    event.target.value = '';
  };

  const handleTwelveSlotFile = (event) => {
    const file = event.target.files?.[0];
    const slotId = activeTwelveSlotRef.current;
    if (!file || !slotId) return;
    const url = URL.createObjectURL(file);
    setTwelvePreviews((current) => {
      revokePreview(current[slotId]);
      return { ...current, [slotId]: url };
    });
    event.target.value = '';
  };

  const handleSixVideos = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setSixVideos((current) => [...current, ...files.map((file) => file.name)]);
    event.target.value = '';
  };

  const handleTwelveVideos = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setTwelveVideos((current) => [...current, ...files.map((file) => file.name)]);
    event.target.value = '';
  };

  const validateOtherFields = (t, data) => {
    if (countWords(data.about) > ABOUT_MAX_WORDS) return t('promoJoin.errors.about');
    if (!copyrightOk) return t('promoJoin.errors.copyright');
    return null;
  };

  const onSubmitForm = async (data, t) => {
    const error = validateOtherFields(t, data);
    if (error) {
      toast.error(error);
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setSubmitting(false);
    setSubmitted(true);
    toast.success(t('promoJoin.success'));
  };

  const handleSubmit = (t) => hookFormSubmit((data) => onSubmitForm(data, t));

  return {
    code,
    promoLink,
    register,
    handleSubmit,
    errors,
    socialLinks,
    profilePreview,
    coverPreview,
    introVideoName,
    astroSignId,
    astroOpen,
    selectedSign,
    themeId,
    sixSlots,
    sixPreviews,
    twelvePreviews,
    sixVideos,
    twelveVideos,
    sixStory,
    twelveStory,
    aiCreated,
    copyrightOk,
    submitting,
    submitted,
    profileInputRef,
    coverInputRef,
    introVideoRef,
    sixSlotInputRef,
    twelveSlotInputRef,
    sixVideoInputRef,
    twelveVideoInputRef,
    patchSixStory,
    patchTwelveStory,
    handleSocialChange,
    handleAddSocial,
    handleProfileChange,
    handleCoverChange,
    handleIntroVideoChange,
    setAstroSignId,
    setAstroOpen,
    setThemeId,
    handleSixSlotPick,
    handleTwelveSlotPick,
    handleSixSlotFile,
    handleTwelveSlotFile,
    handleSixVideos,
    handleTwelveVideos,
    setAiCreated,
    setCopyrightOk,
  };
}
