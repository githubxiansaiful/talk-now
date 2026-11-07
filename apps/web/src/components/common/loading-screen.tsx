interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-9 h-9 rounded-full border-3 border-[#7657E8] border-t-transparent animate-spin mb-3" />
      <p className="text-sm font-medium text-[var(--text-secondary)]">{message}</p>
    </div>
  );
}
