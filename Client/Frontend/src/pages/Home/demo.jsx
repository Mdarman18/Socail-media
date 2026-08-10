import { useSelector } from "react-redux";

const Demo = () => {
  const reduxState = useSelector((state) => state);

  console.log("🔥 COMPLETE REDUX STATE:", reduxState);

  return <div>Message</div>;
};

export default Demo;
