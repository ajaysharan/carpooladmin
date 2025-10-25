// src/components/Header.jsx
// import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faInfoCircle, faUser } from "@fortawesome/free-solid-svg-icons";

import {faBell, faClock, faCog} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getSocket } from "../services/socket";

export default function Header(props) {
  const admin = props.user;
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleNotificationHistory = (history) => {
      setNotifications(history);
      setNotificationCount(history?.length)
    };

    const handleNewNotification = (newNotif) => {
      setNotifications((prev) => [...prev, newNotif]);
      setNotificationCount(notificationCount + 1)
    };

    socket.emit("get_notification", { receiverId: admin._id });

    socket.on("notification", handleNotificationHistory);
    
    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("notification", handleNotificationHistory);
      socket.off("new_notification", handleNewNotification);
    };
  }, [admin?._id,]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  return (
    <nav className="mt-1 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 backdrop-blur-xl  text-white
      relative  flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all shadow-none duration-250 ease-soft-in rounded-2xl lg:flex-nowrap lg:justify-start"
      navbar-main="true"
      navbar-scroll="true"
    >
      <div className="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
        <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
          <a
            className={`${props.toggle ? '' : 'hidden'} hidden sm:block md:block text-white  p-0 transition-all ease-nav-brand text-sm cursor-pointer`}
            sidenav-trigger={`${props.toggle}`}
            onClick={(e) => {
              e.preventDefault();
              props.setToggleMiddle(!props.toggle);
            }}
          >
            <div className="w-4.5 overflow-hidden">
              <i
                className={`ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-white transition-all ${
                  props.toggle === false ? "translate-x-[5px]" : ""
                }`}
              ></i>
              <i className="ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-white transition-all"></i>
              <i
                className={`ease-soft relative block h-0.5 rounded-sm bg-white transition-all ${
                  props.toggle === false ? "translate-x-[5px]" : ""
                }`}
              ></i>
            </div>
          </a>
        </div>
        <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto justify-end">         
          <ul className="flex flex-row justify-end pl-0 mb-0 list-none md-max:w-full">
            <li className="flex items-center">
              <a
                href="/login"
                className="block px-0 py-2 font-semibold transition-all ease-nav-brand text-sm "
              >
                <FontAwesomeIcon icon={faUser} className="sm:mr-1" />
                <span className="hidden sm:inline">Sign In</span>
              </a>
            </li>

            <li className="flex items-center pl-4">
              <a
                href="/admin/logout"
                className="block px-0 py-2 font-semibold transition-all ease-nav-brand text-sm "
              >
                <i className="sm:mr-1 fa fa-sign-out"></i>
              </a>
            </li>

            <li className="flex items-center pl-4 xl:hidden">
              <a
                className="block p-0 transition-all ease-nav-brand text-sm  cursor-pointer"
                sidenav-trigger={`${props.toggle}`}
                onClick={(e) => {
                  e.preventDefault();
                  props.setToggleMiddle(!props.toggle);
                }}
              >
                <div className="w-4.5 overflow-hidden">
                  <i
                    className={`ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-white transition-all ${
                      props.toggle === false ? "translate-x-[5px]" : ""
                    }`}
                  ></i>
                  <i className="ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-white transition-all"></i>
                  <i
                    className={`ease-soft relative block h-0.5 rounded-sm bg-white transition-all ${
                      props.toggle === false ? "translate-x-[5px]" : ""
                    }`}
                  ></i>
                </div>
              </a>
            </li>
            <li className="flex items-center px-4">
              <a
                href="/admin/general-settings/1"
                className="p-0 transition-all text-sm ease-nav-brand "
              >             
                <FontAwesomeIcon
                  icon={faCog}              
                  className="cursor-pointer"
                  fixed-plugin-button-nav="true"
                />
              </a>
            </li>
            <li className="flex items-center ps-2 pe-4">
              <a
                href="/admin/admin-profile"
                className="p-0 transition-all text-sm ease-nav-brand "
              >
                               
                  <FontAwesomeIcon 
                  icon={faUser}
                   className="cursor-pointer  "
                    fixed-plugin-button-nav="true"/>
                  
              </a>
            </li>
            {/* notifications */}
            <li className="relative flex items-center pr-2">
              <p className="hidden transform-dropdown-show"></p>
              <a
                className="block p-0 transition-all text-sm ease-nav-brand"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
              >
                <FontAwesomeIcon icon={faBell} className="cursor-pointer" />
                {/* Notification Count Badge */}
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </a>

              <ul
                className={`text-sm transform-dropdown before:font-awesome before:leading-default before:duration-350 before:ease-soft lg:shadow-soft-3xl duration-250 min-w-44 before:sm:right-7.5 before:text-5.5 absolute right-0 top-0 z-50 origin-top list-none rounded-lg border-0 border-solid border-transparent bg-white bg-clip-padding px-2 py-4 text-left transition-all before:absolute before:right-2 before:left-auto before:top-0 before:z-50 before:inline-block before:font-normal before:text-white before:antialiased before:transition-all before:content-['\f0d8'] sm:-mr-6 lg:absolute lg:right-0 lg:left-auto lg:mt-2 lg:block lg:cursor-pointer
                  ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
              >
                {/* Notification items here */}
                {notifications?.map((notification) => (
                <li className="relative" key={notification?._id}>
                  <a
                    className="ease-soft min-w-[300px] py-1.2 clear-both block w-full whitespace-nowrap rounded-lg px-4 transition-colors duration-300 hover:bg-gray-200 hover:text-slate-700"
                    href="#!"
                  >
                    <div className="flex py-1">
                      <div className="inline-flex items-center justify-center my-auto mr-4 text-white transition-all duration-200 ease-nav-brand text-sm bg-gradient-to-tl from-slate-600 to-slate-300 h-9 w-9 rounded-xl">
                           <FontAwesomeIcon icon={faInfoCircle} className="cursor-pointer" />
                      </div>
                     
                      <div className="flex flex-col justify-center">
                        <h6 className="mb-1 font-normal leading-normal text-sm">{notification?.heading}</h6>
                        <p className="mb-0 leading-tight text-xs text-slate-400"><FontAwesomeIcon icon={faClock} className="mr-1" />2 days</p>
                      </div>
                    </div>
                  </a>
                </li>
                ))}
               
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
