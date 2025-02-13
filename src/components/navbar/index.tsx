import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Logo from "../../assets/sitelogo.png";
import Link from "./Link";
import Preference from "../preference";
import Date from "./date";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/app/store";
import { categories, sources } from "../../utils/data";
import MenuDropdown from "../../shared_components/MenuDropdown";
import { setSearchFilters } from "../../redux/features/articleSlice";
import useSearchDebounce from "../../hooks/useSearchDebounce";
import { preferences } from "../../utils/function";
const Navbar = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSource, setSelectedSource] = useState<string>(
    preferences()?.source ? "" : "NewYorkTimes"
  );
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearch = useSearchDebounce(searchTerm, 500);

  const dispatch = useDispatch<AppDispatch>();

  const { isTopOfPage } = useSelector((state: RootState) => state.layout);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const flexBetween = "flex items-center justify-between";
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const navBackgroundColor = isTopOfPage ? "" : "bg-primary-100 drop-shadow";

  const mobileMenuCloseOnCustomise = () => {
    setIsOpenModal(true);
    setIsMenuToggled(!isMenuToggled);
  };
  // Memoized options array for dropdown (only changes if values change)
  const categoryOptions = useMemo(() => categories, []);
  const sourceOptions = useMemo(() => sources, []);

  // Memoized handlers for dropdown (do not recreate on re-render)
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);
  const handleSourceChange = useCallback((value: string) => {
    setSelectedSource(value);
  }, []);
  //const isFirstRender = useRef<boolean>(true);
  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return;
    // }
    dispatch(
      setSearchFilters({
        filterCategory: selectedCategory,
        filterSource: selectedSource,
        filterDate: selectedDate,
        searchTerm: searchTerm,
      })
    );
  }, [selectedCategory, selectedSource, selectedDate, debouncedSearch]);
  return (
    <nav>
      <div
        className={`${navBackgroundColor} ${flexBetween} fixed top-0 z-30 w-full py-6`}
      >
        <div className={`${flexBetween} mx-auto w-5/6`}>
          <div className={`${flexBetween} w-full gap-8`}>
            {/* LEFT SIDE */}
            <img alt="logo" src={Logo} />

            {/* RIGHT SIDE */}
            {isAboveMediumScreens ? (
              <div className={`${flexBetween} w-full`}>
                <div className={`${flexBetween} gap-6 text-sm`}>
                  <Link page="Home" />
                  <Link page="Contact Us" />
                  <p
                    className="cursor-pointer hover:text-primary-300"
                    onClick={() => setIsOpenModal(true)}
                  >
                    Customize
                  </p>

                  {/* Source Dropdown */}
                  <MenuDropdown
                    label="Source"
                    options={sourceOptions}
                    selectedValue={selectedSource}
                    onChange={handleSourceChange}
                  />
                  {/* Category Dropdown */}
                  <MenuDropdown
                    label="Category"
                    options={categoryOptions}
                    selectedValue={selectedCategory}
                    onChange={handleCategoryChange}
                  />

                  {/* Date Menu  */}
                  <Date
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                  />
                </div>
                <div className={`${flexBetween} gap-8 text-sm`}>
                  <div className="relative">
                    <input
                      value={searchTerm}
                      type="text"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className="w-54 px-4 py-2 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <button
                className="rounded-full bg-secondary-500 p-2"
                onClick={() => setIsMenuToggled(!isMenuToggled)}
              >
                <Bars3Icon className="h-6 w-6 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* MOBILE MENU MODAL */}
      {!isAboveMediumScreens && isMenuToggled && (
        <div className="fixed right-0 bottom-0 z-40 h-full w-[300px] bg-primary-100 drop-shadow-xl overflow-y-auto">
          {/* CLOSE ICON */}
          <div className="flex justify-end p-12">
            <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          {/* MENU ITEMS */}
          <div className="m-[33%] flex flex-col gap-10 text-2xl">
            <Link page="Home" />
            <Link page="Contact Us" />
            <p
              className="cursor-pointer hover:text-primary-300"
              onClick={mobileMenuCloseOnCustomise}
            >
              Customize
            </p>
          </div>
        </div>
      )}
      {/* Modal Overlay */}
      {isOpenModal && <Preference setIsOpenModal={setIsOpenModal} />}
    </nav>
  );
};

export default Navbar;
