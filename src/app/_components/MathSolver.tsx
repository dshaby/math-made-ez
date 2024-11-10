"use client";

import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Image from "next/image";
import { api } from "~/trpc/react";
import styles from "../index.module.css";

export default function MathSolver() {
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [mathProblem, setMathProblem] = useState<string>("");
  const [solution, setSolution] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSolutionLoading, setIsSolutionLoading] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const initialState = !showCamera && !image && !solution;
  const analyzeImage = api.math.analyzeImage.useMutation();

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current?.getScreenshot();

      if (imageSrc) {
        setImage(imageSrc);
        setShowCamera(false);
        setMathProblem("");
      }
    }
  }, [webcamRef]);

  const handleSubmit = async () => {
    if (!image) {
      setError("No image to submit");
      return;
    }

    setIsSolutionLoading(true);
    setError(null);

    try {
      const { mathProblems, solution: solutionSteps } =
        await analyzeImage.mutateAsync({ image });
      setMathProblem(mathProblems);
      setSolution(solutionSteps);
      setError(null);
    } catch (error) {
      console.error("Error submitting image:", error);
      setError(JSON.stringify(error));
    } finally {
      setIsSolutionLoading(false);
    }
  };

  const handleTakeNewPhoto = () => {
    setImage(null);
    setSolution(null);
    setShowCamera(true);
  };

  return (
    <div>
      {initialState && (
        <button onClick={() => setShowCamera(true)}>Open Camera</button>
      )}

      {showCamera && (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="60%"
          />
          <div>
            <button onClick={capture}>Take Picture</button>
          </div>
        </div>
      )}

      {image && (
        <div>
          <Image
            src={image}
            alt="Captured"
            layout="responsive"
            width={300}
            height={300}
            className={styles.capturedImage}
          />

          <MathJaxContext>
            {mathProblem && (
              <div className={styles.mathProblem}>
                <h3>Math Problem:</h3>
                <MathJax>{mathProblem}</MathJax>
              </div>
            )}

            {solution && (
              <div className={styles.solutionContainer}>
                {<MathJax>{solution}</MathJax>}
              </div>
            )}
          </MathJaxContext>
          <button
            disabled={isSolutionLoading}
            onClick={solution ? handleTakeNewPhoto : handleSubmit}
          >
            {solution ? "Take New Photo" : "Solve"}
          </button>
          <button onClick={handleTakeNewPhoto}>Retake Photo</button>
        </div>
      )}

      {isSolutionLoading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
