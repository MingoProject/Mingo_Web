import {
  faMicrophone,
  faFaceSmile,
  faImage,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FooterMessage = () => {
  return (
    <div className="sticky bottom-0 w-full bg-white px-6 py-2 flex items-center gap-4">
      <div className="flex gap-2 px-4 items-center w-full border border-border-color rounded-3xl h-12 bg-gray-100">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Aa"
            className="w-full border-none outline-none bg-transparent text-sm text-gray-700 placeholder-gray-500 focus:ring-0"
          />
        </div>
        <div className="flex gap-3">
          <FontAwesomeIcon
            icon={faMicrophone}
            size="lg"
            className="text-primary-100 cursor-pointer hover:text-primary-200"
          />
          <FontAwesomeIcon
            icon={faFaceSmile}
            size="lg"
            className="text-primary-100 cursor-pointer hover:text-primary-200"
          />
          <FontAwesomeIcon
            icon={faImage}
            size="lg"
            className="text-primary-100 cursor-pointer hover:text-primary-200"
          />
        </div>
      </div>
      <div className="bg-primary-100 flex items-center justify-center rounded-full w-10 h-10 p-2 cursor-pointer hover:bg-primary-200">
        <FontAwesomeIcon icon={faPaperPlane} size="lg" className="text-white" />
      </div>
    </div>
  );
};

export default FooterMessage;
