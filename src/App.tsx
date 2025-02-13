import { useEffect, lazy, Suspense } from "react";
import { SelectedPage } from "./types";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
const Home = lazy(() => import("./components/home"));
const NotFound = lazy(() => import("./components/notfound"));
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/app/store";
import { setIsTopOfPage, setSelectedPage } from "./redux/features/layoutSlice";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div> Loading.. </div>}>
            <Home />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        dispatch(setIsTopOfPage(true));
        dispatch(setSelectedPage(SelectedPage.Home));
      }
      if (window.scrollY !== 0) {
        dispatch(setIsTopOfPage(false));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  );
}

export default App;
