"use client";

import { useState } from "react";
import Intro from "@/components/Intro";
import QuestionFlow from "@/components/QuestionFlow";

export default function Home() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <Intro onStart={() => setStarted(true)} />;
  }

  return <QuestionFlow />;
}
