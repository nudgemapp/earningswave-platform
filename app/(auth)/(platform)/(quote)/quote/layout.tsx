const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen bg-white dark:bg-slate-900">
      <div className="w-full">{children}</div>
    </main>
  );
};

export default PlatformLayout;
