interface Props {
  error: string;
}
export const ErrorMessage = ({ error }: Props) => {
  return (
    <p className="mt-4 overflow-x-auto text-lg font-semibold text-red-500">
      {error}
    </p>
  );
};
