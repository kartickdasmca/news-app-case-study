import { SelectedPage } from "../../types";
import HText from "../../shared_components/HText";
import { motion } from "framer-motion";
import Articale from "./Articale";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/app/store";
import { setSelectedPage } from "../../redux/features/layoutSlice";
import { useEffect, useState } from "react";
import { fetchArticles } from "../../redux/features/articleSlice";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    articles,
    status,
    filterCategory,
    filterSource,
    filterDate,
    searchTerm,
  } = useSelector((state: RootState) => state.articles);
  const { category, source, author } = useSelector(
    (state: RootState) => state.preferences
  );
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);

  // Get current items for the page
  const offset = currentPage * itemsPerPage;
  const currentItems = articles.slice(offset, offset + itemsPerPage);

  // Handle page click
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    dispatch(fetchArticles());
  }, [
    dispatch,
    filterCategory,
    filterSource,
    filterDate,
    searchTerm,
    category,
    source,
    author,
  ]);

  return (
    <section id="home" className="gap-16 bg-gray-20 py-10 md:h-auto md:pb-0">
      <motion.div
        onViewportEnter={() => dispatch(setSelectedPage(SelectedPage.Home))}
        className="min-h-full mx-auto w-5/6"
      >
        {/* HEADER  */}
        <motion.div
          className="mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <HText>
            MORE THAN JUST <span className="text-primary-500">NEWS</span>
          </HText>
          <p className="my-5 text-sm">
            Forbes News Network creates fearless content across broadcast,
            television and digital while preserving a century-old legacy with
            unflinching determination to deliver the truth of time.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {status === "loading" ? (
            <p className="text-gray-500">Loading articles...</p>
          ) : articles && articles.length > 0 ? (
            <>
              {currentItems.map((article) => (
                <Articale
                  key={article.title}
                  title={article.title}
                  description={article.description}
                  image={article.image}
                  date={article.date}
                  author={article.author}
                  source={article.source}
                  web_url={article.web_url}
                />
              ))}
            </>
          ) : (
            <p className="text-gray-500">No articles found.</p>
          )}
        </div>
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={Math.ceil(articles.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName="pagination flex justify-center space-x-2 mt-4"
          previousClassName="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
          nextClassName="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
          pageClassName="px-3 py-1 border rounded hover:bg-gray-300 cursor-pointer"
          activeClassName="bg-blue-500 text-white"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </motion.div>
    </section>
  );
};

export default Home;
