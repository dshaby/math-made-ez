"use client";
import { useReducer, useRef, useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { api } from "~/trpc/react";
import Solution from "./Solution";
import Button from "./Button";
import {
  cleanSolution,
  prepareMathProblemForRendering,
  removeDelimiters,
} from "../utils/cleanMath";
import SelectSampleProblem, { sampleImages } from "./SelectSampleProblem";
import { isMobileDevice } from "../utils/device";
import {
  mathSolverInitialState,
  mathSolverReducer,
} from "../reducers/mathSolver";
import MathProblemDisplay from "./MathProblemDisplay";
import { LoadingIndicator } from "./LoadingIndicator";
import { ErrorMessage } from "./ErrorMessage";
import ImageUploader from "./ImageUploader";

export default function MathSolver() {
  const [state, dispatch] = useReducer(
    mathSolverReducer,
    mathSolverInitialState,
  );
  const webcamRef = useRef<Webcam>(null);
  const solvingAnchorRef = useRef<HTMLDivElement>(null);
  const resultsAnchorRef = useRef<HTMLDivElement>(null);
  const [isSampleLoading, setIsSampleLoading] = useState(false);

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

  const convertImageToDataUrl = async (imageSrc: string): Promise<string> => {
    const response = await fetch(imageSrc);
    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(blob);
    });
  };

  const selectSampleProblem = async (imageSrc: string) => {
    setIsSampleLoading(true);
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const base64Image = await convertImageToDataUrl(imageSrc);
      dispatch({ type: "SET_IMAGE", payload: base64Image });
      dispatch({ type: "SET_SHOW_EXISTING_PROBLEMS", payload: true });
      dispatch({ type: "SET_MATH_PROBLEM", payload: "" });
      dispatch({ type: "SET_SHOW_CAMERA", payload: false });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "SET_ERROR",
        payload: "Unable to load sample right now. Please try another sample.",
      });
    } finally {
      setIsSampleLoading(false);
    }
  };

  const openSampleProblems = () => {
    dispatch({ type: "SET_SHOW_EXISTING_PROBLEMS", payload: true });

    const firstSample = sampleImages[0]?.src;
    if (!firstSample || isSampleLoading) return;
    void selectSampleProblem(firstSample);
  };

  const handleImageUpload = (imageSrc: string) => {
    dispatch({ type: "SET_IMAGE", payload: imageSrc });
    dispatch({ type: "SET_SHOW_CAMERA", payload: false });
    dispatch({ type: "SET_MATH_PROBLEM", payload: "" });
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
    applyOCR.reset();
    generateSolution.reset();
    formatSolution.reset();
    dispatch({ type: "RESET_STATE" });
  };

  useEffect(() => {
    dispatch({ type: "SET_IS_MOBILE", payload: isMobileDevice() });
  }, []);

  useEffect(() => {
    if (state.isSolutionLoading) {
      solvingAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [state.isSolutionLoading]);

  useEffect(() => {
    if (state.mathProblem || state.solution || state.error) {
      resultsAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [state.mathProblem, state.solution, state.error]);

  const isReadingImage = applyOCR.isPending;
  const isReadComplete = Boolean(state.mathProblem) || applyOCR.isSuccess;
  const isSolvingMath = generateSolution.isPending;
  const isSolveComplete = generateSolution.isSuccess;
  const isFormattingSolution = formatSolution.isPending;
  const isFormatComplete = Boolean(state.solution) || formatSolution.isSuccess;
  const hasSolveOutput = [state.mathProblem, state.solution, state.error].some(
    Boolean,
  );

  const pipelineStatuses = [
    {
      label: "OCR extracted",
      state: state.error && applyOCR.isError
        ? "fallback"
        : isReadComplete
          ? "success"
          : isReadingImage
            ? "active"
            : "idle",
      detail: state.error && applyOCR.isError ? "Retry required" : "Image parsing",
    },
    {
      label: "Wolfram checked",
      state: state.error && generateSolution.isError
        ? "fallback"
        : generateSolution.isSuccess
          ? "success"
          : generateSolution.isPending
            ? "active"
            : "idle",
      detail:
        state.error && generateSolution.isError
          ? "Unavailable"
          : "Computation verification",
    },
    {
      label: "AI explained",
      state: state.error && (generateSolution.isError || formatSolution.isError)
        ? "fallback"
        : Boolean(state.solution)
          ? "success"
          : isSolvingMath || isFormattingSolution
            ? "active"
            : "idle",
      detail:
        state.error && (generateSolution.isError || formatSolution.isError)
          ? "Retry required"
          : "Step-by-step reasoning",
    },
  ] as const;

  const statusClasses = {
    idle: "border-stone-300/70 bg-white/70 text-stone-600",
    active: "border-teal-700/70 bg-teal-100/80 text-teal-900",
    success: "border-green-700/70 bg-green-100/80 text-green-900",
    fallback: "border-orange-700/70 bg-orange-100/80 text-orange-900",
  };

  return (
    <div
      className={`section-reveal mx-auto flex w-full max-w-6xl flex-col items-center gap-6 ${
        state.image ? "pb-28 sm:pb-0" : ""
      }`}
    >
      {isInitialState && (
        <div className="glass-card flex w-full flex-col items-center rounded-3xl px-4 py-6 sm:px-8 sm:py-10">
          <div className="mb-6 flex max-w-2xl flex-col items-center gap-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Start Here
            </p>
            <h3 className="font-serif text-3xl font-semibold text-stone-900 sm:text-4xl">
              Bring your problem into focus
            </h3>
            <p className="text-sm text-stone-600 sm:text-base">
              Upload a photo, use your camera, or preview a curated sample set.
            </p>
          </div>
          <ImageUploader
            onImageUpload={handleImageUpload}
            isMobile={state.isMobile}
          />
          <div className="mt-6 flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              variant="secondary"
              onClick={() =>
                dispatch({ type: "SET_SHOW_CAMERA", payload: true })
              }
              className="w-full"
            >
              Open Camera
            </Button>

            <Button
              variant="success"
              onClick={openSampleProblems}
              className="w-full"
            >
              Try Demo Problems
            </Button>
          </div>
          <p className="mt-3 text-center text-sm text-stone-600">
            No math problem handy? Start with demo examples.
          </p>
        </div>
      )}

      {state.showExistingProblems && (
        <div className="glass-card w-full rounded-3xl px-4 py-6 sm:px-8 sm:py-8">
          <SelectSampleProblem
            onSelectImage={selectSampleProblem}
            isLoading={isSampleLoading}
          />
          {state.image && (
            <div className="mt-6 hidden w-full flex-col gap-4 sm:flex sm:flex-row sm:justify-center">
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
          )}
        </div>
      )}

      {state.showCamera && (
        <div className="glass-card flex w-full flex-col items-center rounded-3xl px-4 py-6 sm:px-8 sm:py-8">
          <div className="mb-6 flex max-w-2xl flex-col items-center gap-2 text-center">
            <h3 className="font-serif text-3xl font-semibold text-stone-900">
              Frame your math clearly
            </h3>
            <p className="text-sm text-stone-600">
              Keep the whole expression in view for the best OCR accuracy.
            </p>
          </div>
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-stone-900/10 bg-stone-950/95 p-2">
            <Webcam
              audio={false}
              className="h-full w-full rounded-xl"
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: state.facingMode,
              }}
            />
          </div>

          <div className="mt-6 flex w-full max-w-3xl flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
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

      {state.image && !state.showExistingProblems && (
        <div className="glass-card mt-2 flex w-full flex-col items-center rounded-3xl px-4 py-6 sm:px-8 sm:py-8">
          <div className="mb-6 text-center">
            <h3 className="font-serif text-3xl font-semibold text-stone-900">
              Problem Snapshot
            </h3>
            <p className="text-sm text-stone-600">
              If everything looks correct, run the solver.
            </p>
          </div>
          <div className="mb-6 hidden w-full max-w-3xl flex-col gap-4 sm:flex sm:flex-row sm:justify-center">
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
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-stone-900/10 bg-white/75 p-2">
            <Image
              src={state.image}
              alt="Captured"
              className="max-h-[52vh] w-full rounded-xl object-contain shadow-xl shadow-stone-900/10"
              width={500}
              height={500}
            />
          </div>
        </div>
      )}

      <div ref={solvingAnchorRef} className="h-px w-full" />
      <div ref={resultsAnchorRef} className="h-px w-full" />

      {state.image &&
        !state.isSolutionLoading &&
        hasSolveOutput && (
        <div className="glass-card w-full rounded-2xl px-4 py-4 sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-stone-600">
            Accuracy Signals
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {pipelineStatuses.map((status) => (
              <div
                key={status.label}
                className={`rounded-xl border px-3 py-2 ${statusClasses[status.state]}`}
              >
                <p className="text-sm font-semibold">{status.label}</p>
                <p className="text-xs opacity-90">{status.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {state.mathProblem && (
        <div className="w-full">
          <MathProblemDisplay mathProblem={state.mathProblem} />
        </div>
      )}

      {state.solution && (
        <div className="w-full">
          <Solution solution={state.solution} />
        </div>
      )}

      {state.isSolutionLoading && (
        <LoadingIndicator
          isReadingImage={isReadingImage}
          isSolving={isSolvingMath}
          isFormatting={isFormattingSolution}
          isReadComplete={isReadComplete}
          isSolveComplete={isSolveComplete}
          isFormatComplete={isFormatComplete}
        />
      )}

      {state.error && <ErrorMessage error={state.error} />}

      {state.image && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-300/80 bg-white/90 px-4 py-3 backdrop-blur-md sm:hidden">
          <div className="mx-auto flex w-full max-w-6xl gap-3">
            {!state.solution && (
              <Button
                variant="primary"
                className="w-full"
                disabled={state.isSolutionLoading}
                onClick={handleSubmit}
              >
                Solve
              </Button>
            )}
            <Button
              variant="danger"
              className="w-full"
              disabled={state.isSolutionLoading}
              onClick={handleRestart}
            >
              Restart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
