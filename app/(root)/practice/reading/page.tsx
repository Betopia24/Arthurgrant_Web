import React from "react";
import ReadingTask from "@/components/practice/ReadingTask";
import ProtectPage from "@/components/shared/ProtectPage";

export default function Page() {
  return (
    <ProtectPage>
      <ReadingTask />
    </ProtectPage>
  );
}
