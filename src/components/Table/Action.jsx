import { Dropdown } from "react-bootstrap";
import CheckPermission from "../CheckPermission";
import { forwardRef } from "react";

const Action = ({ dropList, data, ...rest_props }) => {
  const customRef = forwardRef(({ onClick }, ref) => (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="bg-transparent border-0 text-secondary"
    >
      <span className="fas fa-ellipsis-h bg-zinc-200 rounded-full px-2"></span>
    </button>
  ));
  return (
    <Dropdown className="w-full mx-2 flex items-center justify-center">
      <Dropdown.Toggle as={customRef}></Dropdown.Toggle>
      <Dropdown.Menu>
        {dropList.map((row, i) => {
          const { className, name, ...rest } = row;

          return CheckPermission({
            module_id: row?.module_id || true,
            action: row?.action || "view",
          }) ? (
            <Dropdown.Item
              {...rest}
              key={i}
              main-data={JSON.stringify(data)}
              className={`dropdown-item ${className ? className : ""}`}
              eventKey={i}
            >
              {data?.role === "passenger" && name === "Upload Documents for KYC"
                ? ""
                : name}
            </Dropdown.Item>
          ) : null;
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Action;
