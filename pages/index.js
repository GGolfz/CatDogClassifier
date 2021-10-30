import { useState, useEffect, Fragment } from "react";
import * as tf from "@tensorflow/tfjs";
import UploadIcon from "../components/icons/upload";
import styles from "../styles/Home.module.css";
import Dialog from "@material-ui/core/Dialog";
import Button from '@material-ui/core/Button';
import CircularProgress from "@material-ui/core/CircularProgress";

class L2 {
  static className = "L2";

  constructor(config) {
    return tf.regularizers.l1l2(config);
  }
}

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [predict, setPredict] = useState(null);
  const [img, setImg] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [model, setModel] = useState(null);

  useEffect(async () => {
    await loadModel();
  }, []);

  useEffect(() => {
    if (img) {
      prediction();
    }
  }, [img]);
  
  const loadModel = async () => {
    tf.serialization.registerClass(L2);
    const model = await tf.loadLayersModel("model/model.json");
    setModel(model);
  };

  const prediction = async () => {
    setLoading(true);
    var image = new Image();
    image.src = img;
    image.onload = () => {
      const input = tf.browser.fromPixels(image);
      const inputResized = tf.image.resizeBilinear(input, [150, 150]);
      const predictionResult = model.predict(
        inputResized.div(255.0).reshape([1, 150, 150, 3])
      );
      const values = predictionResult.dataSync();
      const arr = Array.from(values);
      if(arr[0] >= 0.5) {
        setPredict("Dog");
      } else {
        setPredict("Cat");
      }
      setDialog(true);
      setLoading(false);
    };
  };
  
  const handleClickUpload = () => {
    document.getElementById("fileUpload").click();
  };

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      var reader = new FileReader();
      reader.onloadend = function () {
        if (reader.result) {
          setImg(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <Fragment>
      <div className={styles.container}>
        <main className={styles.main}>
          <Fragment>
            <h1 className={styles.title}>
              Cat Dog <a href="#">Classifier</a>
            </h1>

            <p className={styles.description}>
              Get started by upload your image
            </p>
            <input
              type="file"
              style={{ display: "none" }}
              id="fileUpload"
              onChange={handleFileUpload}
            />
            {dialog && predict ? (
              <Dialog open={dialog} onClose={() => setDialog(false)}>
                <div className={styles.container_dialog}>
                  <h2>Prediction Result</h2>
                  <img
                    src={img}
                    alt="crop-img"
                    width="300"
                    height="300"
                  />
                  <h3>{predict}</h3>
                  <Button variant="contained" color="primary" onClick={() => setDialog(false)}>
                    Ok
                  </Button>
                </div>
              </Dialog>
            ) : null}
            
            <div className={styles.grid} onClick={handleClickUpload}>
              <div className={styles.card}>
                {loading ? (
                  <CircularProgress size={60} />
                ) : (
                  <Fragment>
                    <UploadIcon />
                    <h2>Upload Image</h2>
                  </Fragment>
                )}
              </div>
            </div>
          </Fragment>
        </main>
      </div>
    </Fragment>
  );
};
export default Home;
