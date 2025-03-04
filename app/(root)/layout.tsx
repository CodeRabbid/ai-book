import React from "react";
import Header from "../../components/Header";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="max-w-5xl mx-auto ">
      <Header />
      {children}
    </main>
  );
};

export default layout;
