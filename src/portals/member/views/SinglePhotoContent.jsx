import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowUpFromLine, CheckCircle2, ChevronDown, Loader2, Upload, Video, X } from 'lucide-react';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import UploadedPhotoPreview from '@/components/data-display/UploadedPhotoPreview/UploadedPhotoPreview';
import ZodiacStoryFormPanel from '@/components/forms/ZodiacStoryFormPanel/ZodiacStoryFormPanel';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import MemberSellPhotoFields from '@/portals/member/components/member-sell-photos/MemberSellPhotoFields';
import {
  ARTISTIC_CATEGORIES,
  DEFAULT_SIGN_ID,
  SINGLE_PHOTO_ASSETS,
  ZODIAC_SIGNS,
} from '@/portals/member/data/singlePhotoAssets';
import {
  CATEGORIES_QUERY_KEY,
  getCategoriesApi,
} from '@/shared/api/categories.api';
import {
  createArtworkApi,
  createArtworkVideoCommentApi,
  getArtworkDetailsApi,
  updateArtworkApi,
  USER_ARTWORKS_QUERY_KEY,
} from '@/shared/api/artworks.api';
import {
  createMarketplacePremiumPhotoApi,
  formatPriceForMarketplace,
  updateMarketplacePremiumPhotoApi,
} from '@/shared/api/premiumPhotos.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { ROUTES } from '@/shared/config';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const toUuidOrEmpty = (value) => {
  const raw = String(value || '').trim();
  return UUID_RE.test(raw) ? raw : '';
};

const findSign = (id) =>
  ZODIAC_SIGNS.find((sign) => sign.id === id) ?? ZODIAC_SIGNS[5];

const ZodiacIcon = memo(({ sign, size = 35, variant = 'default' }) => {
  const src = variant === 'slot' && sign.slotIcon ? sign.slotIcon : sign.icon;

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded bg-[#4048cd] font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      aria-hidden="true"
    >
      {sign.symbol}
    </span>
  );
});

ZodiacIcon.displayName = 'ZodiacIcon';

/**
 * Single Photo upload workspace — Figma node 190:142 (file kE9g2eZmAoSco81PgZNlj2).
 * Layout: left 930 + gap 71 + right 579; copyright confirm + submit on right panel.
 */
