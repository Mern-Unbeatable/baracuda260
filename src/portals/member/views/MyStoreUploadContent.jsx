import { ArrowLeft, CloudUpload, Images, Info } from 'lucide-react';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import Input from '@/components/ui/Input';
import {
  buildStoreFormFromProduct,
  EMPTY_STORE_UPLOAD_FORM,
  getStoreProductById,
  MY_STORE_CATEGORY_OPTIONS,
} from '@/portals/member/data/myStoreData';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  createStoreProductApi,
  getStoreProductDetailsApi,
  STORE_PRODUCT_DETAILS_QUERY_KEY,
  STORE_PRODUCTS_QUERY_KEY,
  updateStoreProductApi,
} from '@/shared/api/store.api';
import { ROUTES } from '@/shared/config';

const FieldLabel = memo(({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="mb-2 block text-[11px] font-bold tracking-[0.14em] text-[#8b93a7]"
  >
    {children}
  </label>
));
FieldLabel.displayName = 'FieldLabel';

const DropzoneField = memo(
  ({
    id,
    label,
    hint,
    fileName,
    preview,
    inputRef,
    onChange,
    multiple = false,
    error,
  }) => {
    const { t } = useTranslation();

    return (
      <div>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Button
          unstyled
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex min-h-45 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed bg-white px-4 py-8 text-center transition hover:border-[#4048cd] hover:bg-[#fafbff] ${
            error ? 'border-red-500' : 'border-[#d5d8e8]'
          }`}
        >
          {preview ? (
            <Image
              src={preview}
              alt=""
              className="max-h-28 rounded-lg object-cover"
            />
          ) : (
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#f3f4ff] text-[#4048cd]">
              <CloudUpload size={22} aria-hidden="true" />
            </span>
          )}
          <p className="text-[15px] font-semibold text-[#373737]">
            {fileName || t('myStore.upload.dropTitle')}
          </p>
          {!fileName ? (
            <p className="text-[13px] text-[#9aa3b5]">
              {t('myStore.upload.dropHint')}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-[#9aa3b5]">
            <span className="inline-flex items-center gap-1">
              <Info size={12} aria-hidden="true" />
              {hint}
            </span>
          </div>
        </Button>
        {error ? (
          <p className="mt-1 text-[11px] text-red-500">{error}</p>
        ) : null}
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple={multiple}
          className="sr-only"
          onChange={onChange}
        />
      </div>
    );
  },
);
DropzoneField.displayName = 'DropzoneField';

const MyStoreUploadContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const editingProduct = useMemo(
    () => (id ? getStoreProductById(id) : null),
    [id],
  );

  const bannerRef = useRef(null);
  const othersRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: editingProduct
      ? { ...buildStoreFormFromProduct(editingProduct), copyrightOk: true }
      : { ...EMPTY_STORE_UPLOAD_FORM, copyrightOk: false },
  });

  const [bannerPreview, setBannerPreview] = useState(
    () => editingProduct?.image || '',
  );
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerName, setBannerName] = useState('');
  const [otherFiles, setOtherFiles] = useState([]);
  const [othersName, setOthersName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bannerError, setBannerError] = useState('');

  useEffect(() => {
    let isCancelled = false;

    if (!id) {
      reset({ ...EMPTY_STORE_UPLOAD_FORM, copyrightOk: false });
      setBannerPreview('');
      setBannerFile(null);
      setBannerName('');
      setOtherFiles([]);
      setOthersName('');
      return undefined;
    }

    const loadProduct = async () => {
      try {
        const liveProduct = await getStoreProductDetailsApi(id);
        if (isCancelled) return;
        if (liveProduct) {
          reset({ ...buildStoreFormFromProduct(liveProduct), copyrightOk: true });
          setBannerPreview(liveProduct.image || liveProduct.bannerImage || '');
          setBannerFile(null);
          setBannerName(t('myStore.upload.currentBanner'));
          setOtherFiles([]);
          setOthersName('');
          return;
        }
      } catch {
        // Fallback to local mock data if API fails or item is in mock
      }

      const product = getStoreProductById(id);
      if (isCancelled || !product) return;
      reset({ ...buildStoreFormFromProduct(product), copyrightOk: true });
      setBannerPreview(product.image || '');
      setBannerFile(null);
      setBannerName(t('myStore.upload.currentBanner'));
      setOtherFiles([]);
      setOthersName('');
    };

    loadProduct();

    return () => {
      isCancelled = true;
    };
  }, [id, t, reset]);

  useEffect(
    () => () => {
      if (bannerPreview?.startsWith?.('blob:'))
        URL.revokeObjectURL(bannerPreview);
    },
    [bannerPreview],
  );

  const handleBannerChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBannerPreview((prev) => {
      if (prev?.startsWith?.('blob:')) URL.revokeObjectURL(prev);
      return url;
    });
    setBannerFile(file);
    setBannerName(file.name);
    setBannerError('');
    event.target.value = '';
  };

  const handleOthersChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setOtherFiles(files);
    setOthersName(
      files.length === 1
        ? files[0].name
        : t('myStore.upload.filesSelected', { count: files.length }),
    );
    event.target.value = '';
  };

  const onSubmit = async (_data) => {
    if (!isEditing && !bannerFile) {
      setBannerError(t('myStore.upload.errors.banner'));
      toast.error(t('myStore.upload.errors.banner'));
      return;
    }
    if (isEditing && !bannerFile && !bannerPreview) {
      setBannerError(t('myStore.upload.errors.banner'));
      toast.error(t('myStore.upload.errors.banner'));
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', _data.title.trim());
      formData.append('category', _data.category);
      formData.append('price', String(_data.price).replace(/[^0-9.]/g, ''));
      formData.append('setEditionSize', _data.edition?.trim?.() || '');
      formData.append('description', _data.description?.trim?.() || '');
      formData.append('copyrightConfirmed', 'true');

      if (bannerFile) {
        formData.append('bannerImage', bannerFile);
      }

      if (otherFiles.length > 0) {
        otherFiles.forEach((file) => {
          formData.append('images', file);
        });
      }

      if (isEditing) {
        await updateStoreProductApi(id, formData);
        queryClient.invalidateQueries({ queryKey: [STORE_PRODUCTS_QUERY_KEY] });
        queryClient.invalidateQueries({
          queryKey: [STORE_PRODUCT_DETAILS_QUERY_KEY, id],
        });
        toast.success(t('myStore.upload.updateSuccess'));
      } else {
        await createStoreProductApi(formData);
        queryClient.invalidateQueries({ queryKey: [STORE_PRODUCTS_QUERY_KEY] });
        toast.success(t('myStore.upload.success'));
      }
      navigate(ROUTES.USER_MY_STORE);
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          isEditing
            ? t('myStore.upload.errors.updateFailed', 'Failed to update store product.')
            : t('myStore.upload.errors.createFailed', 'Failed to create store product.'),
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-230 flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link
          to={ROUTES.USER_MY_STORE}
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#e4e4e4] bg-white text-[#373737] transition hover:bg-[#f6f7f9]"
          aria-label={t('myStore.upload.back')}
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </Link>
        <h1 className="text-[18px] font-semibold text-[#687186] sm:text-[20px]">
          {isEditing
            ? t('myStore.upload.editTitle')
            : t('myStore.upload.title')}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="rounded-[18px] bg-[#f0f2f9] p-4 sm:p-6 lg:p-8"
      >
        <div className="flex flex-col gap-5">
          <div>
            <FieldLabel htmlFor="store-title">
              {t('myStore.upload.collectionTitle')}
            </FieldLabel>
            <Input
              id="store-title"
              error={errors.title}
              placeholder={t('myStore.upload.collectionPlaceholder')}
              inputClassName="h-12 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-4 text-[15px] text-[#151e31] outline-none placeholder:text-[#9aa3b5] focus:ring-2 focus:ring-[#4048cd]/25"
              labelClassName="hidden"
              {...register('title', {
                required: t('myStore.upload.errors.title'),
              })}
            />
          </div>

          <div>
            <FieldLabel htmlFor="store-category">
              {t('myStore.upload.category')}
            </FieldLabel>
            <select
              id="store-category"
              className="h-12 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-3 text-[15px] text-[#151e31] outline-none focus:ring-2 focus:ring-[#4048cd]/25"
              {...register('category')}
            >
              {MY_STORE_CATEGORY_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel htmlFor="store-price">
              {t('myStore.upload.price')}
            </FieldLabel>
            <Input
              id="store-price"
              type="number"
              error={errors.price}
              placeholder={t('myStore.upload.pricePlaceholder')}
              inputClassName="h-12 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-4 text-[15px] text-[#151e31] outline-none placeholder:text-[#9aa3b5] focus:ring-2 focus:ring-[#4048cd]/25"
              labelClassName="hidden"
              {...register('price', {
                required: t('myStore.upload.errors.price'),
              })}
            />
          </div>

          <div>
            <FieldLabel htmlFor="store-edition">
              {t('myStore.upload.edition')}
            </FieldLabel>
            <Input
              id="store-edition"
              error={errors.edition}
              placeholder={t('myStore.upload.editionPlaceholder')}
              inputClassName="h-12 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-4 text-[15px] text-[#151e31] outline-none placeholder:text-[#9aa3b5] focus:ring-2 focus:ring-[#4048cd]/25"
              labelClassName="hidden"
              {...register('edition')}
            />
          </div>

          <div>
            <FieldLabel htmlFor="store-description">
              {t('myStore.upload.description')}
            </FieldLabel>
            <textarea
              id="store-description"
              placeholder={t('myStore.upload.descriptionPlaceholder')}
              rows={5}
              className="w-full resize-y rounded-[10px] border border-[#e4e8f8] bg-white px-4 py-3 text-[15px] text-[#151e31] outline-none placeholder:text-[#9aa3b5] focus:ring-2 focus:ring-[#4048cd]/25"
              {...register('description')}
            />
          </div>

          <DropzoneField
            id="store-banner"
            label={t('myStore.upload.banner')}
            hint={t('myStore.upload.bannerMeta')}
            fileName={bannerName}
            preview={bannerPreview}
            inputRef={bannerRef}
            onChange={handleBannerChange}
            error={bannerError}
          />

          <DropzoneField
            id="store-others"
            label={t('myStore.upload.others')}
            hint={t('myStore.upload.othersMeta')}
            fileName={othersName}
            inputRef={othersRef}
            onChange={handleOthersChange}
            multiple
          />

          <div className="flex flex-col gap-1.5 pt-1">
            <label className="flex cursor-pointer select-none items-start gap-2.5">
              <input
                type="checkbox"
                id="store-copyright"
                className="mt-1 size-4 rounded border-[#e4e8f8] text-[#ee1c25] focus:ring-[#ee1c25]"
                {...register('copyrightOk', {
                  required: t('myStore.upload.errors.copyrightRequired'),
                })}
              />
              <span className="text-[13px] leading-5 text-[#4b5563]">
                {t('myStore.upload.copyrightConfirm')}
              </span>
            </label>
            {errors.copyrightOk ? (
              <p className="text-[12px] text-red-500">
                {errors.copyrightOk.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            unstyled={true}
            disabled={submitting}
            className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ee1c25] px-4 text-[15px] font-bold text-white transition hover:bg-[#d41921] disabled:cursor-default disabled:opacity-60"
          >
            <Images size={18} aria-hidden="true" />
            {submitting
              ? t('myStore.upload.submitting')
              : isEditing
                ? t('myStore.upload.updateSubmit')
                : t('myStore.upload.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
});

MyStoreUploadContent.displayName = 'MyStoreUploadContent';

export default MyStoreUploadContent;
