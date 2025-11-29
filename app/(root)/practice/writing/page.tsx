import React from "react";
import WritingTask from "@/components/practice/WritingTask";
import ProtectPage from "@/components/shared/ProtectPage";

export default function Page() {
  return (
    <ProtectPage>
      <WritingTask />
    </ProtectPage>
  );
}
