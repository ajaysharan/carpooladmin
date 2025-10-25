import { Link } from "react-router-dom";

import Divider from "../components/Admin/Sidebar/Divider";
import SingleLink from "../components/Admin/Sidebar/SingleLink";
import MultiLink from "../components/Admin/Sidebar/MultiLink";
import ScrollWrapper from "./ScrollWrapper";
const SideBar = ({ toggle, setHover, menu, logoUrl = "", setToggle}) => {
    // const [toggle, settoggle] = useState(toggle || false);
  // const { logo, application_name } = useSelector(
  //   (store) => store.theme.settings
  // );


  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          border-r border-slate-700/50 backdrop-blur-xl transition-all duration-400 ease-in-out z-50
          ${toggle ? 'hidden md:block sm:block w-14' : 'w-56'}`}
          mini="false"
          id="sidenav-main"
    >
  
      {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-700/50">
          <div className={`flex items-center space-x-2 ${toggle ? 'justify-center' : ''}`}>
            <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            {!toggle && (
              <div>
                <h1 className="text-white font-semibold text-sm">RideShare</h1>
              </div>
            )}
          </div>
         
          {/* <button
            onClick={toggleSidebar}
            className={`${toggleSidebar ? 'ms-4' : ''} p-1.5 rounded-md hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white`}
          >
            <Menu className="w-5 h-6" />
          </button> */}
        </div>
      <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />

      <ScrollWrapper
        style={{ maxHeight: "100%" }}
        className="items-center min-h-[80%]  block w-auto overflow-y-scroll h-sidenav grow basis-full ">
        <div
          onMouseEnter={() => {
            if (toggle) setHover(true);
            setToggle(false);
          }}
          onMouseLeave={() => toggle && setHover(false)}
          // className={`collapse navbar-collapse ${!toggle && "show"}`}
        >
          <ul className="flex flex-col pl-0 mb-0">
            {menu.map((link) => {
              if (link.children && link.children.length > 0) {
                return <MultiLink key={link.name} {...link} toggle={toggle} />;
              }

              if (link.url && link.url.length > 0) {
                return <SingleLink key={link.name} {...link} toggle={toggle} />;
              }

              if (link.url === undefined || link.children === undefined) {
                return <Divider key={link.name} {...link} toggle={toggle} />;
              }
              return null;
            })}
          </ul>
        </div>
      </ScrollWrapper>
    </aside>
  );
};

export default SideBar;
