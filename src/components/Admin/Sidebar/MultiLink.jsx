import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const MultiLink = ({ name, icon, children = [] , toggle }) => {
  const { pathname } = useLocation();

  // Check if any child is active
  const isAnyChildActive = children.some((link) => pathname === link.url);

  const [show, setShow] = useState(isAnyChildActive);

  // Optional: update `show` on route change
  useEffect(() => {
    if (isAnyChildActive) {
      setShow(true);
    }
  }, [pathname]);

  return (
    <li className="my-2 w-full">
      <button
        onClick={() => setShow(!show)}
        className={`
          group flex items-center w-full p-2 rounded-lg transition-all duration-200 text-sm
          ${show || isAnyChildActive
            ? 'bg-slate-300 text-white'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }
        `}
      >
        <div className="flex items-center w-full">
          <span className={`mr-3 flex h-8 w-8 items-center justify-center rounded-md  shadow ${show || isAnyChildActive 
             ? "bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white"
              :"text-gray-700 bg-white"
            }`}>
             
            <i className={icon}></i>
          </span>
         {!toggle ? (
            <>
              <span className="ml-2 font-medium flex-1 text-left">{name}</span>
              {children.length > 0 && (
                <ChevronDown 
                  className={`w-3 h-3 transition-transform ${show ? 'rotate-180' : ''}`}
                />
              )}
            </>
          ) : null}
        </div>
      </button>

      {!toggle && children.length > 0 && (
        <ul
          className={`pl-4 mt-2 transition-all duration-200 ease-in-out ${
            show ? 'block' : 'hidden'
          }`}
        >
          {children.map((link, i) => (
            <li key={i} className="my-1">
              <Link
                to={link.url}
                className={`block py-1.5 pl-6 pr-2 rounded-md text-sm transition-all font-medium
                  ${pathname === link.url
                    ? 'text-dark bg-white'
                    : 'text-slate-400 hover:text-white hover:bg-white-700'}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default MultiLink;
