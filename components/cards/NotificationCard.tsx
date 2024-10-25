import React from "react";

const NotificationCard = ({
  content,
  status,
}: {
  content: string;
  status: number;
}) => {
  return (
    <div className="flex h-12 w-full items-center justify-between rounded-[10px] border border-border-color px-4 py-2">
      <p className="text-light-500">{content}</p>
      <div className="flex items-center">
        {status === 1 && (
          <span className="mr-2 block size-2 rounded-full bg-green-500"></span>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
