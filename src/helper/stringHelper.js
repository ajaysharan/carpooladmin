const getDeleteConfig = ({
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  icon = "warning",
  confirmButtonText = "Yes, Delete",
}) => {
  return {
    title,
    text,
    icon,
    confirmButtonText,
    buttonsStyling: false,
    showCancelButton: true,
    // confirmButtonColor: '#3085d6',
    // cancelButtonColor: '#d33',
    customClass: {
      // container: '...',
      popup: "p-3 m-0 d-flex flex-column gap-3 align-items-center",
      title: "h3 p-0 m-0",
      icon: "m-0 mx-auto my-3",
      color: "text-secondary hover:text-white",
      // image: '...',
      htmlContainer: "m-0 m-0 fs-0",
      // input: '...',
      // inputLabel: '...',
      // validationMessage: '...',
      actions: "m-0 p-0",
      denyButton: "btn btn-secondary",
      closeButton: "btn btn-secondary",
      confirmButton:
        "swal2-confirm btn rounded btn-outline-danger mx-2 p-2",
      cancelButton:
        "swal2-cancel btn btn-outline-secondary rounded p-2 mx-2",
      // loader: '...',
      // footer: '...',
      // timerProgressBar: '...',
    },
  };
};

export { getDeleteConfig };