const SinglePhotoContent = memo(
  ({
    backHref = ROUTES.USER_UPLOAD_PHOTOS,
    uploadAnotherHref: _uploadAnotherHref = ROUTES.USER_UPLOAD_PHOTOS,
    purpose = 'artwork',
    defaultPrice = '$2.00',
  }) => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const editId = searchParams.get('edit') || location.state?.editId;
    const isEdit = Boolean(editId);

    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const isSell = purpose === 'sell';

    const [signId, setSignId] = useState(DEFAULT_SIGN_ID);
    const [signOpen, setSignOpen] = useState(false);

    // Categories query
    const { data: categoriesData } = useQuery({
      queryKey: CATEGORIES_QUERY_KEY,
      queryFn: getCategoriesApi,
      staleTime: 5 * 60 * 1000,
    });

    const categoriesList = useMemo(() => {
      if (Array.isArray(categoriesData)) return categoriesData;
      if (Array.isArray(categoriesData?.data)) return categoriesData.data;
      return [];
    }, [categoriesData]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const subCategoriesList = useMemo(() => {
      if (!selectedCategory) return categoriesList[0]?.subcategories || [];
      const match = categoriesList.find(
        (c) => c.id === selectedCategory || c.slug === selectedCategory,
      );
      return match?.subcategories || [];
    }, [categoriesList, selectedCategory]);

    const {
      register,
      handleSubmit,
      setValue,
      getValues,
      formState: { errors },
    } = useForm({
      defaultValues: {
        category: '',
        subCategory: '',
        title: '',
        story: '',
        price: defaultPrice,
        resolution: '',
        fileSize: '',
        quality: '',
        copyrightOk: false,
      },
    });

    // Auto set initial category from API if available (create mode only)
    useEffect(() => {
      if (isEdit) return;
      if (categoriesList.length > 0 && !selectedCategory) {
        const first = categoriesList[0];
        const val = first.id || first.slug || '';
        setSelectedCategory(val);
        setValue('category', val);
        setValue('subCategory', '');
      }
    }, [categoriesList, selectedCategory, setValue, isEdit]);

    const [publishTarget, setPublishTarget] = useState('competition');
    const [aiCreated, setAiCreated] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoError, setPhotoError] = useState('');

    // Fetch existing artwork in edit mode
    const { data: existingArtwork } = useQuery({
      queryKey: ['artwork-detail', editId],
      queryFn: () => getArtworkDetailsApi(editId),
      enabled: isEdit,
      initialData: location.state?.editArtwork || location.state?.artwork,
    });

    useEffect(() => {
      if (!existingArtwork) return;
      setValue('title', existingArtwork.title || '');
      setValue(
        'story',
        existingArtwork.story || existingArtwork.description || '',
      );
      const catId =
        existingArtwork.categoryId ||
        existingArtwork.categoryObject?.id ||
        (typeof existingArtwork.category === 'object'
          ? existingArtwork.category?.id
          : null);
      if (catId) {
        setSelectedCategory(catId);
        setValue('category', catId);
      }
      if (existingArtwork.subcategoryId || existingArtwork.subCategoryId) {
        setValue(
          'subCategory',
          existingArtwork.subcategoryId || existingArtwork.subCategoryId,
        );
      }
      if (existingArtwork.zodiacSign) {
        const sign = ZODIAC_SIGNS.find(
          (s) =>
            s.id?.toUpperCase() === existingArtwork.zodiacSign?.toUpperCase() ||
            s.name?.toUpperCase() === existingArtwork.zodiacSign?.toUpperCase(),
        );
        if (sign) setSignId(sign.id);
      }
      if (existingArtwork.isAiGenerated !== undefined) {
        setAiCreated(existingArtwork.isAiGenerated ? 'yes' : 'no');
      }
      if (existingArtwork.competitionState) {
        setPublishTarget(
          existingArtwork.competitionState === 'PROFILE_ONLY'
            ? 'profile'
            : 'competition',
        );
      }
      const previewImg =
        existingArtwork.featuredImage ||
        existingArtwork.image ||
        existingArtwork.coverImage;
      if (previewImg && !photoFile) {
        setPhotoPreview(previewImg);
      }
    }, [existingArtwork, setValue, photoFile]);

    const redirectToMyArtwork = () => {
      queryClient.invalidateQueries({ queryKey: USER_ARTWORKS_QUERY_KEY });
      navigate(ROUTES.USER_MY_ARTWORK);
    };

    // Update Artwork Mutation
    const updateArtworkMutation = useMutation({
      mutationFn: (payload) => updateArtworkApi(editId, payload),
      onSuccess: () => {
        toast.success(
          t('singlePhoto.updateSuccess', 'Artwork updated successfully!'),
        );
        queryClient.invalidateQueries({ queryKey: ['artwork-detail', editId] });
        redirectToMyArtwork();
      },
      onError: (err) => {
        toast.error(
          getApiErrorMessage(
            err,
            t('singlePhoto.updateError', 'Failed to update artwork. Please try again.'),
          ),
        );
      },
    });

    // Create Sell Photo Mutation (Marketplace)
    const createSellPhotoMutation = useMutation({
      mutationFn: createMarketplacePremiumPhotoApi,
      onSuccess: () => {
        toast.success(
          t('sellPhotos.uploadSuccess', 'Photo submitted for sale successfully!'),
        );
        queryClient.invalidateQueries({
          queryKey: ['marketplace-premium-photos'],
        });
        navigate(ROUTES.USER_SELL_PHOTOS);
      },
      onError: (err) => {
        toast.error(
          getApiErrorMessage(
            err,
            t('sellPhotos.uploadError', 'Failed to submit photo for sale. Please try again.'),
          ),
        );
      },
    });

    // Update Sell Photo Mutation (Marketplace)
    const updateSellPhotoMutation = useMutation({
      mutationFn: (payload) => updateMarketplacePremiumPhotoApi(editId, payload),
      onSuccess: () => {
        toast.success(
          t('sellPhotos.updateSuccess', 'Photo listing updated successfully!'),
        );
        queryClient.invalidateQueries({
          queryKey: ['marketplace-premium-photos'],
        });
        queryClient.invalidateQueries({
          queryKey: ['marketplace-premium-photo-detail', editId],
        });
        navigate(ROUTES.USER_SELL_PHOTOS);
      },
      onError: (err) => {
        toast.error(
          getApiErrorMessage(
            err,
            t('sellPhotos.updateError', 'Failed to update photo listing. Please try again.'),
          ),
        );
      },
    });

    // Create Artwork Mutation
    const createArtworkMutation = useMutation({
      mutationFn: createArtworkApi,
      onSuccess: () => {
        toast.success(
          t('singlePhoto.uploadSuccess', 'Artwork published successfully!'),
        );
        redirectToMyArtwork();
      },
      onError: (err) => {
        toast.error(
          getApiErrorMessage(
            err,
            t('singlePhoto.uploadError', 'Failed to publish artwork. Please try again.'),
          ),
        );
      },
    });

    // Video comment state
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState('');

    useEffect(() => {
      if (!selectedVideo) {
        setVideoPreview('');
        return undefined;
      }
      const url = URL.createObjectURL(selectedVideo);
      setVideoPreview(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }, [selectedVideo]);

    const videoCommentMutation = useMutation({
      mutationFn: createArtworkVideoCommentApi,
      onSuccess: () => {
        toast.success(
          t('artwork.videoUploaded', 'Video comment uploaded successfully!'),
        );
      },
      onError: (err) => {
        toast.error(
          getApiErrorMessage(
            err,
            t('artwork.videoUploadError', 'Failed to upload video comment.'),
          ),
        );
      },
    });

    const selectedSign = findSign(signId);

    useEffect(() => {
      return () => {
        if (photoPreview) URL.revokeObjectURL(photoPreview);
      };
    }, [photoPreview]);

    const handlePickPhoto = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setPhotoFile(file);
      setPhotoPreview((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return URL.createObjectURL(file);
      });
      setPhotoError('');
    };

    const handlePickVideo = () => {
      videoInputRef.current?.click();
    };

    const handleVideoChange = (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > 25 * 1024 * 1024) {
        toast.error(t('artwork.videoTooLarge', 'Video file must be under 25MB.'));
        return;
      }
      setSelectedVideo(file);
    };

    const handleRemoveVideo = (e) => {
      e.stopPropagation();
      setSelectedVideo(null);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    };

    const onSubmit = async (data) => {
      if (!photoFile && !photoPreview) {
        setPhotoError(t('singlePhoto.errors.photoRequired'));
        return;
      }
      setPhotoError('');

      const signName = selectedSign?.name || selectedSign?.id || 'ARIES';

      if (isEdit) {
        if (isSell) {
          const formData = new FormData();
          formData.append('kind', 'SINGLE');
          formData.append('title', data.title || 'Untitled Photo');
          formData.append('story', data.story || '');
          formData.append('price', formatPriceForMarketplace(data.price));
          formData.append('zodiacSign', signName.toUpperCase());
          formData.append('isAiGenerated', String(aiCreated === 'yes'));
          formData.append('copyrightConfirmed', String(Boolean(data.copyrightOk)));
          formData.append('resolution', data.resolution || '60000x60000');
          formData.append('quality', data.quality || '4K');
          const sellCategoryId = toUuidOrEmpty(
            data.category || selectedCategory,
          );
          const sellSubcategoryId = toUuidOrEmpty(data.subCategory);
          if (sellCategoryId) formData.append('categoryId', sellCategoryId);
          if (sellSubcategoryId) {
            formData.append('subcategoryId', sellSubcategoryId);
          }
          if (photoFile) {
            formData.append('images', photoFile);
          }
          if (selectedVideo) {
            formData.append('video', selectedVideo);
          }
          updateSellPhotoMutation.mutate(formData);
          return;
        }

        const formData = new FormData();
        formData.append('kind', 'SINGLE');
        formData.append('title', data.title || 'Untitled Artwork');
        formData.append('story', data.story || '');
        formData.append('zodiacSign', signName.toUpperCase());
        formData.append(
          'competitionState',
          publishTarget === 'competition' ? 'IN_COMPETITION' : 'PROFILE_ONLY',
        );
        formData.append('isAiGenerated', String(aiCreated === 'yes'));
        formData.append('copyrightConfirmed', String(Boolean(data.copyrightOk)));
        formData.append('resolution', data.resolution || '60000x60000');
        formData.append('quality', data.quality || '4K');
        const editCategoryId = toUuidOrEmpty(
          data.category || selectedCategory,
        );
        const editSubcategoryId = toUuidOrEmpty(data.subCategory);
        if (editCategoryId) formData.append('categoryId', editCategoryId);
        if (editSubcategoryId) {
          formData.append('subcategoryId', editSubcategoryId);
        }
        if (photoFile) {
          formData.append('images', photoFile);
        }
        if (selectedVideo) {
          formData.append('video', selectedVideo);
        }
        updateArtworkMutation.mutate(formData);
        return;
      }

      const catMatch = categoriesList.find(
        (c) =>
          c.id === data.category ||
          c.slug === data.category ||
          c.id === selectedCategory,
      );
      const categoryId = toUuidOrEmpty(
        catMatch?.id || data.category || selectedCategory,
      );

      const subMatch = subCategoriesList.find(
        (s) =>
          s.id === data.subCategory ||
          s.slug === data.subCategory ||
          s.name === data.subCategory,
      );
      const subcategoryId = toUuidOrEmpty(
        subMatch?.id || data.subCategory,
      );

      if (isSell) {
        createSellPhotoMutation.mutate({
          kind: 'SINGLE',
          zodiacSign: signName.toUpperCase(),
          title: data.title || 'Untitled Photo',
          price: data.price,
          isAiGenerated: aiCreated === 'yes',
          copyrightConfirmed: Boolean(data.copyrightOk),
          resolution: data.resolution || '60000x60000',
          quality: data.quality || '4K',
          categoryId: categoryId || undefined,
          subcategoryId: subcategoryId || undefined,
          images: photoFile,
          video: selectedVideo || undefined,
        });
        return;
      }

      // Submit main artwork (POST /api/v1/artworks)
      createArtworkMutation.mutate({
        kind: 'SINGLE',
        zodiacSign: signName.toUpperCase(),
        title: data.title || 'Untitled Artwork',
        story: data.story || '',
        competitionState:
          publishTarget === 'competition' ? 'IN_COMPETITION' : 'PROFILE_ONLY',
        isAiGenerated: aiCreated === 'yes',
        copyrightConfirmed: Boolean(data.copyrightOk),
        resolution: data.resolution || '60000x60000',
        quality: data.quality || '4K',
        categoryId: categoryId || undefined,
        subcategoryId: subcategoryId || undefined,
        images: photoFile,
        video: selectedVideo || undefined,
      });
    };

    return (
      <div className="mx-auto w-full max-w-395">
        {/* Figma: left 930 | gap ~71 | right 579 */}
        <div className="grid w-full grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,930fr)_minmax(280px,579fr)] lg:gap-10 xl:gap-17.75">
          {/* LEFT */}
          <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
            <div className="flex flex-col gap-5 sm:gap-8">
              <div className="flex flex-col gap-5 sm:gap-8.5">
                <Link
                  to={isEdit ? ROUTES.USER_MY_ARTWORK : backHref}
                  className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-[13px] font-medium leading-5 text-[#272727] transition hover:text-[#ee1c25] sm:gap-2 sm:text-[16px] sm:leading-6"
                >
                  <ArrowLeft
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 sm:size-6"
                  />
                  {isEdit
                    ? t('myArtwork.backToArtwork', 'Back to My Artwork')
                    : t('singlePhoto.backToSelection')}
                </Link>

                <section className="w-full rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-3.5 sm:p-6.5">
                  <p className="mb-2.5 whitespace-pre-wrap text-[11px] font-medium uppercase tracking-[0.16em] text-[#28252f] sm:mb-5 sm:text-[16px] sm:tracking-[0.28em]">
                    {t('singlePhoto.selectSign')}
                  </p>
                  <div className="relative">
                    <Button
                      unstyled
                      type="button"
                      aria-expanded={signOpen}
                      aria-haspopup="listbox"
                      onClick={() => {
                        setSignOpen((open) => !open);
                      }}
                      className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-[rgba(0,0,0,0.17)] bg-white p-2.5 text-left sm:p-3.5"
                    >
                      <span className="flex min-w-0 items-center gap-1.5">
                        <ZodiacIcon sign={selectedSign} size={24} />
                        <span className="truncate text-[13px] leading-5 text-[#1b1b1b] sm:text-[16px] sm:leading-6">
                          {t(selectedSign.nameKey)} ({t(selectedSign.rangeKey)})
                        </span>
                      </span>
                      <ChevronDown
                        size={16}
                        className={`shrink-0 text-[#494453] transition sm:size-[18px] ${signOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </Button>

                    {signOpen ? (
                      <ul
                        role="listbox"
                        className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-[rgba(0,0,0,0.12)] bg-white py-1 shadow-lg"
                      >
                        {ZODIAC_SIGNS.map((sign) => (
                          <li key={sign.id}>
                            <Button
                              unstyled
                              type="button"
                              role="option"
                              aria-selected={sign.id === signId}
                              onClick={() => {
                                setSignId(sign.id);
                                setSignOpen(false);
                              }}
                              className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[13px] transition hover:bg-[#ecedfa] sm:px-3.5 sm:py-2.5 sm:text-[15px] ${
                                sign.id === signId
                                  ? 'bg-[#ecedfa] text-[#4048cd]'
                                  : 'text-[#1b1b1b]'
                              }`}
                            >
                              <ZodiacIcon sign={sign} size={24} />
                              <span>
                                {t(sign.nameKey)} ({t(sign.rangeKey)})
                              </span>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </section>
              </div>

              <div
                className="relative h-11.5 w-full overflow-visible"
                aria-hidden="true"
              >
                <Image
                  src={SINGLE_PHOTO_ASSETS.wave}
                  alt=""
                  className="absolute inset-x-0 top-0 h-14.5 w-full object-fill"
                />
              </div>

              <div className="flex w-full max-w-121.25 flex-col gap-1.5 sm:gap-4">
                <h1 className="text-[16px] font-semibold leading-5 text-[#2a282d] sm:text-[20px] sm:leading-6">
                  {t('singlePhoto.slotsTitle')}
                </h1>
                <p className="text-[12px] font-medium leading-4 text-[#555555] sm:text-[14px] sm:leading-5">
                  {t('singlePhoto.slotsSubtitle')}
                </p>
              </div>
            </div>

            <article className="flex w-full flex-col items-center gap-3 rounded-xl border border-[#c4c6f0] bg-white p-3.5 sm:gap-6.75 sm:p-5">
              <div className="flex w-full flex-col items-center gap-3 sm:gap-5">
                <div className="flex w-full items-center justify-between">
                  <p className="text-[14px] font-semibold leading-5 text-[#4048cd] sm:text-[20px] sm:leading-6">
                    #{selectedSign.number}
                  </p>
                  <p className="text-[11px] font-medium uppercase leading-5 text-[#5e5d61] sm:text-[16px] sm:leading-6">
                    {t(selectedSign.elementKey)}
                  </p>
                </div>

                <div className="flex w-37.25 flex-col items-center gap-1.5 sm:gap-3">
                  <ZodiacIcon sign={selectedSign} variant="slot" size={40} />
                  <div className="flex w-full flex-col items-center gap-0.5 text-center sm:gap-1">
                    <p className="w-full text-[14px] font-medium leading-5 text-[#1b1e56] sm:text-[20px] sm:leading-6">
                      {t(selectedSign.nameKey)}
                    </p>
                    <p className="w-full whitespace-pre-wrap text-[12px] font-medium leading-4 text-[#666dd7] sm:text-[16px] sm:leading-6">
                      {t(selectedSign.rangeKey)}
                    </p>
                  </div>
                </div>
              </div>

              {photoPreview ? (
                <UploadedPhotoPreview
                  src={photoPreview}
                  imageClassName="max-h-72 w-full object-cover"
                  frameClassName="relative w-full overflow-hidden rounded-lg border border-[#c4c6f0]"
                  showAiBadge={aiCreated === 'yes'}
                  badgeSize="md"
                >
                  <Button
                    unstyled
                    type="button"
                    onClick={handlePickPhoto}
                    className="absolute bottom-3 right-3 cursor-pointer rounded-lg bg-white/95 px-3 py-1.5 text-sm font-medium text-[#4048cd] shadow"
                  >
                    {t('singlePhoto.changePhoto')}
                  </Button>
                </UploadedPhotoPreview>
              ) : (
                <Button
                  unstyled
                  type="button"
                  onClick={handlePickPhoto}
                  className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-[13px] font-medium leading-5 transition hover:bg-[#ecedfa] sm:gap-2.5 sm:px-6 sm:py-3 sm:text-[16px] sm:leading-6 ${
                    photoError
                      ? 'border-red-500 text-red-500'
                      : 'border-[#4048cd] text-[#4048cd]'
                  }`}
                >
                  <ArrowUpFromLine size={16} aria-hidden="true" className="sm:size-6" />
                  {t('singlePhoto.addPhoto')}
                </Button>
              )}

              {photoError ? (
                <p className="w-full text-[12px] text-red-600 sm:text-sm" role="alert">
                  {photoError}
                </p>
              ) : null}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
              />
            </article>

            <article className="rounded-xl border border-[#e6e8ef] bg-white p-3.5 sm:p-5">
              <h3 className="text-[16px] font-semibold leading-5 text-[#2a282d] sm:text-[20px] sm:leading-7">
                Upload Videos
              </h3>
              <p className="mt-1 text-[11px] leading-4 text-[#717784] sm:text-[13px] sm:leading-5">
                1-minute video comment / update for your artwork. Optional but highly recommended.
              </p>

              {videoPreview ? (
                <div className="relative mt-4 overflow-hidden rounded-xl border border-[#c4c6f0] bg-black">
                  <video
                    src={videoPreview}
                    controls
                    className="max-h-56 w-full object-contain"
                  />
                  <div className="flex items-center justify-between bg-[#111827] px-4 py-2.5 text-white">
                    <span className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-400">
                      <CheckCircle2 size={16} />
                      {selectedVideo?.name || 'video.mp4'}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="cursor-pointer text-[12px] font-semibold text-red-400 hover:text-red-300"
                    >
                      {t('common.remove', 'Remove')}
                    </button>
                  </div>
                </div>
              ) : (
                <Button
                  unstyled
                  type="button"
                  onClick={handlePickVideo}
                  className="mt-3 flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#d8dbe6] bg-white px-3 text-[#7f8593] transition hover:border-[#b9bfd0] sm:mt-4 sm:h-28"
                >
                  <Upload size={20} className="mb-1.5 text-[#b1b6c5] sm:mb-2 sm:size-6" />
                  <span className="text-center text-[13px] leading-5 sm:text-[16px] sm:leading-6">
                    Click to upload Video or drag &amp; drop
                  </span>
                  <span className="text-[11px] text-[#9ca3af] sm:text-[12px]">
                    MP4 — max 1 minute (up to 25MB)
                  </span>
                </Button>
              )}

              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/*"
                className="sr-only"
                onChange={handleVideoChange}
              />
            </article>
          </div>

          {/* RIGHT — Figma y=170 aligns with select card (after back link) */}
          <aside className="w-full min-w-0 lg:mt-14.5 lg:sticky lg:top-0">
            <ZodiacStoryFormPanel
              t={t}
              i18nPrefix="singlePhoto"
              onSubmit={handleSubmit(onSubmit)}
              categoryOptions={ARTISTIC_CATEGORIES}
              categoryList={categoriesList}
              subCategoryList={subCategoriesList}
              onCategoryChange={(val) => {
                setSelectedCategory(val);
                setValue('category', val);
                setValue('subCategory', '');
              }}
              publishTarget={publishTarget}
              setPublishTarget={setPublishTarget}
              aiCreated={aiCreated}
              setAiCreated={setAiCreated}
              register={register}
              errors={errors}
              isSell={isSell}
              submitLabel={
                isEdit
                  ? t('common.saveChanges', 'Save Changes')
                  : undefined
              }
              isSubmitting={
                isEdit
                  ? isSell
                    ? updateSellPhotoMutation.isPending
                    : updateArtworkMutation.isPending
                  : isSell
                    ? createSellPhotoMutation.isPending
                    : createArtworkMutation.isPending
              }
              sellFields={
                <MemberSellPhotoFields
                  idPrefix="single-photo"
                  register={register}
                  errors={errors}
                />
              }
            />
          </aside>
        </div>

      </div>
    );
  },
);

SinglePhotoContent.displayName = 'SinglePhotoContent';

export default SinglePhotoContent;
