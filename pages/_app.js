import { Fragment } from "react";
import "../styles/globals.css";
import "../styles/image-crop.css";

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Component {...pageProps} />
    </Fragment>
  );
}

export default MyApp;
