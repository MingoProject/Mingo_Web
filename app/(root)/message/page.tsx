import React from "react";
import MessageContent from "./[id]/page";
const Page = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <MessageContent />
    </React.Suspense>
  );
};

export default Page;
