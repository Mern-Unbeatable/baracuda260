import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Sparkles as SparklesLucide, Upload } from 'lucide-react';
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
import PhotoSubmitSuccessModal from '@/portals/member/components/member-upload/singlePhoto/PhotoSubmitSuccessModal';
import {
  ARTISTIC_CATEGORIES,
  DEFAULT_THEME_ID,
  getSlotsForTheme,
  getThemeById,
  THEME_IDS,
  THEMES,
} from '@/portals/member/data/sixPhotoAssets';
import { ROUTES } from '@/shared/config';
import {
  CATEGORIES_QUERY_KEY,
  getCategoriesApi,
} from '@/shared/api/categories.api';
import {
  createArtworkApi,
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

const SlotIcon = memo(({ slot }) => {
  if (slot.iconBg && slot.iconOverlay) {
    return (
      <span className="relative size-8.75 shrink-0 overflow-hidden">
        <Image
          src={slot.iconBg}
          alt=""
          width={35}
          height={35}
          className="absolute inset-0 size-8.75 object-contain"
        />
        <Image
          src={slot.iconOverlay}
          alt=""
          className="absolute left-1/2 top-1/2 max-h-6.5 max-w-6.5 -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </span>
    );
  }

  if (slot.icon) {
    return (
      <Image
        src={slot.icon}
        alt=""
        width={35}
        height={35}
        className="size-8.75 shrink-0 object-contain"
      />
    );
  }

  return null;
});

SlotIcon.displayName = 'SlotIcon';

/**
 * Zodiac slot card — Figma 190:331 (red) / 190:872 (blue).
 * Equal-height row; date band reserved so CTAs share one baseline.
 */
const ZodiacSlotCard = memo(
  ({
    slot,
    themeStyles,
    preview,
    onAddPhoto,
    changeLabel,
    addLabel,
    showAiBadge = false,
  }) => {
    const { t } = useTranslation();

    return (
      <article
        className={`flex h-full min-w-0 flex-col gap-4 rounded-xl border bg-white p-3.5 sm:gap-6.75 sm:p-5 ${themeStyles.cardBorder}`}
      >
        <div className="flex w-full flex-1 flex-col items-center gap-3 sm:gap-5">
          <div className="flex w-full items-center justify-between whitespace-nowrap">
            <p
              className={`shrink-0 text-[14px] font-semibold leading-5 sm:text-[20px] sm:leading-6 ${themeStyles.number}`}
            >
              #{slot.number}
            </p>
            <p className="shrink-0 text-[11px] font-medium uppercase leading-5 text-[#3a3a3a] sm:text-[16px] sm:normal-case sm:leading-6">
              {t(slot.elementKey)}
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-2 sm:gap-3">
            <SlotIcon slot={slot} />
            <div className="flex w-full flex-col items-center gap-0.5 text-center sm:gap-1">
              <p
                className={`w-full text-[14px] font-medium leading-5 sm:text-[20px] sm:leading-6 ${themeStyles.name}`}
              >
                {t(slot.nameKey)}
              </p>
              <p
                className={`flex min-h-8 w-full items-start justify-center text-[12px] font-medium leading-4 sm:min-h-12 sm:text-[16px] sm:leading-6 ${themeStyles.range}`}
              >
                {t(slot.rangeKey)}
              </p>
            </div>
          </div>
        </div>

        {preview ? (
          <UploadedPhotoPreview
            src={preview}
            frameClassName="relative mt-auto w-full overflow-hidden rounded-lg border border-black/10"
            showAiBadge={showAiBadge}
          >
            <Button
              unstyled
              type="button"
              onClick={onAddPhoto}
              className="absolute bottom-2 right-2 cursor-pointer rounded-md bg-white/95 px-2.5 py-1 text-xs font-medium text-[#ee1c25] shadow"
            >
              {changeLabel}
            </Button>
          </UploadedPhotoPreview>
        ) : (
          <Button
            unstyled
            type="button"
            onClick={onAddPhoto}
            className={`mt-auto inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-[13px] font-medium leading-5 transition hover:bg-black/2 sm:gap-2.5 sm:px-6 sm:py-3 sm:text-[16px] sm:leading-6 ${themeStyles.buttonBorder} ${themeStyles.buttonText}`}
          >
            <Image
              src={themeStyles.upload}
              alt=""
              width={20}
              height={20}
              className="size-5 shrink-0 sm:size-6"
            />
            {addLabel}
          </Button>
        )}
      </article>
    );
  },
);

ZodiacSlotCard.displayName = 'ZodiacSlotCard';

/**
 * 6 Photo Story upload workspace — Figma node 190:237 (file kE9g2eZmAoSco81PgZNlj2).
 * Theme accent → wave → 6 slots grid → metadata form + copyright + submit.
 */
const SixPhotoContent = memo(
  ({
    backHref = ROUTES.USER_UPLOAD_PHOTOS,
    uploadAnotherHref = ROUTES.USER_UPLOAD_PHOTOS,
    purpose = 'artwork',
    defaultPrice = '$5.00',
  }) => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const editId = searchParams.get('edit') || location.state?.editId;
    const isEdit = Boolean(editId);

    const fileInputRef = useRef(null);
    const activeSlotRef = useRef(null);
    const isSell = purpose === 'sell';

    const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);

    const {
      register,
      handleSubmit,
      setValue,
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

    const [publishTarget, setPublishTarget] = useState('competition');
    const [aiCreated, setAiCreated] = useState('');
    const [previews, setPreviews] = useState({});
    const [files, setFiles] = useState({});
    const [photosError, setPhotosError] = useState('');
    const [successOpen, setSuccessOpen] = useState(false);

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

    const theme = getThemeById(themeId);
    const slots = getSlotsForTheme(themeId);

    // Create Sell Photo Mutation (Marketplace)
    const createSellPhotoMutation = useMutation({
      mutationFn: createMarketplacePremiumPhotoApi,
      onSuccess: () => {
        toast.success(
          t('sellPhotos.uploadSuccess', 'Photo story submitted for sale successfully!'),
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
            t('sellPhotos.uploadError', 'Failed to submit photo story for sale. Please try again.'),
          ),
        );
      },
    });

    // Update Sell Photo Mutation (Marketplace)
    const updateSellPhotoMutation = useMutation({
      mutationFn: (payload) => updateMarketplacePremiumPhotoApi(editId, payload),
      onSuccess: () => {
        toast.success(
          t('sellPhotos.updateSuccess', 'Photo story updated successfully!'),
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
            t('sellPhotos.updateError', 'Failed to update photo story. Please try again.'),
          ),
        );
      },
    });

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

      const subId =
        existingArtwork.subcategoryId || existingArtwork.subCategoryId;
      if (subId) {
        setValue('subCategory', subId);
      }

      const themeRaw = String(existingArtwork.theme || '').toUpperCase();
      if (themeRaw === 'BLUE' || themeRaw === 'AUTUMN') {
        setThemeId(THEME_IDS.AUTUMN);
      } else if (themeRaw === 'RED' || themeRaw === 'SPRING') {
        setThemeId(THEME_IDS.SPRING);
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

      const rawImages =
        existingArtwork.images && typeof existingArtwork.images === 'object'
          ? existingArtwork.images
          : null;
      const coverFallback =
        existingArtwork.featuredImage ||
        existingArtwork.image ||
        existingArtwork.coverImage ||
        null;

      const initialPreviews = {};
      slots.forEach((slot, idx) => {
        const candidates = rawImages
          ? [
              rawImages[slot.id],
              rawImages[String(slot.id || '').toLowerCase()],
              rawImages[String(slot.id || '').toUpperCase()],
              rawImages[idx],
              rawImages[String(idx)],
              rawImages[slot.number],
              rawImages[String(slot.number)],
              rawImages[slot.number - 1],
              rawImages[String(slot.number - 1)],
            ]
          : [];
        const found =
          candidates.find(Boolean) || (idx === 0 ? coverFallback : null);
        if (!found) return;
        initialPreviews[slot.id] =
          typeof found === 'string' ? found : found.url || found.thumbnailUrl;
      });

      if (Object.keys(initialPreviews).length > 0) {
        setPreviews((prev) => {
          const next = { ...prev };
          Object.entries(initialPreviews).forEach(([key, url]) => {
            if (!url) return;
            const current = next[key];
            if (
              current &&
              typeof current === 'string' &&
              current.startsWith('blob:')
            ) {
              return;
            }
            next[key] = url;
          });
          return next;
        });
      }
    }, [existingArtwork, setValue, slots]);

    const updateArtworkMutation = useMutation({
      mutationFn: (payload) => updateArtworkApi(editId, payload),
      onSuccess: () => {
        toast.success(
          t('sixPhoto.updateSuccess', 'Artwork updated successfully!'),
        );
        queryClient.invalidateQueries({ queryKey: USER_ARTWORKS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: ['artwork-detail', editId] });
        navigate(ROUTES.USER_MY_ARTWORK);
      },
      onError: (err) => {
        toast.error(
          getApiErrorMessage(
            err,
            t('sixPhoto.updateError', 'Failed to update artwork. Please try again.'),
          ),
        );
      },
    });

    const createArtworkMutation = useMutation({
      mutationFn: createArtworkApi,
      onSuccess: () => {
        toast.success(
          t('sixPhoto.uploadSuccess', 'Artwork published successfully!'),
        );
        setSuccessOpen(true);
      },
      onError: (err) => {
        toast.error(
          getApiErrorMessage(
            err,
            t('sixPhoto.uploadError', 'Failed to publish artwork. Please try again.'),
          ),
        );
      },
    });

    useEffect(() => {
      return () => {
        Object.values(previews).forEach((url) => {
          if (url && typeof url === 'string' && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      };
    }, [previews]);

    const handleThemeChange = (nextThemeId) => {
      setThemeId(nextThemeId);
      setPreviews((previous) => {
        Object.values(previous).forEach((url) => {
          if (url && typeof url === 'string' && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
        return {};
      });
      setFiles({});
      setPhotosError('');
    };

    const handlePickPhoto = (slotId) => {
      activeSlotRef.current = slotId;
      fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
      const file = event.target.files?.[0];
      const slotId = activeSlotRef.current;
      event.target.value = '';
      if (!file || !slotId) return;

      setFiles((prev) => ({ ...prev, [slotId]: file }));
      setPreviews((previous) => {
        const nextUrl = URL.createObjectURL(file);
        if (
          previous[slotId] &&
          typeof previous[slotId] === 'string' &&
          previous[slotId].startsWith('blob:')
        ) {
          URL.revokeObjectURL(previous[slotId]);
        }
        return { ...previous, [slotId]: nextUrl };
      });
      setPhotosError('');
    };

    const onSubmit = (data) => {
      const missingPhotos = slots.some((slot) => !previews[slot.id]);
      if (missingPhotos && !isEdit) {
        setPhotosError(t('sixPhoto.errors.photosRequired'));
        setSuccessOpen(false);
        return;
      }
      setPhotosError('');

      if (isEdit) {
        if (isSell) {
          const formData = new FormData();
          formData.append('kind', 'SIX');
          formData.append('title', data.title || 'Untitled Photo');
          formData.append('story', data.story || '');
          formData.append('price', formatPriceForMarketplace(data.price));
          formData.append(
            'theme',
            themeId === THEME_IDS.AUTUMN ? 'BLUE' : 'RED',
          );
          formData.append('isAiGenerated', String(aiCreated === 'yes'));
          formData.append('copyrightConfirmed', String(Boolean(data.copyrightOk)));
          formData.append('resolution', data.resolution || '60000x60000');
          formData.append('quality', data.quality || '4K');
          if (data.category || selectedCategory) {
            formData.append('categoryId', data.category || selectedCategory);
          }
          if (data.subCategory) {
            formData.append('subcategoryId', data.subCategory);
          }
          slots.forEach((s) => {
            if (files[s.id]) {
              formData.append('images', files[s.id]);
            }
          });
          updateSellPhotoMutation.mutate(formData);
          return;
        }

        const formData = new FormData();
        formData.append('kind', 'SIX');
        formData.append('title', data.title || 'Untitled Artwork');
        formData.append('story', data.story || '');
        formData.append(
          'competitionState',
          publishTarget === 'competition' ? 'IN_COMPETITION' : 'PROFILE_ONLY',
        );
        formData.append('isAiGenerated', String(aiCreated === 'yes'));
        formData.append('copyrightConfirmed', String(Boolean(data.copyrightOk)));
        formData.append('resolution', data.resolution || '60000x60000');
        formData.append('quality', data.quality || '4K');
        if (data.category) formData.append('categoryId', data.category);
        if (data.subCategory) formData.append('subcategoryId', data.subCategory);

        Object.entries(files).forEach(([, file]) => {
          if (file) {
            formData.append('images', file);
          }
        });

        updateArtworkMutation.mutate(formData);
        return;
      }

      const catMatch = categoriesList.find(
        (c) =>
          c.id === data.category ||
          c.slug === data.category ||
          c.id === selectedCategory,
      );
      const uuidRe =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const toUuid = (value) => {
        const raw = String(value || '').trim();
        return uuidRe.test(raw) ? raw : '';
      };

      const categoryId = toUuid(
        catMatch?.id || data.category || selectedCategory,
      );

      const subMatch = subCategoriesList.find(
        (s) =>
          s.id === data.subCategory ||
          s.slug === data.subCategory ||
          s.name === data.subCategory,
      );
      const subcategoryId = toUuid(subMatch?.id || data.subCategory);

      const orderedImages = slots.map((s) => files[s.id]).filter(Boolean);

      if (isSell) {
        createSellPhotoMutation.mutate({
          kind: 'SIX',
          theme: themeId === THEME_IDS.AUTUMN ? 'BLUE' : 'RED',
          title: data.title || 'Untitled Photo',
          price: data.price,
          isAiGenerated: aiCreated === 'yes',
          copyrightConfirmed: Boolean(data.copyrightOk),
          resolution: data.resolution || '60000x60000',
          quality: data.quality || '4K',
          categoryId: categoryId || undefined,
          subcategoryId: subcategoryId || undefined,
          images: orderedImages,
        });
        return;
      }

      createArtworkMutation.mutate({
        kind: 'SIX',
        theme: themeId === THEME_IDS.AUTUMN ? 'BLUE' : 'RED',
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
        images: orderedImages,
      });
    };

    return (
      <div className="mx-auto flex w-full max-w-395 flex-col gap-5 sm:gap-8">
        <Link
          to={isEdit ? ROUTES.USER_MY_ARTWORK : backHref}
          className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-[13px] font-medium leading-5 text-[#202020] transition hover:text-[#ee1c25] sm:gap-2 sm:text-[16px] sm:leading-6"
        >
          <ArrowLeft size={18} aria-hidden="true" className="shrink-0 sm:size-6" />
          {isEdit
            ? t('myArtwork.backToArtwork', 'Back to My Artwork')
            : t('sixPhoto.backToSelection')}
        </Link>

        <div className="flex flex-col gap-5 sm:gap-8">
          <section className="flex w-full flex-col gap-4 rounded-[16px] border border-[rgba(0,0,0,0.2)] bg-white p-3.5 sm:gap-6 sm:rounded-[20px] sm:p-8">
            <div className="flex items-center gap-2">
              <SparklesLucide
                size={14}
                className="shrink-0 text-[#1b1b1b] sm:size-4"
                aria-hidden="true"
              />
              <h1 className="text-[15px] font-medium leading-5 text-[#1b1b1b] sm:text-[20px] sm:leading-6">
                {t('sixPhoto.selectTheme')}
              </h1>
            </div>

            <div className="flex flex-col items-stretch gap-4 sm:gap-6 lg:flex-row lg:items-center lg:gap-6">
              {THEMES.map((item, index) => {
                const selected = item.id === themeId;
                const styles = selected ? item.selected : item.idle;

                return (
                  <React.Fragment key={item.id}>
                    {index > 0 ? (
                      <p className="shrink-0 text-center text-[14px] font-semibold leading-5 text-black sm:text-[20px] sm:leading-6">
                        {t('sixPhoto.or')}
                      </p>
                    ) : null}
                    <Button
                      unstyled
                      type="button"
                      aria-pressed={selected}
                      onClick={() => handleThemeChange(item.id)}
                      className={`flex flex-1 cursor-pointer flex-col gap-3 rounded-[10px] border p-3.5 text-left transition sm:gap-4 sm:p-6 ${styles.card}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex min-w-0 items-center gap-2">
                          <Image
                            src={item.icon}
                            alt=""
                            width={20}
                            height={20}
                            className="size-5 shrink-0 sm:size-6"
                          />
                          <span
                            className={`text-[14px] font-semibold leading-5 sm:text-[18px] sm:leading-6 xl:text-[20px] ${styles.title}`}
                          >
                            {t(item.titleKey)}
                          </span>
                        </span>
                        {selected ? (
                          <Image
                            src={item.selectedDot}
                            alt=""
                            width={8}
                            height={8}
                            className="mt-1.5 size-2 shrink-0 sm:mt-2"
                          />
                        ) : (
                          <span
                            className="mt-1.5 size-2 shrink-0 sm:mt-2"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <p
                        className={`text-[12px] font-medium leading-4 sm:text-[16px] sm:leading-6 ${styles.body}`}
                      >
                        {t(item.descriptionKey)}
                      </p>
                    </Button>
                  </React.Fragment>
                );
              })}
            </div>
          </section>

          <div
            className={`relative w-full overflow-visible ${theme.waveClassName}`}
            aria-hidden="true"
          >
            <Image
              src={theme.wave}
              alt=""
              className={`absolute inset-x-0 top-0 w-full object-fill ${theme.waveClassName}`}
            />
          </div>

          <section className="flex w-full flex-col gap-4 sm:gap-7">
            <div className="flex max-w-121.25 flex-col gap-1.5 sm:gap-3">
              <h2 className="text-[16px] font-semibold leading-5 text-[#0b0b0b] sm:text-[20px] sm:leading-6">
                {t('sixPhoto.slotsTitle')}
              </h2>
              <p className="text-[12px] font-medium leading-4 text-[#484848] sm:text-[16px] sm:leading-6">
                {t('sixPhoto.slotsSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {slots.map((slot) => (
                <ZodiacSlotCard
                  key={slot.id}
                  slot={slot}
                  themeStyles={theme.slot}
                  preview={previews[slot.id]}
                  onAddPhoto={() => handlePickPhoto(slot.id)}
                  addLabel={t('sixPhoto.addPhoto')}
                  changeLabel={t('sixPhoto.changePhoto')}
                  showAiBadge={aiCreated === 'yes'}
                />
              ))}
            </div>
            {photosError ? (
              <p className="text-sm text-red-600" role="alert">
                {photosError}
              </p>
            ) : null}
          </section>

          <article className="rounded-xl border border-[#e6e8ef] bg-white p-3.5 sm:p-5">
            <h3 className="text-[16px] font-semibold leading-5 text-[#2a282d] sm:text-[20px] sm:leading-7">
              Upload Videos
            </h3>
            <p className="mt-1 text-[11px] leading-4 text-[#717784] sm:text-[13px] sm:leading-5">
              Help your pro prepare by showing them the work area. Optional but
              highly recommended.
            </p>
            <Button
              unstyled
              type="button"
              className="mt-3 flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#d8dbe6] bg-white px-3 text-[#7f8593] transition hover:border-[#b9bfd0] sm:mt-4 sm:h-28"
            >
              <Upload size={20} className="mb-1.5 text-[#b1b6c5] sm:mb-2 sm:size-6" />
              <span className="text-center text-[13px] leading-5 sm:text-[16px] sm:leading-6">
                Click to upload Videos or drag &amp; drop
              </span>
              <span className="text-[11px] text-[#9ca3af] sm:text-[12px]">
                MP4 — max 10MB each
              </span>
            </Button>
          </article>
        </div>

        <ZodiacStoryFormPanel
          t={t}
          i18nPrefix="sixPhoto"
          onSubmit={handleSubmit(onSubmit)}
          categoryOptions={ARTISTIC_CATEGORIES}
          categoryList={categoriesList}
          subCategoryList={subCategoriesList}
          onCategoryChange={(val) => {
            setSelectedCategory(val);
            setValue('category', val);
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
              idPrefix="six-photo"
              register={register}
              errors={errors}
            />
          }
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />

        <PhotoSubmitSuccessModal
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          uploadAnotherHref={uploadAnotherHref}
        />
      </div>
    );
  },
);

SixPhotoContent.displayName = 'SixPhotoContent';

export default SixPhotoContent;
