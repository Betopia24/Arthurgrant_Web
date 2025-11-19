import { FaCircleCheck } from "react-icons/fa6";

const CompletePageFooterMessage = ({ text }: { text: string }) => {
  return (
    <div className="mt-12 w-full flex items-center justify-center gap-3 border-2 border-green-500 rounded-xl p-6 bg-[#1a2a1a]">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
        <FaCircleCheck className="w-5 h-5 text-white" />
      </div>

      <span className="text-lg text-green-500 font-semibold">{text}</span>
    </div>
  );
};

export default CompletePageFooterMessage;
