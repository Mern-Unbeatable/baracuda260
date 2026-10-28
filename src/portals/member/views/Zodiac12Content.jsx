import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import UploadedPhotoPreview from '@/components/data-display/UploadedPhotoPreview/UploadedPhotoPreview';
import ZodiacStoryFormPanel from '@/components/forms/ZodiacStoryFormPanel/ZodiacStoryFormPanel';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import MemberSellPhotoFields from '@/portals/member/components/member-sell-photos/MemberSellPhotoFields';
import PhotoSubmitSuccessModal from '@/portals/member/components/member-upload/singlePhoto/PhotoSubmitSuccessModal';
import {
  ALL_SLOTS,
  ARTISTIC_CATEGORIES,
  BLUE_SLOTS,
  DEFAULT_CATEGORY,
  RED_SLOTS,
  ZODIAC12_ASSETS,
} from '@/portals/member/data/zodiac12Assets';
import { ROUTES } from '@/shared/config';
import { BUY_PHOTO_DEFAULT_SPECS } from '@/shared/data/buyPhotos';
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

const ZodiacSlotCard = memo(
  ({
    slot,
    preview,
    onAddPhoto,
    changeLabel,
    addLabel,
    showAiBadge = false,
  }) => {
    const { t } = useTranslation();
    const theme = slot.theme;

    return (
      <article
        className={`flex h-full min-w-0 w-full flex-col gap-6.75 rounded-xl border bg-white p-5 ${theme.cardBorder}`}
      >
        <div className="flex w-full flex-1 flex-col items-center gap-5">
          <div className="flex w-full items-center justify-between whitespace-nowrap">
            <p
              className={`shrink-0 text-[20px] font-semibold leading-6 ${theme.number}`}
            >
              #{slot.number}
            </p>
            <p className="shrink-0 text-[16px] font-medium leading-6 text-[#3a3a3a]">
              {t(slot.elementKey)}
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-3">
            <SlotIcon slot={slot} />
            <div className="flex w-full flex-col items-center gap-1 text-center">
              <p
                className={`w-full text-[20px] font-medium leading-6 ${theme.name}`}
              >
                {t(slot.nameKey)}
              </p>
              <p
                className={`flex min-h-12 w-full items-start justify-center text-[16px] font-medium leading-6 ${theme.range}`}
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
            className={`mt-auto inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-lg border bg-white px-6 py-3 text-[16px] font-medium leading-6 transition hover:bg-black/2 ${theme.buttonBorder} ${theme.buttonText}`}
          >
            <Image
              src={theme.upload}
              alt=""
              width={24}
              height={24}
              className="size-6 shrink-0"
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
 * 12 Photo Zodiac Album — Figma node 190:1054.
 * Dual red/blue wave → hero banner → red (1–6) + blue (7–12) grids → form.
 */
const Zodiac12Content = memo(
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

    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm({
      defaultValues: {
        category: DEFAULT_CATEGORY,
        subCategory: 'astrophotography',
        title: '',
        story: '',
        price: defaultPrice,
        resolution: BUY_PHOTO_DEFAULT_SPECS.resolution,
        fileSize: '125 KB',
        quality: '4K',
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

    // Auto set initial category from API if available
    useEffect(() => {
      if (categoriesList.length > 0 && !selectedCategory) {
        const first = categoriesList[0];
        const val = first.id || first.slug;
        setSelectedCategory(val);
        setValue('category', val);
      }
    }, [categoriesList, selectedCategory, setValue]);

    // Create Sell Photo Mutation (Marketplace)
    const createSellPhotoMutation = useMutation({
      mutationFn: createMarketplacePremiumPhotoApi,
      onSuccess: () => {
        toast.success(
          t('sellPhotos.uploadSuccess', 'Photo story submitted for sale successfully!'),
        );
        setSuccessOpen(true);
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
      if (existingArtwork.categoryId || existingArtwork.category?.id) {
        setValue(
          'category',
          existingArtwork.categoryId || existingArtwork.category?.id,
        );
      }
      if (existingArtwork.subcategoryId || existingArtwork.subCategoryId) {
        setValue(
          'subCategory',
          existingArtwork.subcategoryId || existingArtwork.subCategoryId,
        );
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
      const rawImages = existingArtwork.images;
      if (rawImages && typeof rawImages === 'object') {
        const initialPreviews = {};
        ALL_SLOTS.forEach((slot, idx) => {
          const found =
            rawImages[slot.id] ||
            rawImages[idx] ||
            (idx === 0 ? existingArtwork.featuredImage : null);
          if (found) {
            initialPreviews[slot.id] =
              typeof found === 'string'
                ? found
                : found.url || found.thumbnailUrl;
          }
        });
        setPreviews((prev) => ({ ...initialPreviews, ...prev }));
      } else if (existingArtwork.featuredImage) {
        setPreviews((prev) => ({
          [ALL_SLOTS[0].id]: existingArtwork.featuredImage,
          ...prev,
        }));
      }
    }, [existingArtwork, setValue]);

    const updateArtworkMutation = useMutation({
      mutationFn: (payload) => updateArtworkApi(editId, payload),
      onSuccess: () => {
        toast.success(
          t('zodiac12.updateSuccess', 'Artwork updated successfully!'),
        );
        queryClient.invalidateQueries({ queryKey: USER_ARTWORKS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: ['artwork-detail', editId] });
        navigate(ROUTES.USER_MY_ARTWORK);
      },
      onError: (err) => {
        toast.error(
          getApiErrorMessage(
            err,
            t('zodiac12.updateError', 'Failed to update artwork. Please try again.'),
          ),
        );
      },
    });

    const createArtworkMutation = useMutation({
      mutationFn: createArtworkApi,
      onSuccess: () => {
        toast.success(
          t('zodiac12.uploadSuccess', 'Artwork published successfully!'),
        );
        setSuccessOpen(true);
      },
      onError: (err) => {
        toast.error(
          getApiErrorMessage(
            err,
            t('zodiac12.uploadError', 'Failed to publish artwork. Please try again.'),
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
      const missingPhotos = ALL_SLOTS.some((slot) => !previews[slot.id]);
      if (missingPhotos && !isEdit) {
        setPhotosError(t('zodiac12.errors.photosRequired'));
        setSuccessOpen(false);
        return;
      }
      setPhotosError('');

      if (isEdit) {
        if (isSell) {
          const formData = new FormData();
          formData.append('kind', 'TWELVE');
          formData.append('title', data.title || 'Untitled Photo');
          formData.append('story', data.story || '');
          formData.append('price', formatPriceForMarketplace(data.price));
          formData.append('theme', 'FULL');
          formData.append(
            'zodiacSigns',
            JSON.stringify([
              'ARIES',
              'TAURUS',
              'GEMINI',
              'CANCER',
              'LEO',
              'VIRGO',
              'LIBRA',
              'SCORPIO',
              'SAGITTARIUS',
              'CAPRICORN',
              'AQUARIUS',
              'PISCES',
            ]),
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
          ALL_SLOTS.forEach((s) => {
            if (files[s.id]) {
              formData.append('images', files[s.id]);
            }
          });
          updateSellPhotoMutation.mutate(formData);
          return;
        }

        const formData = new FormData();
        formData.append('kind', 'TWELVE');
        formData.append('title', data.title || 'Untitled Artwork');
        formData.append('story', data.story || '');
        formData.append(
          'competitionState',
          publishTarget === 'competition' ? 'all' : 'PROFILE_ONLY',
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
      const categoryId =
        catMatch?.id || data.category || selectedCategory || '';

      const subMatch = subCategoriesList.find(
        (s) =>
          s.id === data.subCategory ||
          s.slug === data.subCategory ||
          s.name === data.subCategory,
      );
      const subcategoryId = subMatch?.id || data.subCategory || '';

      const orderedImages = ALL_SLOTS.map((s) => files[s.id]).filter(Boolean);

      if (isSell) {
        createSellPhotoMutation.mutate({
          kind: 'TWELVE',
          theme: 'FULL',
          zodiacSigns: [
            'ARIES',
            'TAURUS',
            'GEMINI',
            'CANCER',
            'LEO',
            'VIRGO',
            'LIBRA',
            'SCORPIO',
            'SAGITTARIUS',
            'CAPRICORN',
            'AQUARIUS',
            'PISCES',
          ],
          title: data.title || 'Untitled Photo',
          price: data.price,
          isAiGenerated: aiCreated === 'yes',
          copyrightConfirmed: Boolean(data.copyrightOk),
          resolution: data.resolution || '60000x60000',
          quality: data.quality || '4K',
          categoryId,
          subcategoryId,
          images: orderedImages,
        });
        return;
      }

      createArtworkMutation.mutate({
        kind: 'TWELVE',
        title: data.title || 'Untitled Artwork',
        story: data.story || '',
        competitionState: publishTarget === 'competition' ? 'all' : 'PROFILE_ONLY',
        isAiGenerated: aiCreated === 'yes',
        copyrightConfirmed: Boolean(data.copyrightOk),
        resolution: data.resolution || '60000x60000',
        quality: data.quality || '4K',
        categoryId,
        subcategoryId,
        images: orderedImages,
      });
    };

    const renderSlotGrid = (slots) => (
      <div className="grid w-full grid-cols-1 items-stretch gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => (
          <ZodiacSlotCard
            key={slot.id}
            slot={slot}
            preview={previews[slot.id]}
            onAddPhoto={() => handlePickPhoto(slot.id)}
            addLabel={t('zodiac12.addPhoto')}
            changeLabel={t('zodiac12.changePhoto')}
            showAiBadge={aiCreated === 'yes'}
          />
        ))}
      </div>
    );

    return (
      <div className="mx-auto flex w-full max-w-395 flex-col gap-8">
        <Link
          to={isEdit ? ROUTES.USER_MY_ARTWORK : backHref}
          className="inline-flex w-fit cursor-pointer items-center gap-2 text-[16px] font-medium leading-6 text-[#707070] transition hover:text-[#ee1c25]"
        >
          <ArrowLeft size={24} aria-hidden="true" className="shrink-0" />
          {isEdit
            ? t('myArtwork.backToArtwork', 'Back to My Artwork')
            : t('zodiac12.backToSelection')}
        </Link>

        <div
          className="relative h-16 w-full overflow-visible sm:h-20 lg:h-25.75"
          aria-hidden="true"
        >
          <Image
            src={ZODIAC12_ASSETS.dualWave}
            alt=""
            className="absolute inset-x-0 top-0 h-full w-full object-fill"
          />
        </div>

        <section className="flex w-full flex-col items-center gap-6 rounded-[20px] bg-[#ecedfa] px-5 py-6 sm:px-10 lg:flex-row lg:justify-center lg:gap-21 lg:px-16 xl:px-52">
          <Image
            src={ZODIAC12_ASSETS.sun}
            alt=""
            width={132}
            height={132}
            className="size-20 shrink-0 object-contain sm:size-28 lg:size-33"
          />
          <div className="flex max-w-184 flex-col items-center gap-2 text-center">
            <h1 className="text-[24px] font-semibold leading-[1.35] text-black sm:text-[30px] lg:text-[36px] lg:leading-12.5">
              <Trans
                i18nKey="zodiac12.bannerTitle"
                components={{
                  red: <span className="text-[#ee1c25]" />,
                  blue: <span className="text-[#4048cd]" />,
                }}
              />
            </h1>
            <p className="text-[16px] font-normal leading-6 text-[#4e4e4e] sm:text-[18px] lg:text-[20px]">
              {t('zodiac12.bannerSubtitle')}
            </p>
          </div>
          <Image
            src={ZODIAC12_ASSETS.moon}
            alt=""
            width={132}
            height={132}
            className="size-20 shrink-0 object-contain sm:size-28 lg:size-33"
          />
        </section>

        <section className="flex w-full flex-col gap-5">
          <h2 className="text-[20px] font-semibold leading-8 text-[#494453]">
            {t('zodiac12.gridTitle')}
          </h2>

          <div className="flex w-full flex-col items-stretch gap-5 xl:flex-row">
            <div className="min-w-0 flex-1">{renderSlotGrid(RED_SLOTS)}</div>
            <div className="min-w-0 flex-1">{renderSlotGrid(BLUE_SLOTS)}</div>
          </div>
          {photosError ? (
            <p className="text-sm text-red-600" role="alert">
              {photosError}
            </p>
          ) : null}
        </section>

        <ZodiacStoryFormPanel
          t={t}
          i18nPrefix="zodiac12"
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
              idPrefix="zodiac12"
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

Zodiac12Content.displayName = 'Zodiac12Content';

export default Zodiac12Content;
