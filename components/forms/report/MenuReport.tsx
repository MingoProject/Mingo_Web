import ReportCard from "@/components/cards/ReportCard";

import React, { useState, useRef } from "react";

const ReportMenu = ({
  userId,
  isReported,
}: {
  userId: string;
  isReported: boolean;
}) => {
  const menuRef = useRef(null);
  const [isReport, setIsReport] = useState(isReported);

  return (
    <div
      ref={menuRef}
      className="background-light800_dark400 mt-2 w-28 mr-4  rounded-lg border shadow-lg"
    >
      <button
        className="text-dark100_light500 w-full px-4 py-1 text-left text-sm hover:bg-gray-200"
        onClick={() => setIsReport(true)}
      >
        Report
      </button>
      {isReport && (
        <ReportCard
          onClose={() => setIsReport(false)}
          type="user"
          entityId={userId}
          reportedId={userId}
        />
      )}
    </div>
  );
};

export default ReportMenu;
