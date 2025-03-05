import React from "react";
import Header from "../../components/Header";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="max-w-5xl mx-auto h-full">
      <Header />
      <div className="pt-16 min-h-screen flex flex-col">{children}</div>
    </main>
  );
};

export default layout;
