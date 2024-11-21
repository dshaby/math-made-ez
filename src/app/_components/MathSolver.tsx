"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Image from "next/image";
import { api } from "~/trpc/react";
import styles from "../index.module.css";
import Solution from "./Solution";
import FileUpload from "./FileUpload";

const isMobileDevice = () => {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
};

export default function MathSolver() {
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [mathProblem, setMathProblem] = useState<string>("");
  const [solution, setSolution] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSolutionLoading, setIsSolutionLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const initialState = !showCamera && !image && !solution;
  const applyOCR = api.ocr.applyOCR.useMutation();
  const generateSolution = api.solve.solveRouter.useMutation();
  const formatSolution = api.format.formatSolution.useMutation();

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("No image to submit");
      return;
    }

    setIsSolutionLoading(true);
    setError(null);

    try {
      const { mathProblems } = await applyOCR.mutateAsync({ image });
      setMathProblem(`\\[${decodeURIComponent(mathProblems)}\\]`);

      const { solution } = await generateSolution.mutateAsync({ mathProblems });
      const { formattedSolution } = await formatSolution.mutateAsync({
        solution,
      });

      setSolution(formattedSolution);
      setError(null);
    } catch (error) {
      console.error("Error submitting image:", error);
      setError(JSON.stringify(error));
    } finally {
      setIsSolutionLoading(false);
    }
  };

  const handleRestart = () => {
    setImage(null);
    setSolution(null);
    setMathProblem("");
    setError(null);
    setShowCamera(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleCameraFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

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
            videoConstraints={{
              facingMode,
            }}
          />
          <div>
            <button onClick={capture}>Take Picture</button>
            {isMobile && (
              <button onClick={toggleCameraFacingMode}>
                Switch to {facingMode === "user" ? "Back" : "Front"} Camera
              </button>
            )}
          </div>
        </div>
      )}

      {!isMobile && !solution && !image && (
        <FileUpload
          fileInputRef={fileInputRef}
          handleUpload={handleFileUpload}
        />
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

            {solution && <Solution solution={solution} />}
          </MathJaxContext>

          {!solution && (
            <button disabled={isSolutionLoading} onClick={handleSubmit}>
              Solve
            </button>
          )}

          <button disabled={isSolutionLoading} onClick={handleRestart}>
            Restart
          </button>
        </div>
      )}

      {isSolutionLoading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
