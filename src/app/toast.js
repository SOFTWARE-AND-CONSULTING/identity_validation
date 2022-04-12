import Swal from "sweetalert2";

export function fireToast(icon, title) {
  Swal.fire({
    icon,
    title,
  });
}

export function loadingFireToast(title) {
  return Swal.fire({
    title,
    allowEscapeKey: false,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export function toastFireError(res, redirect) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: res.message.toUpperCase(),
    timer: 6000,
  }).then(() => {
    if (redirect)
      window.location.href = window.location.href = "/home/dashboard";
  });
}
