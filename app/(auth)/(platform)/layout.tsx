const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-grow">{children}</div>
    </main>
  );
};

export default PlatformLayout;
