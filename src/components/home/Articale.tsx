import { NormalizedArticle } from "../../types";
import { formatedDate } from "../../utils/date";
const Articale: React.FC<NormalizedArticle> = ({
  title,
  description,
  image,
  date,
  source,
  author,
  web_url,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
      <a href={web_url} target="__blank">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
      </a>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        <p className="text-sm text-gray-600 mt-2">{description}</p>

        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <span>{source}</span>
          <span>{author}</span>
          <span>{formatedDate(date)}</span>
        </div>
      </div>
    </div>
  );
};

export default Articale;
