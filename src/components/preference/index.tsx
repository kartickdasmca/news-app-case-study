import { useState, useMemo, useCallback } from "react";
import FormDropdown from "../../shared_components/FormDropdown";
import { sources, categoryMapping } from "../../utils/data";
//import useSearchDebounce from "../../hooks/useSearchDebounce";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/app/store";
import { preferences } from "../../utils/function";
import {
  setPreferences,
  clearPreferences,
} from "../../redux/features/preferencesSlice";
import { setSearchFilters } from "../../redux/features/articleSlice";

type props = {
  setIsOpenModal: (value: boolean) => void;
};

const PreferenceModal = ({ setIsOpenModal }: props) => {
  const [category, setCategory] = useState<string>(
    preferences()?.category || ""
  );
  const [source, setSource] = useState<string>(preferences()?.source || "");
  const [author, setAuthor] = useState<string>(preferences()?.author || "");
  const [error, setError] = useState<string>();

  const dispatch = useDispatch<AppDispatch>();
  //Fetching correct category value based on source
  const categories = categoryMapping[source];

  // Memoized options array for dropdown (only changes if values change)
  const categoryOptions = useMemo(() => categories, [source]);
  const sourceOptions = useMemo(() => sources, []);

  // Memoized handlers for dropdown (do not recreate on re-render)
  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
  }, []);
  const handleSourceChange = useCallback((value: string) => {
    setSource(value);
    setCategory("");
  }, []);

  //const debouncedSearch = useSearchDebounce(author, 500);
  // useEffect(() => {
  //dispatch(setPreferences({ author, source, category }));
  // }, [category, source, debouncedSearch]);

  // handle update preference
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (source) {
      dispatch(
        setSearchFilters({
          filterCategory: "",
          filterSource: "",
          filterDate: "",
          searchTerm: "",
        })
      );
      dispatch(setPreferences({ author, source, category }));
      setError("");
      alert("Updated Sucessfully");
    } else {
      setError("Source is mandatory");
    }
  };
  // Clear preferences
  const handleClear = () => {
    setSource("");
    setAuthor("");
    setCategory("");
    dispatch(clearPreferences());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Customize Your Preference</h2>
          <div className="flex justify-end">
            <button onClick={() => setIsOpenModal(false)}>Close</button>
          </div>
        </div>
        {/*Author Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Author
          </label>
          <input
            value={author}
            type="text"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Enter author name"
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <div className="mb-4">
          <FormDropdown
            label="Category"
            options={categoryOptions}
            selectedValue={category}
            onChange={handleCategoryChange}
          />
        </div>
        {/* Source Dropdown */}
        <div className="mb-4">
          <FormDropdown
            label="Source"
            options={sourceOptions}
            selectedValue={source}
            onChange={handleSourceChange}
          />
        </div>
        <span className="text-red-500">{error ? error : ""}</span>
        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Clear
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-secondary-500 rounded-lg"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferenceModal;
