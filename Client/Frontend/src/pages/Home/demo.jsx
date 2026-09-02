import { useSelector } from "react-redux";

const Demo = () => {
  const reduxState = useSelector((state) => state);

  return <div>Message</div>;
};

export default Demo;
