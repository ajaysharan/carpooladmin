import { useLocation, Link } from "react-router-dom";

const SingleLink = ({ url, icon, name, toggle }) => {
  const { pathname } = useLocation();
  const isActive = pathname === url;

  return (
    <li className="my-2 w-full">
      {/* <button
        onClick={() => setShow(!show)}
        className={`
          group flex items-center w-full p-2 rounded-lg transition-all duration-200 text-sm
          ${show || isAnyChildActive
            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }
        `}
      ></button> */}
      <Link
        to={url}
        className={`group flex items-center w-full p-2 rounded-lg transition-all duration-200 text-sm ${
          isActive
            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20   text-white'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
        }`}
      >
        <span
          className={`mr-3 flex h-8 w-8 items-center justify-center rounded-md  shadow ${
            isActive
              ? "bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white"
              : "text-gray-700 bg-white"
          }`}
        >
          <i className={icon}></i>
        </span>
        {!toggle ? (
             <span>{name}</span>
            ) : null}
       
      </Link>
    </li>
  );
};

export default SingleLink;
