import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, CloudUpload, Images, Info } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import {
  EMPTY_STORE_UPLOAD_FORM,
  MY_STORE_CATEGORY_OPTIONS,
  buildStoreFormFromProduct,
  getStoreProductById,
} from '@/portals/member/data/myStoreData';

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
  ({ id, label, hint, fileName, preview, inputRef, onChange, multiple = false }) => {
    const { t } = useTranslation();

    return (
      <div>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-[#d5d8e8] bg-white px-4 py-8 text-center transition hover:border-[#4048cd] hover:bg-[#fafbff]"
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

  const [form, setForm] = useState(() =>
    editingProduct ? buildStoreFormFromProduct(editingProduct) : { ...EMPTY_STORE_UPLOAD_FORM },
  );
  const [bannerPreview, setBannerPreview] = useState(() => editingProduct?.image || '');
  const [bannerName, setBannerName] = useState('');
  const [othersName, setOthersName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      setForm({ ...EMPTY_STORE_UPLOAD_FORM });
      setBannerPreview('');
      setBannerName('');
      setOthersName('');
      return;
    }

    const product = getStoreProductById(id);
    if (!product) return;

    setForm(buildStoreFormFromProduct(product));
    setBannerPreview(product.image || '');
    setBannerName(t('myStore.upload.currentBanner'));
    setOthersName('');
  }, [id, t]);

  useEffect(
    () => () => {
      if (bannerPreview?.startsWith?.('blob:')) URL.revokeObjectURL(bannerPreview);
    },
    [bannerPreview],
  );

  const patch = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleBannerChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBannerPreview((prev) => {
      if (prev?.startsWith?.('blob:')) URL.revokeObjectURL(prev);
      return url;
    });
    setBannerName(file.name);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      toast.error(t('myStore.upload.errors.title'));
      return;
    }
    if (!form.price.trim()) {
      toast.error(t('myStore.upload.errors.price'));
      return;
    }
    if (!bannerName && !bannerPreview) {
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
    <div className="mx-auto flex w-full max-w-[920px] flex-col gap-5">
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

      <form onSubmit={handleSubmit} className="rounded-[18px] bg-[#f0f2f9] p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5">
          <div>
            <FieldLabel htmlFor="store-title">{t('myStore.upload.collectionTitle')}</FieldLabel>
            <input
              id="store-title"
              value={form.title}
              onChange={(event) => patch('title', event.target.value)}
              placeholder={t('myStore.upload.collectionPlaceholder')}
              className="h-12 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-4 text-[15px] text-[#151e31] outline-none placeholder:text-[#9aa3b5] focus:ring-2 focus:ring-[#4048cd]/25"
            />
          </div>

          <div>
            <FieldLabel htmlFor="store-category">{t('myStore.upload.category')}</FieldLabel>
            <select
              id="store-category"
              value={form.category}
              onChange={(event) => patch('category', event.target.value)}
              className="h-12 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-3 text-[15px] text-[#151e31] outline-none focus:ring-2 focus:ring-[#4048cd]/25"
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
            <input
              id="store-price"
              value={form.price}
              onChange={(event) => patch('price', event.target.value)}
              placeholder={t('myStore.upload.pricePlaceholder')}
              className="h-12 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-4 text-[15px] text-[#151e31] outline-none placeholder:text-[#9aa3b5] focus:ring-2 focus:ring-[#4048cd]/25"
            />
          </div>

          <div>
            <FieldLabel htmlFor="store-edition">{t('myStore.upload.edition')}</FieldLabel>
            <input
              id="store-edition"
              value={form.edition}
              onChange={(event) => patch('edition', event.target.value)}
              placeholder={t('myStore.upload.editionPlaceholder')}
              className="h-12 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-4 text-[15px] text-[#151e31] outline-none placeholder:text-[#9aa3b5] focus:ring-2 focus:ring-[#4048cd]/25"
            />
          </div>

          <div>
            <FieldLabel htmlFor="store-description">{t('myStore.upload.description')}</FieldLabel>
            <textarea
              id="store-description"
              value={form.description}
              onChange={(event) => patch('description', event.target.value)}
              placeholder={t('myStore.upload.descriptionPlaceholder')}
              rows={5}
              className="w-full resize-y rounded-[10px] border border-[#e4e8f8] bg-white px-4 py-3 text-[15px] text-[#151e31] outline-none placeholder:text-[#9aa3b5] focus:ring-2 focus:ring-[#4048cd]/25"
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

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-[#ee1c25] px-4 text-[15px] font-bold text-white transition hover:bg-[#d41921] disabled:cursor-default disabled:opacity-60"
          >
            <Images size={18} aria-hidden="true" />
            {submitting
              ? t('myStore.upload.submitting')
              : isEditing
                ? t('myStore.upload.updateSubmit')
                : t('myStore.upload.submit')}
          </button>
        </div>
      </form>
    </div>
  );
});

MyStoreUploadContent.displayName = 'MyStoreUploadContent';

export default MyStoreUploadContent;
