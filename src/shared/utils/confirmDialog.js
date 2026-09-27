import Swal from 'sweetalert2';

const THEME_RED = '#ee1c25';
const THEME_BLUE = '#4048cd';

/**
 * @param {{
 *   title: string,
 *   text?: string,
 *   confirmButtonText: string,
 *   cancelButtonText: string,
 * }} options
 * @returns {Promise<boolean>}
 */
export const confirmDestructiveAction = async ({
  title,
  text,
  confirmButtonText,
  cancelButtonText,
}) => {
  const result = await Swal.fire({
    titleText: title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: THEME_RED,
    cancelButtonColor: THEME_BLUE,
    focusCancel: true,
  });

  return result.isConfirmed;
};
