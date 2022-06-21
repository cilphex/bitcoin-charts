// From:
// https://stackoverflow.com/questions/52447828/is-there-a-way-to-modify-the-page-title-with-react-router-v4

import { useEffect } from "react";

const Page = (props) => {
  useEffect(() => {
    document.title = props.title || "Bitcoin Charts";
    document
      .querySelector("meta[name='description']")
      .setAttribute("content", props.description || "Bitcoin price charts.");
  }, [props.title]);

  return props.children;
};

export default Page;
