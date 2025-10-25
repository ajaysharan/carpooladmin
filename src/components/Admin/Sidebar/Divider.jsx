const Divider = ({ name }) => {
  return (
    <li className="my-1 w-full">
      <div className="mt-3 mb-2 d-flex align-items-center">
        <div className="d-flex align-items-center">{name}</div>
        <div className="col ps-0">
          <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />
        </div>
      </div>
    </li>
  );
};

export default Divider;
