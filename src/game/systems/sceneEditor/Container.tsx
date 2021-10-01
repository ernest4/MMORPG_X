import React from "react";

const Container = ({ children }: any) => {
  return <div {...{ className: "p-4 bg-gray-500 text-white rounded", children }} />;
};

export default Container;
