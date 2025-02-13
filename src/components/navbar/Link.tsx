import React, { useMemo, useCallback } from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { SelectedPage } from "../../types";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedPage } from "../../redux/features/layoutSlice";
import { RootState, AppDispatch } from "../../redux/app/store";

type Props = {
  page: string;
};

const Link: React.FC<Props> = React.memo(({ page }) => {
  const dispatch = useDispatch<AppDispatch>();

  const selectedPage = useSelector(
    (state: RootState) => state.layout.selectedPage
  );

  // Memoize the computed `toLowercasePage`
  const toLowercasePage = useMemo(
    () => page.toLowerCase().replace(/ /g, "") as SelectedPage,
    [page]
  );

  // Memoize onClick handler
  const handleClick = useCallback(() => {
    dispatch(setSelectedPage(toLowercasePage));
  }, [dispatch, toLowercasePage]);

  return (
    <AnchorLink
      className={`${
        selectedPage === toLowercasePage ? "text-primary-500" : ""
      } transition duration-500 hover:text-primary-300`}
      href={`#${toLowercasePage}`}
      onClick={handleClick}
    >
      {page}
    </AnchorLink>
  );
});

export default Link;
