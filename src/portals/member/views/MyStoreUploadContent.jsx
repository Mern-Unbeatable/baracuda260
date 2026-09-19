import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { ArrowLeft, CloudUpload, Images, Info } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import {
  EMPTY_STORE_UPLOAD_FORM,
  MY_STORE_CATEGORY_OPTIONS,
  buildStoreFormFromProduct,
  getStoreProductById,
} from '@/portals/member/data/myStoreData';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

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
  ({ id, label, hint, fileName, preview, inputRef, onChange, multiple = false, error }) => {
    const { t } = useTranslation();

    return (
      <div>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex min-h-45 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed bg-white px-4 py-8 text-center transition hover:border-[#4048cd] hover:bg-[#fafbff] ${
            error ? 'border-red-500' : 'border-[#d5d8e8]'
          }`}
        >
          {preview ? (
            <img src={preview} alt="" className="max-h-28 rounded-lg object-cover" />
          ) : (
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#f3f4ff] text-[#4048cd]">
              <CloudUpload size={22} aria-hidden="true" />
            </span>
          )}
          <p className="text-[15px] font-semibold text-[#373737]">
            {fileName || t('myStore.upload.dropTitle')}
          </p>
          {!fileName ? (
            <p className="text-[13px] text-[#9aa3b5]">{t('myStore.upload.dropHint')}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-[#9aa3b5]">
            <span className="inline-flex items-center gap-1">
              <Info size={12} aria-hidden="true" />
              {hint}
            </span>
          </div>
        </button>
        {error ? (
          <p className="mt-1 text-[11px] text-red-500">{error}</p>
        ) : null}
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
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
  const { id } = useParams();
  const editingProduct = useMemo(() => (id ? getStoreProductById(id) : null), [id]);
  const isEditing = Boolean(editingProduct);

  const bannerRef = useRef(null);
  const othersRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: editingProduct ? buildStoreFormFromProduct(editingProduct) : { ...EMPTY_STORE_UPLOAD_FORM },
  });

  const [bannerPreview, setBannerPreview] = useState(() => editingProduct?.image || '');
  const [bannerName, setBannerName] = useState('');
  const [othersName, setOthersName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bannerError, setBannerError] = useState('');

  useEffect(() => {
    if (!id) {
      reset({ ...EMPTY_STORE_UPLOAD_FORM });
      setBannerPreview('');
      setBannerName('');
      setOthersName('');
      return;
    }

    const product = getStoreProductById(id);
    if (!product) return;

    reset(buildStoreFormFromProduct(product));
    setBannerPreview(product.image || '');
    setBannerName(t('myStore.upload.currentBanner'));
    setOthersName('');
  }, [id, t, reset]);

  useEffect(
    () => () => {
      if (bannerPreview?.startsWith?.('blob:')) URL.revokeObjectURL(bannerPreview);
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
    setBannerName(file.name);
    setBannerError('');
    event.target.value = '';
  };

  const handleOthersChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setOthersName(
      files.length === 1
        ? files[0].name
        : t('myStore.upload.filesSelected', { count: files.length }),
    );
    event.target.value = '';
  };

  const onSubmit = async (data) => {
    if (!bannerName && !bannerPreview) {
      setBannerError(t('myStore.upload.errors.banner'));
      toast.error(t('myStore.upload.errors.banner'));
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setSubmitting(false);
    toast.success(isEditing ? t('myStore.upload.updateSuccess') : t('myStore.upload.success'));
    navigate(ROUTES.ADMIN_MY_STORE);
  };

  return (
    <div className="mx-auto flex w-full max-w-230 flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link
          to={ROUTES.ADMIN_MY_STORE}
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#e4e4e4] bg-white text-[#373737] transition hover:bg-[#f6f7f9]"
          aria-label={t('myStore.upload.back')}
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </Link>
        <h1 className="text-[18px] font-semibold text-[#687186] sm:text-[20px]">
          {isEditing ? t('myStore.upload.editTitle') : t('myStore.upload.title')}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-[18px] bg-[#f0f2f9] p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5">
          <div>
            <FieldLabel htmlFor="store-title">{t('myStore.upload.collectionTitle')}</FieldLabel>
            <Input
              id="store-title"
              error={errors.title}
              placeholder={t('myStore.upload.collectionPlaceholder')}
              inputClassName="h-12 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-4 text-[15px] text-[#151e31] outline-none placeholder:text-[#9aa3b5] focus:ring-2 focus:ring-[#4048cd]/25"
              labelClassName="hidden"
              {...register('title', { required: t('myStore.upload.errors.title') })}
            />
          </div>

          <div>
            <FieldLabel htmlFor="store-category">{t('myStore.upload.category')}</FieldLabel>
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
            <FieldLabel htmlFor="store-price">{t('myStore.upload.price')}</FieldLabel>
            <Input
              id="store-price"
              type="number"
              error={errors.price}
              placeholder={t('myStore.upload.pricePlaceholder')}
              inputClassName="h-12 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-4 text-[15px] text-[#151e31] outline-none placeholder:text-[#9aa3b5] focus:ring-2 focus:ring-[#4048cd]/25"
              labelClassName="hidden"
              {...register('price', { required: t('myStore.upload.errors.price') })}
            />
          </div>

          <div>
            <FieldLabel htmlFor="store-edition">{t('myStore.upload.edition')}</FieldLabel>
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
            <FieldLabel htmlFor="store-description">{t('myStore.upload.description')}</FieldLabel>
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
