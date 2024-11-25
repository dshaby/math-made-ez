"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { api } from "~/trpc/react";
import Solution from "./Solution";
import FileUpload from "./FileUpload";
import Button from "./Button";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cleanSolution } from "../utils/cleanSolution";

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
    setShowCamera(false);
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
      setMathProblem(decodeURIComponent(mathProblems));

      const { solution } = await generateSolution.mutateAsync({ mathProblems });
      const { formattedSolution } = await formatSolution.mutateAsync({
        solution,
      });

      setSolution(cleanSolution(formattedSolution));
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
    <div className="flex flex-col items-center p-6">
      {initialState && (
        <div className="flex flex-col items-center">
          <figure className="w-full max-w-md">
            <Image
              alt="image description"
              className="h-auto w-auto max-w-full rounded-lg"
              height={300}
              priority
              src="https://flowbite.com/docs/images/examples/image-3@2x.jpg"
              width={500}
            />
          </figure>
          <div className="mt-4 flex space-x-4">
            <Button
              variant="primary"
              onClick={() => setShowCamera(true)}
              className="w-full sm:w-auto"
            >
              Open Camera
            </Button>

            {!isMobile && (
              <FileUpload
                fileInputRef={fileInputRef}
                handleUpload={handleFileUpload}
              />
            )}
          </div>
        </div>
      )}

      {showCamera && (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            <Webcam
              audio={false}
              className="rounded-lg"
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode,
              }}
            />
          </div>

          <div className="mt-4 flex flex-col space-y-5 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              variant="success"
              onClick={capture}
              className="w-full sm:w-auto"
            >
              Take Picture
            </Button>
            {isMobile && (
              <Button
                variant="secondary"
                onClick={toggleCameraFacingMode}
                className="w-full sm:w-auto"
              >
                Switch to {facingMode === "user" ? "Back" : "Front"} Camera
              </Button>
            )}
            <Button
              variant="danger"
              onClick={handleRestart}
              className="w-full sm:w-auto"
              disabled={isSolutionLoading}
            >
              Restart
            </Button>
          </div>
        </div>
      )}

      {image && (
        <div className="mt-6 flex w-full flex-col items-center">
          <div className="w-full max-w-md">
            <Image
              src={image}
              alt="Captured"
              className="w-full rounded-lg shadow-xl"
              width={500}
              height={500}
            />
          </div>

          <div className="mt-4 flex flex-col space-y-5 sm:flex-row sm:space-x-6 sm:space-y-0">
            {!solution && (
              <Button
                variant="primary"
                className="w-full sm:w-auto"
                disabled={isSolutionLoading}
                onClick={handleSubmit}
              >
                Solve
              </Button>
            )}

            <Button
              variant="danger"
              className="w-full sm:w-auto"
              disabled={isSolutionLoading}
              onClick={handleRestart}
            >
              Restart
            </Button>
          </div>

          {mathProblem && (
            <div className="mt-6 w-full max-w-md overflow-x-auto overflow-y-hidden rounded-lg border border-gray-300 bg-white p-4 shadow-md">
              <h3 className="mb-2 text-xl font-semibold">Math Problem:</h3>
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >{`$$${mathProblem}$$`}</ReactMarkdown>
            </div>
          )}

          {solution && (
            <div className="mt-4 w-full max-w-4xl overflow-x-auto">
              <Solution solution={solution} />
            </div>
          )}
        </div>
      )}

      {isSolutionLoading && (
        <p className="mt-4 text-lg font-semibold text-blue-500">Loading...</p>
      )}
      {error && (
        <p className="mt-4 overflow-x-auto text-lg font-semibold text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
