"use client";
import { useReducer, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { api } from "~/trpc/react";
import Solution from "./Solution";
import FileUpload from "./FileUpload";
import Button from "./Button";
import {
  cleanSolution,
  prepareMathProblemForRendering,
  removeDelimiters,
} from "../utils/cleanMath";
import SelectSampleProblem from "./SelectSampleProblem";
import { isMobileDevice } from "../utils/device";
import {
  mathSolverInitialState,
  mathSolverReducer,
} from "../reducers/mathSolver";
import MathProblemDisplay from "./MathProblemDisplay";
import { LoadingIndicator } from "./LoadingIndicator";
import { ErrorMessage } from "./ErrorMessage";

export default function MathSolver() {
  const [state, dispatch] = useReducer(
    mathSolverReducer,
    mathSolverInitialState,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const isInitialState =
    !state.showCamera &&
    !state.showExistingProblems &&
    !state.image &&
    !state.solution;

  const applyOCR = api.ocr.applyOCR.useMutation();
  const generateSolution = api.solve.solveRouter.useMutation();
  const formatSolution = api.format.formatSolution.useMutation();

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current?.getScreenshot();

      if (imageSrc) {
        dispatch({ type: "SET_IMAGE", payload: imageSrc });
        dispatch({ type: "SET_SHOW_CAMERA", payload: false });
        dispatch({ type: "SET_MATH_PROBLEM", payload: "" });
      }
    }
  }, [webcamRef]);

  const toggleCameraFacingMode = () => {
    dispatch({
      type: "SET_FACING_MODE",
      payload: state.facingMode === "user" ? "environment" : "user",
    });
  };

  const selectSampleProblem = (imageSrc: string) => {
    dispatch({ type: "SET_IMAGE", payload: imageSrc });
    dispatch({ type: "SET_SHOW_EXISTING_PROBLEMS", payload: false });
    dispatch({ type: "SET_MATH_PROBLEM", payload: "" });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SHOW_CAMERA", payload: false });
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({ type: "SET_IMAGE", payload: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getMathProblem = async (image: string) => {
    const { mathProblems } = await applyOCR.mutateAsync({ image });
    const cleanProblem = removeDelimiters(mathProblems);
    const mathProblemForDisplay = prepareMathProblemForRendering(cleanProblem);
    dispatch({
      type: "SET_MATH_PROBLEM",
      payload: mathProblemForDisplay,
    });

    return cleanProblem;
  };

  const getSolution = async (mathProblems: string) => {
    const { solution } = await generateSolution.mutateAsync({
      mathProblems,
    });
    const { formattedSolution } = await formatSolution.mutateAsync({
      solution,
    });
    dispatch({
      type: "SET_SOLUTION",
      payload: cleanSolution(formattedSolution),
    });
  };

  const handleSubmit = async () => {
    if (!state.image) return;

    dispatch({ type: "SET_IS_SOLUTION_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const mathProblem = await getMathProblem(state.image);
      await getSolution(mathProblem);
    } catch (error) {
      console.error(error);
      dispatch({
        type: "SET_ERROR",
        payload:
          "Error solving math problem. Please try again by clicking `Restart`.",
      });
    } finally {
      dispatch({ type: "SET_IS_SOLUTION_LOADING", payload: false });
    }
  };

  const handleRestart = () => {
    dispatch({ type: "RESET_STATE" });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    dispatch({ type: "SET_IS_MOBILE", payload: isMobileDevice() });
  }, []);

  return (
    <div className="flex flex-col items-center p-6">
      {isInitialState && (
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
              onClick={() =>
                dispatch({ type: "SET_SHOW_CAMERA", payload: true })
              }
              className="w-full sm:w-auto"
            >
              Open Camera
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                dispatch({ type: "SET_SHOW_EXISTING_PROBLEMS", payload: true })
              }
              className="w-full sm:w-auto"
            >
              Try a sample problem
            </Button>

            {!state.isMobile && (
              <FileUpload
                fileInputRef={fileInputRef}
                handleUpload={handleFileUpload}
              />
            )}
          </div>
        </div>
      )}

      {state.showExistingProblems && (
        <SelectSampleProblem
          onSelectImage={selectSampleProblem}
          onCancel={handleRestart}
        />
      )}

      {state.showCamera && (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            <Webcam
              audio={false}
              className="rounded-lg"
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: state.facingMode,
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
            {state.isMobile && (
              <Button
                variant="secondary"
                onClick={toggleCameraFacingMode}
                className="w-full sm:w-auto"
              >
                Switch to {state.facingMode === "user" ? "Back" : "Front"}{" "}
                Camera
              </Button>
            )}
            <Button
              variant="danger"
              onClick={handleRestart}
              className="w-full sm:w-auto"
              disabled={state.isSolutionLoading}
            >
              Restart
            </Button>
          </div>
        </div>
      )}

      {state.image && (
        <div className="mt-6 flex w-full flex-col items-center">
          <div className="w-full max-w-md">
            <Image
              src={state.image}
              alt="Captured"
              className="w-full rounded-lg shadow-xl"
              width={500}
              height={500}
            />
          </div>

          <div className="mt-4 flex flex-col space-y-5 sm:flex-row sm:space-x-6 sm:space-y-0">
            {!state.solution && (
              <Button
                variant="primary"
                className="w-full sm:w-auto"
                disabled={state.isSolutionLoading}
                onClick={handleSubmit}
              >
                Solve
              </Button>
            )}

            <Button
              variant="danger"
              className="w-full sm:w-auto"
              disabled={state.isSolutionLoading}
              onClick={handleRestart}
            >
              Restart
            </Button>
          </div>
        </div>
      )}

      {state.mathProblem && (
        <MathProblemDisplay mathProblem={state.mathProblem} />
      )}

      {state.solution && <Solution solution={state.solution} />}

      {state.isSolutionLoading && <LoadingIndicator />}

      {state.error && <ErrorMessage error={state.error} />}
    </div>
  );
}
