import React from "react";
import Header from "../../components/Header";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="max-w-5xl mx-auto">
      <Header />
      <div className="pt-16">{children}</div>
    </main>
  );
};

export default layout;
